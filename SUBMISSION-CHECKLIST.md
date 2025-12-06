# Pre-Submission Checklist

Complete checklist before submitting the Xeno assignment.

## ✅ Code Completeness

### Backend
- [x] Express server with CORS enabled
- [x] Prisma ORM with multi-tenant schema
- [x] Tenant onboarding endpoint (`POST /api/tenants`)
- [x] User authentication (register, login, JWT)
- [x] Webhook receiver for Shopify events
- [x] Metrics endpoint with aggregations
- [x] HMAC signature verification helper
- [x] Background scheduler for data sync
- [x] Error handling on all routes
- [x] Environment variable configuration

### Frontend
- [x] Next.js app with routing
- [x] Landing page with navigation
- [x] Register page with form validation
- [x] Login page with authentication
- [x] Dashboard with metrics display
- [x] Top customers table
- [x] Logout functionality
- [x] Session management (JWT in localStorage)
- [x] Error handling and loading states
- [x] Responsive styling

### Database
- [x] Tenant model with API keys
- [x] User model with bcrypt passwords
- [x] Customer model with Shopify IDs
- [x] Product model with pricing
- [x] Order model with revenue tracking
- [x] Event model for custom events
- [x] Proper foreign key relationships
- [x] Unique indexes on shopifyId fields
- [x] tenantId isolation on all tables

## 📚 Documentation

- [x] Main README.md with quick start
- [x] PROJECT-SUMMARY.md with full overview
- [x] LOCAL-TESTING-GUIDE.md for testing
- [x] FILE-STRUCTURE.md listing all files
- [x] docs/architecture.md with diagrams
- [x] docs/api.md with endpoint specs
- [x] docs/data-models.md with schema
- [x] docs/assumptions.md with decisions
- [x] docs/demo-guide.md walkthrough
- [x] docs/deployment-guide.md for production
- [x] docs/railway-deploy.md for Railway
- [x] docs/seed-scripts.md for test data
- [x] Clear commit messages (if applicable)

## 🚀 Deployment Readiness

### Docker
- [x] Dockerfile.backend builds successfully
- [x] Dockerfile.web builds successfully
- [x] docker-compose.yml configured
- [x] All services start without errors
- [x] Health checks work
- [x] Environment variables documented

### Railway/Render
- [x] railway.json configuration
- [x] Procfile for Heroku compatibility
- [x] Database migrations documented
- [x] Environment variables listed
- [x] Public URL configuration
- [x] Start commands verified

### CI/CD
- [x] GitHub Actions workflow created
- [x] Build tests configured
- [x] Docker build tests
- [x] Security audit steps

## 🧪 Testing

### Manual Tests
- [ ] Create tenant returns API key
- [ ] Register user works with valid data
- [ ] Login authenticates correctly
- [ ] Dashboard shows correct metrics
- [ ] Webhook ingestion creates customers
- [ ] Webhook ingestion creates orders
- [ ] Orders link to customers correctly
- [ ] Top customers calculated accurately
- [ ] Multi-tenant isolation verified
- [ ] Invalid API key returns 401
- [ ] JWT expiry redirects to login
- [ ] Logout clears session

### Data Integrity
- [ ] No duplicate customers on re-send
- [ ] No duplicate orders on re-send
- [ ] Revenue calculation is correct
- [ ] Customer spend aggregation accurate
- [ ] Date filtering works (if implemented)
- [ ] SQL queries are optimized

### Security
- [ ] Passwords are hashed (bcrypt)
- [ ] JWT tokens expire properly
- [ ] HMAC verification works (if configured)
- [ ] CORS allows only specific origins
- [ ] No SQL injection vulnerabilities
- [ ] API keys are cryptographically random

## 📹 Demo Video Preparation

### Recording Setup
- [ ] Choose recording tool (Loom, OBS, etc.)
- [ ] Test microphone audio quality
- [ ] Close unnecessary browser tabs
- [ ] Clear browser notifications
- [ ] Prepare demo script outline
- [ ] Set screen resolution to 1920x1080
- [ ] Use clear, professional font sizes

### Video Content Checklist
- [ ] Introduction (30 sec)
  - [ ] State your name
  - [ ] Mention the assignment goal
  - [ ] Quick tech stack overview
- [ ] Code walkthrough (2 min)
  - [ ] Show project structure
  - [ ] Highlight key files
  - [ ] Explain multi-tenancy approach
  - [ ] Show Prisma schema
- [ ] Local demo (3 min)
  - [ ] Start backend server
  - [ ] Start frontend server
  - [ ] Run seed script
  - [ ] Show tenant creation
  - [ ] Register and login
  - [ ] Navigate to dashboard
  - [ ] Show metrics updating
- [ ] Webhook demo (2 min)
  - [ ] Send test customer webhook
  - [ ] Send test order webhook
  - [ ] Refresh dashboard
  - [ ] Show data appearing
- [ ] Architecture (1 min)
  - [ ] Show architecture diagram
  - [ ] Explain data flow
  - [ ] Mention scalability
- [ ] Deployment (1 min)
  - [ ] Show deployed URL (if ready)
  - [ ] Explain deployment process
  - [ ] Mention Railway/Render
- [ ] Closing (30 sec)
  - [ ] Summarize achievements
  - [ ] Mention next steps
  - [ ] Thank reviewers

### Video Quality
- [ ] Duration: 8-10 minutes (not too long)
- [ ] Audio is clear and understandable
- [ ] Screen is readable (no tiny fonts)
- [ ] No background noise or distractions
- [ ] Pace is steady (not too fast/slow)
- [ ] Professional and confident delivery

