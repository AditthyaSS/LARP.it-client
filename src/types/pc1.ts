/**
 * LARP.it PC 1 · Customer Environment - TypeScript Definitions
 * Technical Reference: CICADA Final Architecture & PC 1 Gateway Specification
 * Scope: Enterprise Production Tenant Only (Healthcare is out of scope)
 */

export type SourceStatus = 'active' | 'degraded' | 'offline' | 'paused';

export interface TelemetrySource {
  id: string;
  name: string;
  category: 'web' | 'application' | 'database' | 'auth' | 'payment' | 'network';
  adapterType: 'psutil-collector' | 'syslog-forwarder' | 'ebpf-agent' | 'app-sdk';
  status: SourceStatus;
  lastCollectionTime: string;
  eventsCollected: number;
  collectionRatePerSec: number;
  environment: 'production' | 'staging';
  host: string;
  ip: string;
  version: string;
  description: string;
  isSimulated: boolean;
  metrics: {
    cpuPercent: number;
    memoryPercent: number;
    errorRate: number;
    latencyMs: number;
  };
  recentEvents: Array<{
    eventId: string;
    timestamp: string;
    eventType: string;
    severity: string;
    message: string;
    privacyDecision: string;
  }>;
}

export type EventSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface RawTelemetryEvent {
  event_id: string;
  source: string;
  service: string;
  event_type: 'metric' | 'log' | 'error' | 'audit' | 'trace';
  severity: EventSeverity;
  message: string;
  timestamp: string;
  raw_payload: Record<string, any>;
  metrics?: Record<string, number>;
  labels?: Record<string, string>;
}

export type PrivacyOutcome =
  | 'Approved'
  | 'Redacted'
  | 'Blocked'
  | 'Pending Review'
  | 'ALLOWED'
  | 'REDACTED'
  | 'DROPPED'
  | 'PSEUDONYMIZED'
  | 'REJECTED';

export interface FieldDecision {
  fieldName: string;
  originalValue: any;
  sanitizedValue?: any;
  decision: PrivacyOutcome;
  ruleApplied: string;
  reason: string;
}

export interface SanitizedEvent {
  event_id: string;
  source: string;
  service: string;
  event_type: 'metric' | 'log' | 'error' | 'audit' | 'trace';
  severity: EventSeverity;
  message: string;
  timestamp: string;
  metrics: Record<string, number>;
  labels: Record<string, string>;
  sanitized_payload?: Record<string, any>;
}

export type PipelineStage =
  | 'collected'
  | 'normalized'
  | 'privacy_review'
  | 'approved'
  | 'queued'
  | 'sending'
  | 'delivered'
  | 'blocked';

export interface PipelineItem {
  id: string;
  eventId: string;
  source: string;
  service: string;
  eventType: 'metric' | 'log' | 'error' | 'audit' | 'trace';
  severity: EventSeverity;
  stage: PipelineStage;
  timestamp: string;
  privacyOutcome: PrivacyOutcome;
  policyRule: string;
  description: string;
  payloadSize: number;
  isSimulated: boolean;
  fieldDecisions: FieldDecision[];
  rawEvent: RawTelemetryEvent;
  sanitizedEvent?: SanitizedEvent;
  rejectionReason?: string;
  decisionTimestamp?: string;
}

export interface JevRuleCategory {
  id: string;
  name: string;
  targetFields: string[];
  action: PrivacyOutcome;
  patternDescription: string;
  active: boolean;
}

export interface JevPolicy {
  policyId: string;
  policyName: string;
  policyVersion: string;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
  tenantId: 'enterprise-production';
  gatewayId: 'gateway-pc1-001';
  scope: string;
  allowedFields: string[];
  ruleCategories: JevRuleCategory[];
  enforceSchemaValidation: boolean;
  redactAuthHeaders: boolean;
  pseudonymizeIdentifiers: boolean;
  scrubSecretsAndTokens: boolean;
}

export type QueueItemStatus =
  | 'collected'
  | 'privacy_processing'
  | 'approved'
  | 'pending'
  | 'sending'
  | 'acknowledged'
  | 'failed'
  | 'retry_pending';

export interface TelemetryEnvelope {
  schema_version: string;
  tenant_id: 'enterprise-production';
  gateway_id: string;
  payload_id: string;
  policy_id: string;
  policy_version: string;
  sent_at: string;
  payload_sha256?: string;
  events: SanitizedEvent[];
}

export interface OutboundQueueItem {
  payloadId: string;
  eventIds: string[];
  source: string;
  eventCount: number;
  tenant: 'enterprise-production';
  gatewayId: string;
  createdTimestamp: string;
  payloadSizeBytes: number;
  queueStatus: QueueItemStatus;
  attemptCount: number;
  maxRetries: number;
  nextRetryTimestamp?: string;
  lastTransmissionTime?: string;
  destinationUrl: string;
  policyVersion: string;
  receiptId?: string;
  errorDetails?: string;
  httpStatus?: number;
  envelope: TelemetryEnvelope;
}

