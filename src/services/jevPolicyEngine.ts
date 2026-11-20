/**
 * JEV Policy Engine - Local Customer Environment Simulation
 * Enforces local privacy boundaries before telemetry egresses PC 1
 * Strictly deterministic frontend simulation
 */

import { FieldDecision, JevPolicy, PrivacyOutcome, RawTelemetryEvent } from '../types/pc1';

export interface EventPrivacyInspection {
  eventId: string;
  originalFields: Record<string, any>;
  privacyDecision: PrivacyOutcome;
  allowedFields: string[];
  redactedFields: string[];
  blockedFields: string[];
  sanitizedOutput: Record<string, any>;
  policyVersion: string;
  decisionTimestamp: string;
  decisionReason: string;
  fieldDecisions: FieldDecision[];
}

export interface PolicyTestResult {
  isApproved: boolean;
  privacyOutcome: PrivacyOutcome;
  summary: {
    totalFieldsProcessed: number;
    fieldsAllowed: number;
    fieldsRedacted: number;
    fieldsDropped: number;
    fieldsPseudonymized: number;
  };
  fieldDecisions: FieldDecision[];
  sanitizedOutput: Record<string, any>;
  rejectionReason?: string;
  policyVersion: string;
  decisionTimestamp: string;
}

// Simple deterministic hash simulation for pseudonymization
function simulateHmacPseudonym(val: string, prefix = 'ps'): string {
  let hash = 0;
  const str = `enterprise-production-salt-2026:${val}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${prefix}_${hex.slice(0, 6)}`;
}

export function evaluateJevPolicy(
  rawInput: Record<string, any>,
  policy: JevPolicy
): PolicyTestResult {
  const decisions: FieldDecision[] = [];
  const sanitizedOutput: Record<string, any> = {};
  let isApproved = true;
  let rejectionReason: string | undefined = undefined;
  const decisionTimestamp = new Date().toISOString();

  // 1. Check for unapproved memory dumps or stack dumps that trigger immediate rejection
  const fatalPatterns = ['stack_dump', 'raw_body', 'core_dump', 'memory_heap'];
  for (const key of Object.keys(rawInput)) {
    if (fatalPatterns.includes(key.toLowerCase())) {
      isApproved = false;
      rejectionReason = `Event contains forbidden raw unstructured dump in field '${key}' violating JEV Rule 6.`;
      decisions.push({
        fieldName: key,
        originalValue: rawInput[key],
        decision: 'Blocked',
        ruleApplied: 'rule-free-text',
        reason: 'Raw memory/heap dump prohibited from egress across trust boundary.',
      });
      break;
    }
  }

  // 2. Iterate each key
  const secretKeywords = ['token', 'api_key', 'secret', 'bearer', 'authorization', 'jwt'];
  const passwordKeywords = ['password', 'passwd', 'db_password', 'secret_key'];
  const idKeywords = ['user_id', 'account_id', 'client_ip', 'ip_address', 'customer_id', 'transaction_id'];
  const piiKeywords = ['email', 'user_email', 'phone', 'ssn', 'card_number', 'pan_card_number'];

  for (const [key, val] of Object.entries(rawInput)) {
    const lowerKey = key.toLowerCase();

    // Already marked rejected
    if (fatalPatterns.includes(lowerKey)) {
      continue;
    }

    // A. Check Secrets & API tokens
    if (secretKeywords.some((kw) => lowerKey.includes(kw))) {
      decisions.push({
        fieldName: key,
        originalValue: val,
        sanitizedValue: '[REDACTED_SECRET]',
        decision: 'Redacted',
        ruleApplied: 'rule-secrets',
        reason: 'Detected high-entropy token or authorization credential.',
      });
      sanitizedOutput[key] = '[REDACTED_SECRET]';
      continue;
    }

    // B. Check Passwords
    if (passwordKeywords.some((kw) => lowerKey.includes(kw))) {
      decisions.push({
        fieldName: key,
        originalValue: val,
        sanitizedValue: '[REDACTED_PASS]',
        decision: 'Redacted',
        ruleApplied: 'rule-passwords',
        reason: 'Detected password or credential variable.',
      });
      sanitizedOutput[key] = '[REDACTED_PASS]';
      continue;
    }

    // C. Check PII
    if (piiKeywords.some((kw) => lowerKey.includes(kw))) {
      decisions.push({
        fieldName: key,
        originalValue: val,
        decision: 'Blocked',
        ruleApplied: 'rule-pii',
        reason: 'Direct PII / financial identifier dropped unconditionally.',
      });
      continue;
    }

    // D. Check Pseudonymization
    if (idKeywords.some((kw) => lowerKey.includes(kw))) {
      const pseudoVal = simulateHmacPseudonym(String(val), lowerKey.includes('ip') ? 'ps_ip' : 'ps_id');
      decisions.push({
        fieldName: key,
        originalValue: val,
        sanitizedValue: pseudoVal,
        decision: 'Approved',
        ruleApplied: 'rule-pseudonym-ids',
        reason: 'Customer identifier replaced with keyed HMAC-SHA256 pseudonym.',
      });
      sanitizedOutput[key] = pseudoVal;
      continue;
    }

    // E. Allow-list check
    if (policy.allowedFields.includes(key) || key.startsWith('metric') || key.startsWith('label')) {
      decisions.push({
        fieldName: key,
        originalValue: val,
        sanitizedValue: val,
        decision: 'Approved',
        ruleApplied: 'Allow-list',
        reason: 'Conforms to schema allow-list and telemetry type specification.',
      });
      sanitizedOutput[key] = val;
    } else {
      decisions.push({
        fieldName: key,
        originalValue: val,
        decision: 'Blocked',
        ruleApplied: 'rule-unknown',
        reason: 'Field not defined in JEV egress allow-list.',
      });
    }
  }

  const fieldsAllowed = decisions.filter((d) => d.decision === 'Approved' || d.decision === 'ALLOWED').length;
  const fieldsRedacted = decisions.filter((d) => d.decision === 'Redacted' || d.decision === 'REDACTED').length;
  const fieldsDropped = decisions.filter((d) => d.decision === 'Blocked' || d.decision === 'DROPPED').length;
  const fieldsPseudonymized = decisions.filter((d) => d.decision === 'PSEUDONYMIZED').length;

  let outcome: PrivacyOutcome = 'Approved';
  if (!isApproved) {
    outcome = 'Blocked';
  } else if (fieldsRedacted > 0) {
    outcome = 'Redacted';
  }

  return {
    isApproved,
    privacyOutcome: outcome,
    summary: {
      totalFieldsProcessed: decisions.length,
      fieldsAllowed,
      fieldsRedacted,
      fieldsDropped,
      fieldsPseudonymized,
    },
    fieldDecisions: decisions,
    sanitizedOutput,
    rejectionReason,
    policyVersion: policy.policyVersion,
    decisionTimestamp,
  };
}