## 🌐 Deployment (Optional but Recommended)

### Railway Deployment
- [ ] GitHub repo pushed
- [ ] Railway project created
- [ ] PostgreSQL plugin added
- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Environment variables set
- [ ] Migrations ran successfully
- [ ] Public URLs generated
- [ ] Health check passes
- [ ] Test end-to-end flow

### Post-Deployment
- [ ] Create production tenant
- [ ] Register production user
- [ ] Test webhook ingestion
- [ ] Verify dashboard loads
- [ ] Check metrics accuracy
- [ ] Test on mobile browser
- [ ] Share deployment URLs

## 📧 Submission Package

### Required Files (if submitting as ZIP)
- [ ] Complete source code
- [ ] All documentation files
- [ ] README.md at root
- [ ] .env.example files (not .env)
- [ ] package.json with dependencies
- [ ] Dockerfiles and compose file
- [ ] No node_modules included
- [ ] No .env with secrets
- [ ] No database files (dev.db)

### GitHub Submission (Recommended)
- [ ] Repository is public or accessible
- [ ] Clean commit history
- [ ] No sensitive data committed
- [ ] README displays properly
- [ ] All links work
- [ ] Repository description set
- [ ] Topics/tags added

### Additional Materials
- [ ] Demo video uploaded (YouTube/Loom)
- [ ] Video link in README
- [ ] Deployment URLs in README
- [ ] Contact information included
- [ ] Professional GitHub profile
- [ ] LinkedIn profile updated (optional)

## 🎯 Final Quality Check

### Code Quality
- [ ] No console.log statements in production routes
- [ ] Proper error messages (not just "error")
- [ ] Consistent code formatting
- [ ] Meaningful variable names
- [ ] Comments on complex logic
- [ ] No hardcoded values (use env vars)
- [ ] DRY principles followed

### Documentation Quality
- [ ] No typos or grammar errors
- [ ] Code examples are accurate
- [ ] Links are not broken
- [ ] Diagrams are clear
- [ ] Commands are copy-pasteable
- [ ] PowerShell commands work on Windows
- [ ] Instructions are step-by-step

### User Experience
- [ ] Landing page is welcoming
- [ ] Forms have proper validation
- [ ] Error messages are helpful
- [ ] Dashboard is intuitive
- [ ] Loading states prevent confusion
- [ ] Logout works as expected
- [ ] Mobile-friendly (basic)

## 🏆 Bonus Points

### Extra Features (If Time Permits)
- [ ] Date range filtering on dashboard
- [ ] Charts visualization (Chart.js)
- [ ] Product ingestion tested
- [ ] Custom events tested
- [ ] Webhook retry logic
- [ ] Rate limiting implemented
- [ ] API documentation (Swagger)
- [ ] Postman collection
- [ ] Unit tests added
- [ ] Integration tests
- [ ] E2E tests with Playwright
- [ ] Monitoring setup (Sentry)
- [ ] Redis caching
- [ ] Message queue (RabbitMQ)

### Polish
- [ ] Professional styling (beyond basic CSS)
- [ ] Logo or branding
- [ ] Footer with attribution
- [ ] 404 page
- [ ] Loading spinners/skeletons
- [ ] Toast notifications for actions
- [ ] Keyboard shortcuts
- [ ] Dark mode support

## ⚠️ Common Mistakes to Avoid

- [ ] Don't commit .env files with secrets
- [ ] Don't commit node_modules
- [ ] Don't commit database files (dev.db)
- [ ] Don't use placeholder values in docs
- [ ] Don't make video too long (>15 min)
- [ ] Don't use offensive variable names
- [ ] Don't skip error handling
- [ ] Don't hardcode API URLs
- [ ] Don't forget to test multi-tenancy
- [ ] Don't submit without testing locally

## 📋 Pre-Recording Checklist

**5 minutes before recording**:
- [ ] Close Slack/Discord/messaging apps
- [ ] Turn off phone notifications
- [ ] Clear browser cookies (fresh session)
- [ ] Prepare a glass of water
- [ ] Do a 30-second test recording
- [ ] Open all necessary windows
- [ ] Zoom to 100% (not 110% or 90%)
- [ ] Hide desktop icons (if recording desktop)
- [ ] Take a deep breath and smile!

## ✅ Submission Checklist

Before clicking submit:
- [ ] All code is committed and pushed
- [ ] README is comprehensive
- [ ] Demo video is uploaded and public
- [ ] Video link is in README
- [ ] Deployment URLs are in README (if deployed)
- [ ] No broken links in documentation
- [ ] All sensitive data removed
- [ ] Assignment requirements re-checked
- [ ] Confident in the quality

---

## Final Verification Commands

Run these in order to verify everything works:

```powershell
# 1. Backend builds
cd backend
npm install
npx prisma generate
npx prisma migrate reset --force
npm start
# (Keep running, open new terminal)

# 2. Frontend builds
cd web
npm install
npm run dev
# (Keep running, open new terminal)

# 3. Create tenant and seed data
.\seed-demo-data.ps1

# 4. Test in browser
# Open http://localhost:3000
# Register with credentials from script
# Verify dashboard shows data

# 5. Docker test (optional)
docker-compose up -d
docker-compose logs -f
docker-compose down

# 6. Build test
cd backend
npm run build || echo "No build script"
cd ../web
npm run build
```

If all commands succeed, you're ready to submit! 🚀

---

**Completion Date**: _____________  
**Submitted By**: _____________  
**Submission URL**: _____________  
**Demo Video URL**: _____________  
**Deployment URL**: _____________

**Status**: ⬜ Ready to submit | ⬜ Submitted | ⬜ Under review