export interface EgressProof {
  payloadId: string;
  gatewayId: string;
  tenant: 'enterprise-production';
  policyId: string;
  policyVersion: string;
  eventCount: number;
  timestamp: string;
  destination: string;
  payloadSizeBytes: number;
  sha256Hash: string;
  deliveryStatus: 'acknowledged' | 'in_transit' | 'failed' | 'retry_pending';
  attemptCount: number;
  receiptId: string;
  httpStatus: number;
  ackStatus: 'Signed ACK Received' | 'Awaiting ACK' | 'Transmission Failed';
  fieldsApproved: number;
  fieldsRemoved: number;
  fieldsRedacted: number;
  fieldsPseudonymized: number;
  tlsInfo: {
    protocol: string;
    cipherSuite: string;
    certPinning: 'Verified' | 'Simulated Valid';
    mTLSStatus: 'Not Required (Enterprise)' | 'Mutual TLS 1.3';
  };
  signatureAlgorithm: 'HMAC-SHA256 (Tenant Key)';
  sanitizedPayloadSample: Record<string, any>;
  transmissionError?: string;
  ackDetails?: {
    receiptId: string;
    receivedAt: string;
    pc2Node: string;
    latencyMs: number;
  };
}

export interface CollectorPipelineEvent {
  source: string;
  eventId: string;
  collectionTimestamp: string;
  collectionStatus: 'Collected' | 'Buffering' | 'Dropped';
  normalizationStatus: 'Normalized (ECS)' | 'Schema Conformed' | 'Failed';
  processingStatus: 'Approved' | 'Redacted' | 'Blocked' | 'Pending Review';
  failureReason?: string;
}

export interface CollectorStats {
  status: 'running' | 'stopped' | 'restarting' | 'degraded';
  version: string;
  uptimeSeconds: number;
  lastCollectionTime: string;
  throughputEventsPerSec: number;
  totalEventsProcessed: number;
  collectionErrors: number;
  connectedSourceCount: number;
  processingLatencyMs: number;
  bufferUsagePercent: number;
  pipelineEvents: CollectorPipelineEvent[];
}

export interface ActivityItem {
  id: string;
  timestamp: string;
  type:
    | 'event_collected'
    | 'event_normalized'
    | 'privacy_decision'
    | 'event_blocked'
    | 'payload_created'
    | 'payload_sent'
    | 'payload_failed'
    | 'retry_scheduled'
    | 'ack_received'
    | 'collector_started'
    | 'collector_stopped'
    | 'source_connected'
    | 'source_disconnected'
    | 'payload_blocked'
    | 'payload_approved'
    | 'privacy_policy_executed'
    | 'transmission_attempted'
    | 'payload_acknowledged';
  title: string;
  description: string;
  entityId: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  isSimulated: boolean;
}

export interface DashboardSummary {
  sourcesMonitored: {
    total: number;
    active: number;
    offlineOrDegraded: number;
  };
  eventsCollected: {
    totalCount: number;
    ratePerSec: number;
    windowMinutes: number;
    isSimulated: boolean;
  };
  privacyProcessed: {
    sanitized: number;
    redacted: number;
    blocked: number;
    pendingReview: number;
    windowHours: number;
    isSimulated: boolean;
  };
  outboundQueue: {
    pending: number;
    retryCount: number;
    failed: number;
    acknowledged: number;
  };
  deliverySuccess: {
    successPercentage: number;
    acknowledgedCount: number;
    failedCount: number;
    windowHours: number;
    isActualNetworkDelivery: boolean;
  };
  lastAcknowledgement: {
    timestamp: string;
    payloadId: string;
    receiptId?: string;
    latencyMs: number;
    isRealAck: boolean;
  };
  connectionStatus: {
    gatewayStatus: 'Protected · Trust Boundary Active' | 'Collector Paused' | 'Degraded';
    pc2EndpointStatus: 'connected' | 'disconnected' | 'testing';
    pc2ApiBaseUrl: string;
    lastTransmission?: string;
    latestReceiptId?: string;
  };
}

export interface GatewaySettings {
  gatewayName: string;
  gatewayId: 'gateway-pc1-001' | string;
  environment: 'Enterprise Production';
  tenantContext: 'enterprise-production' | string;
  gatewayMode: 'Strict Privacy Isolation';
  pc2ApiBaseUrl: string;
  endpointStatus: 'connected' | 'disconnected' | 'testing';
  lastConnectivityCheck: string;
  apiKeyConfigured: boolean;
  hmacSigningConfigured: boolean;
  certificateStatus: 'Valid (Pinned CA)' | 'Pending Verification';
  retention: {
    localEventRetentionHours: number;
    queueRetentionHours: number;
    proofLedgerRetentionDays: number;
  };
  isSimulationMode: boolean;
  simulationTickSpeedMs: number;
}