export function inspectEventPrivacy(
  event: RawTelemetryEvent,
  policy: JevPolicy
): EventPrivacyInspection {
  const result = evaluateJevPolicy(event.raw_payload || {}, policy);
  const allowed = result.fieldDecisions.filter(f => f.decision === 'Approved' || f.decision === 'ALLOWED').map(f => f.fieldName);
  const redacted = result.fieldDecisions.filter(f => f.decision === 'Redacted' || f.decision === 'REDACTED').map(f => f.fieldName);
  const blocked = result.fieldDecisions.filter(f => f.decision === 'Blocked' || f.decision === 'DROPPED' || f.decision === 'REJECTED').map(f => f.fieldName);

  return {
    eventId: event.event_id,
    originalFields: event.raw_payload || {},
    privacyDecision: result.privacyOutcome,
    allowedFields: allowed,
    redactedFields: redacted,
    blockedFields: blocked,
    sanitizedOutput: result.sanitizedOutput,
    policyVersion: policy.policyVersion,
    decisionTimestamp: result.decisionTimestamp,
    decisionReason: result.rejectionReason || (redacted.length > 0 ? `Scrubbed ${redacted.length} sensitive fields` : 'All fields passed allow-list'),
    fieldDecisions: result.fieldDecisions,
  };
}

export async function computeSha256(canonicalJsonString: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(canonicalJsonString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }

  // Deterministic fallback
  let hash = 0;
  for (let i = 0; i < canonicalJsonString.length; i++) {
    const char = canonicalJsonString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256_${hex}${hex}${hex}${hex}`.slice(0, 64);
}
