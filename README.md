# LARP.it · PC 1 Customer Environment

> **Privacy-First AIOps Observability & Local Telemetry Gateway**  
> *Customer-Side Boundary Simulation · Enterprise Production Tenant*

[![Tenant: Enterprise Production](https://img.shields.io/badge/Tenant-Enterprise%20Production-indigo.svg)](file:///c:/Users/Aditt/Downloads/Customer_Env_Frontend/src/types/pc1.ts)
[![Gateway ID: gateway-pc1-001](https://img.shields.io/badge/Gateway%20ID-gateway--pc1--001-blue.svg)](file:///c:/Users/Aditt/Downloads/Customer_Env_Frontend/src/types/pc1.ts)
[![Privacy Engine: JEV v2.1.0 Strict](https://img.shields.io/badge/JEV%20Policy-v2.1.0--strict-emerald.svg)](file:///c:/Users/Aditt/Downloads/Customer_Env_Frontend/src/services/jevPolicyEngine.ts)
[![Transport: TLS 1.3](https://img.shields.io/badge/Transport-TLS%201.3%20mTLS-darkgreen.svg)](file:///c:/Users/Aditt/Downloads/Customer_Env_Frontend/src/components/EgressProofView.tsx)
[![Auditing: SHA-256 Ledger](https://img.shields.io/badge/Audit-SHA--256%20Canonical-purple.svg)](file:///c:/Users/Aditt/Downloads/Customer_Env_Frontend/src/components/EgressProofView.tsx)

---

## 📌 Executive Overview

**LARP.it PC 1** represents the customer's on-premises / private-cloud environment in the LARP.it AIOps architecture. It functions as a local privacy gateway and telemetry buffer that guarantees sensitive customer infrastructure data, credentials, and unrestricted identifiers **never cross the trust boundary**.

```
[Customer Infrastructure Sources]
       │
       ▼ (Raw logs, errors, metrics)
[Local Collector Buffer] (Simulated Volume)
       │
       ▼ (Normalization to ECS)
[JEV Privacy Decision Layer] ◄─── Field Allow-List & Secret Scrubbing
  ├── [Violation: Raw dump / PII]  ──► [Quarantine Isolation] (Never sent)
  └── [Sanitized & Approved]
       │
       ▼ (Typed Egress Envelope)
[Outbound Queue Buffer] (Client-side buffer, stable payload IDs)
       │
       ▼ (TLS 1.3 + API Key + HMAC-SHA256)
====================== TRUST BOUNDARY ======================
       │
       ▼ POST /api/v1/ingestion/pc1/telemetry
[PC 2 SaaS Platform] (FastAPI Backend · Correlation & AI Intelligence)
       │
       ▼ (Signed Receipt ACK-PC2-xxxx)
[PC 1 Egress Proof Audit Ledger] (Cryptographic SHA-256 Hash Matching)
```

> **Strict Boundary Constraint**: PC 1 performs local collection, privacy filtering, payload preparation, and transmission. PC 1 **does not** perform AI detection, event correlation, root cause analysis, or recommendation generation. All intelligence processing belongs exclusively to **PC 2**.

---

## 🌟 Key Features & Functional Modules

The application delivers 8 enterprise workspace views designed with a soft, warm neutral enterprise aesthetic inspired by modern productivity dashboards (soft beige `#F9F8F5`, pastel indicator cards, and subtle micro-interactions):

### 1. Overview (`/overview`)
- **Pastel KPI Cards**: Live telemetry counters for Sources Monitored, Events Collected, Privacy Processed, Outbound Queue, Real Delivery Success, and Last Signed ACK.
- **Clarity-Inspired Board & List Switcher**: Switch between a 7-stage column board and a dense data table.
- **7-Stage Telemetry Pipeline**: Real-time lifecycle columns:
  `1. Collected` → `2. Normalized` → `3. Privacy Review` → `4. Approved` → `5. Queued` → `6. Sending` → `7. Delivered`.
- **Blocked Telemetry Quarantine**: Prominent quarantine banner isolating forbidden raw stack/core dumps from egress.
- **Slide-Over Event Inspector**: Inspect raw volume JSON, field-level JEV decisions, and sanitized envelope egress.

### 2. Sources (`/sources`)
- Comprehensive monitoring of 6 Enterprise production infrastructure nodes:
  - `srv-web-01` (Nginx Ingress / Web Tier)
  - `srv-app-01` (Order Processing API / Node.js)
  - `srv-db-01` (PostgreSQL Primary Cluster)
  - `auth-service` (Keycloak / OAuth2 Server)
  - `payment-service` (PCI Compliant Settlement)
  - `network-gateway` (eBPF Border Gateway)
- Displays CPU%, Memory%, Error Rate, Latency, Protocol Adapters, and Recent Ingestion Event Feeds.

### 3. Collector (`/collector`)
- Visual architecture flow: `Customer Sources` → `Local Collection` → `Normalization` → `JEV Privacy Guard`.
- Simulated stream inspection with through-rate (eps), processing latency (0.85 ms), and volume buffer utilization.
- Operational controls with safety confirmation: **Start**, **Stop**, and **Restart** collector engine.

### 4. Privacy & Policy – JEV (`/privacy`)
- Active policy details for `v2.1.0-strict` under tenant `enterprise-production`.
- Six lifecycle stages:
  1. Field Allow-Listing (drops unknown properties).
  2. Secret & Token Scrubbing (`[REDACTED_SECRET]` for Bearer tokens, API keys).
  3. Password & Credential Scrubbing (`[REDACTED_PASS]` for database passwords).
  4. PII & Raw Dump Blocking (blocks unrestricted emails, SSNs, and core memory dumps).
  5. Deterministic HMAC Pseudonymization (pseudonymizes `user_id` and `client_ip` with tenant salt).
  6. Strict Schema Validation.
- **Interactive Policy Testing Sandbox**: Live JSON editor preloaded with 4 leak/attack test cases and a side-by-side field decision matrix.

### 5. Outbound Queue (`/queue`)
- Real client-side buffer maintaining payload state (`approved`, `sending`, `acknowledged`, `retry_pending`, `failed`).
- Batch actions: **Send Selected**, **Send Approved Batch**, **Retry All Failed**.
- **Real HTTP Dispatcher**: Executes genuine HTTP `POST` requests to PC 2 without faking network success or fabricating ACKs.
- Payload envelope JSON inspector.

### 6. Egress Proof (`/egress`)
- Immutable cryptographic audit ledger.
- Displays Payload ID, Tenant, Gateway ID, Policy version, exact payload byte size, and **canonical SHA-256 hash**.
- Transport details: TLS 1.3, cipher suite (`TLS_AES_256_GCM_SHA384`), pinned cert fingerprint, and mTLS status.
- Signed ACK tracking: Receipt ID, ingestion timestamp, SaaS ingest node, and round-trip latency.

### 7. Activity Feed (`/activity`)
- Traceable chronological audit feed recording lifecycle events (`event_collected`, `event_blocked`, `payload_created`, `payload_sent`, `payload_failed`, `ack_received`).
- Searchable by entity ID or keyword, filterable by severity level (`success`, `info`, `warning`, `error`).

### 8. Connection Settings (`/settings`)
- Configurable **PC 2 API Base URL** (default: `http://localhost:8000`).
- Configurable **Gateway ID** (`gateway-pc1-001`) and **Tenant ID** (`enterprise-production`).
- **Live Health Probe**: "Test Connection" button probes `GET /api/v1/health` and displays real network latency and connectivity status.

---

## 🔌 How to Connect PC 1 to PC 2

PC 1 is designed to transmit sanitized telemetry payloads to the PC 2 SaaS Platform over real HTTP.

### 1. Ingestion Endpoint Specification

- **Target URL**: `${PC2_API_BASE_URL}/api/v1/ingestion/pc1/telemetry`
- **Default Local URL**: `http://localhost:8000/api/v1/ingestion/pc1/telemetry`
- **Method**: `POST`
- **Headers**:
  ```http
  Content-Type: application/json
  X-LARP-Tenant: enterprise-production
  X-LARP-Gateway: gateway-pc1-001
  ```

### 2. Payload Telemetry Envelope Contract

Every outbound transmission from PC 1 strictly complies with the following typed envelope:

```json
{
  "schema_version": "1.0.0",
  "tenant_id": "enterprise-production",
  "gateway_id": "gateway-pc1-001",
  "payload_id": "PAYLOAD-ENT-8841",
  "policy_id": "pol-jev-ent-strict-2026",
  "policy_version": "2.1.0-strict",
  "sent_at": "2026-11-21T04:20:00.000Z",
  "payload_sha256": "4a7d1ed414474e4033ac29ccb8653d9b0022f91329dd037340f7dd3e2d53880a",
  "events": [
    {
      "event_id": "EVT-9041",
      "source": "srv-web-01",
      "service": "nginx-ingress",
      "event_type": "metric",
      "severity": "high",
      "message": "Nginx worker latency exceeding baseline threshold",
      "timestamp": "2026-11-21T02:48:10Z",
      "metrics": {
        "p99_latency_ms": 412.5,
        "active_connections": 1420,
        "error_rate_5xx": 0.048,
        "cpu_usage_pct": 82.4
      },
      "tags": {
        "cluster_zone": "eu-central-1a",
        "env": "production"
      }
    }
  ]
}
```

### 3. Expected PC 2 Ingestion Response

When PC 2 accepts the payload, it returns a 200/202 status with a signed receipt:

```json
{
  "status": "accepted",
  "receipt_id": "ACK-PC2-RECEIPT-9921",
  "tenant_id": "enterprise-production",
  "payload_id": "PAYLOAD-ENT-8841",
  "received_at": "2026-11-21T04:20:01.120Z",
  "ingested_events_count": 1,
  "sha256_verified": true,
  "signature": "sig_ed25519_88a4f910..."
}
```

### 4. Configuring Connection in the UI

1. Open the dashboard in your browser.
2. Click **Settings** in the left sidebar navigation.
3. In the **Connection to PC 2 Platform** card:
   - Edit **PC 2 API Base URL** (e.g., `http://localhost:8000` or your remote SaaS IP).
   - Click **Save Configuration**.
4. Click **Test Connection (GET /api/v1/health)**:
   - If PC 2 is running, the badge will turn green (**Connected**) with measured round-trip latency.
   - If PC 2 is offline, it will clearly show **Disconnected / Offline** without fabricating network status.

---

## 🚀 Getting Started & Running the Project

### Option A: Instant Run (Zero Dependencies)
You can run the entire interactive dashboard immediately with no npm installation required:

1. **Via Python Web Server (Recommended)**:
   ```bash
   python -m http.server 3000
   ```
   Open your browser to: **[`http://localhost:3000/`](http://localhost:3000/)** (or `http://localhost:3000/standalone_dashboard.html`).

2. **Via Direct File Protocol**:
   Double click or open `standalone_dashboard.html` directly in Chrome, Edge, Safari, or Firefox:
   ```text
   file:///c:/Users/Aditt/Downloads/Customer_Env_Frontend/standalone_dashboard.html
   ```

---

### Option B: Node / Vite Development Server
If you wish to run the full modular TypeScript React development environment with HMR:

1. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Start the Vite development server**:
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

3. **Build for production**:
   ```bash
   pnpm run build
   ```

---

## 🎨 Enterprise Motion & Micro-Interactions

The application features a restrained, high-precision motion system configured in `src/index.css`:

- **Card Lift**: Smooth 3–4px elevation with soft shadow increase on hover (`transition-all duration-200 ease-out`).
- **Sidebar Motion**: Subtle icon horizontal nudge (`group-hover:translate-x-0.5`) and smooth active pill transition.
- **Button Feedback**: Tactile press state (`active:scale-95 active:translate-y-0.5`) and animated loading spinners (`animate-spin`).
- **Pipeline Data Flow**: Animated pulse along connection arrows when the collector is active.
- **Quarantine Breathing**: Subtle red border breathing pulse (`quarantine-pulse`) that avoids jarring flashing.
- **Accessibility**: Full `@media (prefers-reduced-motion: reduce)` support instantly disables all animations for users with motion sensitivity.

---

## 📁 Repository Structure

```text
Customer_Env_Frontend/
├── index.html                       # Application entry point with smart fallback routing
├── standalone_dashboard.html        # Complete, zero-dependency self-contained dashboard
├── package.json                     # Dependencies & build scripts (React 18, Vite, Tailwind)
├── tailwind.config.js               # Tailwind configuration & typography tokens
├── tsconfig.json                    # TypeScript compiler configuration (strict mode)
├── .gitignore                       # Clean Git exclusion list (node_modules, builds, logs)
└── src/
    ├── main.tsx                     # React DOM bootstrap
    ├── App.tsx                      # Root application layout with tab transitions
    ├── index.css                    # Enterprise motion tokens, keyframes & accessibility
    ├── vite-env.d.ts                # Vite environment typings
    ├── types/
    │   └── pc1.ts                   # Typed data models for PC 1 telemetry & JEV rules
    ├── services/
    │   ├── jevPolicyEngine.ts       # Local JEV privacy simulation & SHA-256 calculation
    │   ├── pc1Service.ts            # Reactive state management & real HTTP sender
    │   └── mockData.ts              # Deterministic Enterprise production dataset
    └── components/
        ├── Header.tsx               # Top header with tenant context & live PC 2 status
        ├── Sidebar.tsx              # Collapsible left navigation sidebar
        ├── KpiCards.tsx             # 6 Clarity-inspired pastel metric cards
        ├── Toolbar.tsx              # Board/List toggle, search, source & outcome filters
        ├── PipelineBoard.tsx        # 7-stage column board + Quarantine panel
        ├── ListView.tsx             # Structured data table view
        ├── SourcesView.tsx          # 6 monitored infrastructure nodes & adapter specs
        ├── CollectorView.tsx        # Visual pipeline architecture & operational controls
        ├── PrivacyPolicyView.tsx    # Policy lifecycle rules & testing sandbox
        ├── OutboundQueueView.tsx    # Client-side buffer, batch actions & sender
        ├── EgressProofView.tsx      # SHA-256 cryptographic audit ledger & ACK receipts
        ├── ActivityView.tsx         # Traceable lifecycle event timeline feed
        ├── EventDetailDrawer.tsx    # Slide-over drawer with raw vs sanitized diff
        └── Icons.tsx                # Zero-dependency inline SVG icon library
```

---

## 🔒 Security & Privacy Assertions

1. **Client-Side Simulation**: All raw telemetry, infrastructure logs, and privacy decisions in this frontend are deterministic simulations for hackathon evaluation.
2. **Never Transmits Raw Secrets**: Passwords, Bearer tokens, unrestricted emails, and core memory dumps are scrubbed or quarantined client-side before any HTTP request is dispatched.
3. **No Fabricated ACKs**: When PC 2 is offline, transmissions are marked as `retry_pending` or `failed` with exact network status codes.
4. **Stable Identifiers**: Payload IDs (`PAYLOAD-ENT-xxxx`) and Event IDs (`EVT-xxxx`) remain stable across retries to guarantee idempotent ingestion on PC 2.

---

*LARP.it · Privacy-First Observability & Intelligence*
