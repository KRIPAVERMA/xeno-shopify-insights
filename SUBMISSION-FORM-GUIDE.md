# Submission Form Guide - Xeno Assignment

This guide provides exact answers for each field in the Xeno assignment submission form.

---

## 📋 **Form Fields & Answers**

### **1. Link to your frontend website for the Data Ingestion & Insights Applications**

You have **TWO OPTIONS**:

#### **Option A: Deploy Frontend to Vercel (Recommended - 10 minutes)**

```powershell
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd "c:\vol D old\web dev\xeno\web"

# Deploy
vercel --prod
```

**Steps:**
1. Run the command above
2. Login with GitHub account
3. Accept default settings (just press Enter)
4. Copy the deployment URL (e.g., `https://xeno-shopify-insights.vercel.app`)

**Submit this URL:** `https://xeno-shopify-insights.vercel.app`

#### **Option B: Deploy Full Stack to Railway (20 minutes)**

Follow `docs/deployment-guide.md` to deploy both backend and frontend to Railway.

**Submit this URL:** `https://xeno-web-production.up.railway.app`

---

### **2. Link to: Walk through video/Screen recording of your submission**

#### **Quick Recording with Loom (15 minutes)**

**Steps:**
1. Go to [loom.com](https://www.loom.com/signup) and sign up (free)
2. Install Loom desktop app or Chrome extension
3. Follow the script in `DEMO-VIDEO-SCRIPT.md`
4. Record 7-minute walkthrough
5. Upload and get shareable link

**What to show in video:**
- ✅ GitHub repository tour (show README, code structure)
- ✅ Live demo: Register → Login → Dashboard with data
- ✅ Explain backend API endpoints (show code in VS Code)
- ✅ Explain database schema (show schema.prisma)
- ✅ Explain trade-offs and approach
- ✅ Show webhook ingestion working (curl command demo)

**Recording Tools:**
- **Loom** (easiest): https://www.loom.com
- **OBS Studio** (free): https://obsproject.com
- **Zoom** (if you have it): Start meeting → Share screen → Record

**Example Script Sections (7 min):**
```
0:00-0:30 - Introduction & GitHub repo overview
0:30-2:00 - Live demo (register, login, dashboard)
2:00-4:00 - Code walkthrough (backend, frontend, database)
4:00-6:00 - Architecture & trade-offs explanation
6:00-7:00 - Deployment & conclusion
```

**Submit this URL:** `https://www.loom.com/share/YOUR_VIDEO_ID`

---

### **3. GitHub Link to your backend codebase**

✅ **Already pushed!**

**Submit this URL:**
```
https://github.com/KRIPAVERMA/xeno-shopify-insights/tree/main/backend
```

**Make sure repository is PUBLIC:**
1. Go to: https://github.com/KRIPAVERMA/xeno-shopify-insights
2. Click **Settings** tab
3. Scroll to **Danger Zone**
4. Click **Change visibility** → **Make public**

---

### **4. GitHub Link to your frontend codebase**

✅ **Already pushed!**

**Submit this URL:**
```
https://github.com/KRIPAVERMA/xeno-shopify-insights/tree/main/web
```

---

### **5. Any other information you want to pass on to the hiring team**

**Suggested response:**

```
## Project Highlights

**Technical Implementation:**
- Multi-tenant architecture with row-level data isolation (tenantId filtering)
- Dual authentication: API keys (UUID v4) + JWT tokens (7-day expiry)
- Shopify webhook ingestion with HMAC SHA-256 verification
- Real-time analytics dashboard with modern gradient UI
- 6-table database schema with Prisma ORM
- Background scheduler for data sync (5-min intervals)

**Code Quality:**
- Clean, well-documented codebase with 13 markdown documentation files
- Docker & docker-compose ready for containerized deployment
- GitHub Actions CI/CD pipeline configured
- Environment-based configuration (dev/prod)
- Comprehensive API documentation with examples

**Deliverables:**
- ✅ 11 REST API endpoints (auth, tenants, webhooks, metrics)
- ✅ 4 frontend pages with authentication flow
- ✅ Complete deployment configs (Railway, Render, Heroku)
- ✅ Seed scripts for demo data
- ✅ Local testing guide

**Key Design Decisions:**
1. Row-level multi-tenancy (simpler than schema-per-tenant, cost-effective)
2. Synchronous webhook processing (MVP-ready, can add queues later)
3. SQLite for dev + PostgreSQL for prod (fast local iteration)
4. JWT in localStorage (trade-off: easier SPA auth vs XSS risk - noted in docs)

**Time Invested:** ~8 hours (including documentation and deployment setup)

**Demo Credentials (if deployed):**
- Tenant API Key: 2e20ac3e-79ee-4d10-b6dd-8ed13c01e1ae
- Test User: test@example.com / password123
- Dashboard shows: 5 customers, 10 orders, $6,190 revenue

**Future Enhancements (if given more time):**
- Redis caching for metrics
- Bull queue for async webhook processing
- Rate limiting middleware
- Real Shopify OAuth integration
- Date range filters on dashboard
- CSV export functionality

Thank you for reviewing my submission! I'm excited about this opportunity and happy to discuss any technical decisions in detail.
```

---

## 🚀 **Complete Submission Checklist**

Use this checklist to ensure everything is submitted:

- [ ] **Frontend Website URL**
  - [ ] Deployed to Vercel or Railway
  - [ ] URL is accessible publicly
  - [ ] Frontend loads without errors
  
- [ ] **Demo Video URL**
  - [ ] 7 minutes or less
  - [ ] Your own voice explaining the project
  - [ ] Shows live demo + code walkthrough
  - [ ] Uploaded to Loom/YouTube/Drive with public access
  
- [ ] **Backend GitHub Link**
  - [ ] Repository is PUBLIC
  - [ ] URL: `https://github.com/KRIPAVERMA/xeno-shopify-insights/tree/main/backend`
  
- [ ] **Frontend GitHub Link**
  - [ ] Repository is PUBLIC
  - [ ] URL: `https://github.com/KRIPAVERMA/xeno-shopify-insights/tree/main/web`
  
- [ ] **Additional Information**
  - [ ] Copy the suggested text above
  - [ ] Customize with your own experience/thoughts

---

## ⚡ **Quick Deployment Steps**

### **Deploy Frontend to Vercel (Fastest - 10 min)**

```powershell
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Navigate to web folder
cd "c:\vol D old\web dev\xeno\web"

# 3. Create vercel.json config
# (File will be created below)

# 4. Deploy to Vercel
vercel --prod

# 5. Follow prompts:
#    - Login with GitHub
#    - Link to existing project? N
#    - Project name: xeno-shopify-insights
#    - Directory: ./ (just press Enter)
#    - Build command: npm run build
#    - Output directory: .next (just press Enter)

# 6. Copy the deployment URL
```

**Important:** Update API URL in frontend after backend is deployed!

---

### **Record Demo Video (15 min)**

**Using Loom (Easiest):**

1. Go to https://www.loom.com and sign up
2. Click "New Video" → "Screen + Camera"
3. Select VS Code window + Browser
4. Click "Start Recording"
5. Follow `DEMO-VIDEO-SCRIPT.md`
6. Click "Finish" → Get shareable link

**Video Structure:**
```
Minute 0-1: Introduction + GitHub repo tour
Minute 1-3: Live demo (register, login, dashboard)
Minute 3-5: Code walkthrough (show VS Code files)
Minute 5-6: Architecture explanation (show diagrams)
Minute 6-7: Trade-offs + conclusion
```

**Pro Tips:**
- Test your demo before recording (make sure servers are running)
- Zoom in VS Code (Ctrl+= or View → Zoom In)
- Speak clearly and confidently
- Smile! (even though it's just audio, it affects tone)

---

## 📝 **Final Submission Form - Copy/Paste Ready**

```
Frontend Website URL:
https://xeno-shopify-insights.vercel.app

Demo Video URL:
https://www.loom.com/share/YOUR_VIDEO_ID

Backend GitHub URL:
https://github.com/KRIPAVERMA/xeno-shopify-insights/tree/main/backend

Frontend GitHub URL:
https://github.com/KRIPAVERMA/xeno-shopify-insights/tree/main/web

Additional Information:
[Copy the suggested text from section 5 above]
```

---

## ⏱️ **Time Estimates**

| Task | Time | Status |
|------|------|--------|
| ✅ Push to GitHub | 5 min | **DONE** |
| Deploy Frontend (Vercel) | 10 min | **TODO** |
| Record Demo Video | 15 min | **TODO** |
| Fill Submission Form | 5 min | **TODO** |
| **TOTAL** | **35 min** | - |

---

## 🎯 **Next Steps (Right Now)**

1. **Deploy Frontend** (10 min)
   ```powershell
   npm install -g vercel
   cd "c:\vol D old\web dev\xeno\web"
   vercel --prod
   ```

2. **Record Video** (15 min)
   - Open Loom: https://www.loom.com
   - Start recording
   - Follow script: `DEMO-VIDEO-SCRIPT.md`

3. **Submit Form** (5 min)
   - Copy URLs from above
   - Paste into submission form
   - Click submit!

**You're almost done! 🎉**
