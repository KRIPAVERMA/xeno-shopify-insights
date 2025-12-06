# Demo Video Script (7 Minutes)

> **Purpose:** Explain features, approach, and trade-offs for Shopify Data Ingestion & Insights Service

---

## **INTRODUCTION (30 seconds)**

*[Show GitHub repo on screen]*

**Script:**
> "Hi! I'm presenting my solution for the Shopify Data Ingestion & Insights Service assignment. This is a full-stack multi-tenant platform that ingests Shopify data via webhooks and provides real-time analytics. Let me show you what I've built and how I approached the problem."

---

## **SECTION 1: FEATURES OVERVIEW (2 minutes)**

### **A. Architecture Overview (30 sec)**
*[Show docs/ARCHITECTURE-DIAGRAM.md]*

**Script:**
> "The system has three main layers:
> 1. **Backend API** - Express.js server handling webhooks and authentication
> 2. **Database** - PostgreSQL with multi-tenant architecture using row-level isolation
> 3. **Frontend Dashboard** - Next.js application with user authentication and analytics
>
> The key feature is multi-tenant support - multiple Shopify stores can use the same platform with complete data isolation."

### **B. Live Demo - Registration Flow (30 sec)**
*[Open http://localhost:3000]*

**Script:**
> "Let me show you the user experience. Starting at the landing page, I'll register a new user. Notice the modern gradient UI with smooth transitions. Registration requires three things: a tenant API key, email, and password. The API key links the user to a specific Shopify store."

*[Fill registration form and submit]*

### **C. Dashboard Analytics (1 min)**
*[Show dashboard with metrics]*

**Script:**
> "After login, we see the analytics dashboard. It displays:
> - **Total customers** - Currently showing 5 customers
> - **Total orders** - 10 orders placed
> - **Total revenue** - $6,190 in sales
> - **Top 5 customers** ranked by spending with color-coded badges
>
> The data is filtered by tenant, so each store only sees their own data. The UI uses gradient stat cards and a professional table design."

### **D. Backend API Demo (30 sec)**
*[Open terminal, show curl commands or Postman]*

**Script:**
> "Behind the scenes, the backend exposes RESTful APIs. Let me show a webhook ingestion example."

*[Run curl command to create a test order]*

```powershell
curl -X POST http://localhost:4000/api/ingest/webhook/shopify `
  -H "x-tenant-apikey: 2e20ac3e-79ee-4d10-b6dd-8ed13c01e1ae" `
  -H "Content-Type: application/json" `
  -d '{"topic":"orders/create","data":{"id":999,"total_price":"150.00"}}'
```

**Script (continued):**
> "The system receives the webhook, validates the tenant API key, and stores the order in the database. Refreshing the dashboard shows the updated metrics immediately."

*[Refresh dashboard, show new order count/revenue]*

---

## **SECTION 2: APPROACH & PROBLEM-SOLVING (2.5 minutes)**

### **A. Multi-Tenant Architecture (45 sec)**
*[Show backend/prisma/schema.prisma in editor]*

**Script:**
> "My first major decision was the multi-tenant design. Every table includes a `tenantId` foreign key, ensuring complete data isolation. Here's the schema:
> - **Tenant** table is the root - it stores the Shopify shop details and generates a unique API key
> - **User, Customer, Order, Product, Event** tables all link to Tenant via `tenantId`
> - All database queries are automatically filtered by tenant
>
> This approach scales horizontally - we can add unlimited stores without architectural changes."

### **B. Authentication Flow (30 sec)**
*[Show backend/src/routes/auth.js]*

**Script:**
> "For authentication, I implemented a dual-layer system:
> 1. **Tenant API keys** (UUID v4) - identifies which store the data belongs to
> 2. **JWT tokens** - user authentication with 7-day expiry
>
> Passwords are hashed using bcrypt with 10 rounds. The JWT payload includes both `userId` and `tenantId` for secure multi-tenant access."

### **C. Webhook Ingestion (45 sec)**
*[Show backend/src/routes/ingest.js]*

**Script:**
> "The webhook receiver handles four Shopify topics:
> - `customers/create`, `customers/update`
> - `orders/create`, `orders/update`
> - `products/create`, `products/update`
> - `events/*` for custom events
>
> I used **upsert operations** to handle both creates and updates idempotently. This prevents duplicate records if Shopify retries webhooks. HMAC signature verification is implemented using Node.js crypto module to ensure webhooks are authentic."

### **D. Database Schema Evolution (30 sec)**
*[Mention the JSON type issue fix]*

**Script:**
> "One challenge I faced was Prisma's JSON type incompatibility with SQLite during development. The Event table's `payload` field initially used `Json` type, which SQLite doesn't support. I solved this by:
> 1. Changing the schema to `String` type
> 2. Using `JSON.stringify()` before storage and `JSON.parse()` after retrieval
> 
> This maintains PostgreSQL compatibility in production while allowing SQLite in development."

---

## **SECTION 3: TRADE-OFFS & DESIGN DECISIONS (2 minutes)**

### **A. Technology Choices (45 sec)**

**Script:**
> "Let me explain my tech stack decisions:
>
> **Backend:**
> - **Express.js** - Lightweight, widely adopted, excellent for RESTful APIs
> - **Prisma ORM** - Type-safe database access, automatic migrations, works with both SQLite and PostgreSQL
>
> **Frontend:**
> - **Next.js** - React framework with server-side rendering support, easy deployment
> - **No state management library** - Used localStorage and React hooks for simplicity
>
> **Database:**
> - **SQLite for dev, PostgreSQL for prod** - Fast local development, production-ready scaling
> - **Row-level multi-tenancy** - Simpler than separate databases per tenant, but requires careful query filtering"

### **B. Trade-Offs Made (45 sec)**

**Script:**
> "Here are the key trade-offs I made:
>
> **1. Row-level isolation vs. Schema-per-tenant:**
> - **Chose:** Single schema with `tenantId` filtering
> - **Trade-off:** Easier to manage, but requires careful WHERE clause enforcement
> - **Benefit:** Simpler migrations, cost-effective
>
> **2. Synchronous webhook processing vs. Queue-based:**
> - **Chose:** Synchronous processing
> - **Trade-off:** Webhooks block until DB write completes
> - **Benefit:** Simpler implementation for MVP, can add queues later
>
> **3. JWT in localStorage vs. HttpOnly cookies:**
> - **Chose:** localStorage
> - **Trade-off:** Vulnerable to XSS attacks
> - **Benefit:** Easier to implement, works with SPA architecture
>
> **4. No caching layer:**
> - **Trade-off:** Database hit on every metrics request
> - **Benefit:** Always shows real-time data, simpler architecture"

### **C. Future Improvements (30 sec)**

**Script:**
> "If I had more time, I would add:
> - **Redis caching** for dashboard metrics
> - **Bull queue** for async webhook processing
> - **Rate limiting** to prevent API abuse
> - **Comprehensive test suite** (unit + integration tests)
> - **Date range filters** on the dashboard
> - **Export to CSV** functionality
> - **Real Shopify OAuth integration** for automatic tenant onboarding"

---

## **CONCLUSION (30 seconds)**

*[Show GitHub repo README]*

**Script:**
> "In summary, I've built a production-ready multi-tenant Shopify data platform with:
> - **Complete backend API** with 11 endpoints
> - **Modern frontend dashboard** with authentication
> - **Secure webhook ingestion** with HMAC verification
> - **Comprehensive documentation** - 13 markdown files covering setup, API, deployment
> - **Docker deployment ready** with Railway/Render/Heroku configs
>
> The code is on GitHub, fully documented, and ready to deploy. Thank you for watching!"

*[End screen: Show GitHub repo URL + your contact]*

---

## **Recording Tips**

1. **Screen Setup:**
   - Terminal (PowerShell)
   - VS Code with code files
   - Browser with localhost:3000
   - GitHub repo page

2. **Practice Run:**
   - Do a full walkthrough before recording
   - Time each section
   - Test all demo commands

3. **Clarity:**
   - Zoom in on code (175% zoom in VS Code)
   - Use Ctrl+B to toggle sidebar for more space
   - Slow down when explaining complex parts

4. **Energy:**
   - Speak clearly and enthusiastically
   - Avoid filler words ("um", "uh")
   - Smile while recording (even though it's audio!)

5. **Recording Tools:**
   - **OBS Studio** (free, high quality)
   - **Loom** (easy, web-based)
   - **Camtasia** (professional, paid)

---

## **Quick Demo Commands Cheat Sheet**

```powershell
# Start backend
cd "c:\vol D old\web dev\xeno\backend"
npm run dev

# Start frontend
cd "c:\vol D old\web dev\xeno\web"
npm run dev

# Test webhook (in separate terminal)
curl -X POST http://localhost:4000/api/ingest/webhook/shopify `
  -H "x-tenant-apikey: 2e20ac3e-79ee-4d10-b6dd-8ed13c01e1ae" `
  -H "Content-Type: application/json" `
  -d '{"topic":"orders/create","data":{"id":9999,"total_price":"250.00","currency":"USD","created_at":"2025-12-06T15:00:00Z"}}'

# Check metrics API
curl -H "x-tenant-apikey: 2e20ac3e-79ee-4d10-b6dd-8ed13c01e1ae" `
  http://localhost:4000/api/metrics
```

---

**Total Time Estimate:** ~7 minutes
- Introduction: 30s
- Features: 2min
- Approach: 2.5min
- Trade-offs: 2min
- Conclusion: 30s

**Adjustments:** If running over, reduce trade-offs section to 1.5min
