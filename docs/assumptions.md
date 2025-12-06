**Assumptions & Design Decisions**

## Assumptions Made

1. **Authentication**: Simple JWT-based email/password auth is sufficient for demo. Production would use OAuth 2.0 or Shopify's OAuth flow.

2. **Database**: SQLite for local dev, PostgreSQL for production. Multi-tenant row-level isolation (single database) is acceptable for this scale.

3. **Webhooks**: Demo accepts generic webhook payloads. Real implementation needs:
   - HMAC signature verification (implemented but requires setup)
   - Shopify App installation flow
   - Webhook subscription management

4. **Data Sync**: 
   - Webhooks are primary sync mechanism
   - Polling scheduler is backup/demo feature
   - No conflict resolution (last-write-wins)

5. **Tenant Onboarding**: Manual API key generation. Production needs:
   - Self-service signup flow
   - Shopify OAuth app installation
   - Automated API key rotation

6. **Metrics**: Basic aggregations (counts, sums). No advanced analytics, ML, or segmentation yet.

7. **Scalability**: Single-region deployment. For global scale:
   - Add Redis for caching
   - Message queue for webhook processing
   - Read replicas for analytics queries

## Technical Decisions

### Why Express + Prisma?
- Rapid development
- Type-safe database access
- Easy migrations
- ORM simplifies multi-tenant queries

### Why Next.js?
- Server-side rendering capability
- Built-in API routes (not used here but available)
- Excellent developer experience
- Easy deployment to Vercel/Railway

### Why SQLite for Development?
- Zero configuration
- Fast local iteration
- Easy to reset/seed
- Prisma supports seamless migration to Postgres

### Multi-Tenant Strategy: Row-Level Isolation
**Chosen approach**: Single database with `tenantId` column in all tables.

**Alternatives considered**:
- Schema-per-tenant: More isolation, harder to query across tenants
- Database-per-tenant: Maximum isolation, expensive at scale

**Why row-level**: Best balance of isolation, cost, and query flexibility for SaaS with <10K tenants.

## Scope Limitations

**Not Implemented** (for production):
- Rate limiting per tenant
- Webhook retry logic with exponential backoff
- Comprehensive error tracking (Sentry, etc.)
- API request logging and analytics
- Customer data encryption at rest
- GDPR compliance features (data export, deletion)
- Multi-region failover
- Automated testing (unit, integration, e2e)

## Next Steps to Productionize

### Security
- [ ] Implement Shopify HMAC webhook verification
- [ ] Add API rate limiting (express-rate-limit)
- [ ] Enable HTTPS only (enforce in production)
- [ ] Add CORS whitelist (not wildcard)
- [ ] Implement API key rotation mechanism
- [ ] Add audit logging for sensitive operations

### Reliability
- [ ] Add webhook retry queue (Redis + BullMQ)
- [ ] Implement circuit breakers for external APIs
- [ ] Add health check endpoints (/health, /ready)
- [ ] Set up monitoring (Datadog, New Relic)
- [ ] Configure error tracking (Sentry)
- [ ] Add database connection pooling (PgBouncer)

### Features
- [ ] Implement Shopify OAuth app installation
- [ ] Add date range filtering on dashboard
- [ ] Build advanced analytics (cohort analysis, LTV)
- [ ] Add real-time charts (WebSocket or SSE)
- [ ] Implement data export (CSV, PDF reports)
- [ ] Add email notifications for insights
- [ ] Build admin panel for tenant management

### Testing & CI/CD
- [ ] Add unit tests (Jest)
- [ ] Add integration tests (Supertest)
- [ ] Add E2E tests (Playwright)
- [ ] Set up GitHub Actions CI pipeline
- [ ] Add automated security scanning (Snyk, Dependabot)
- [ ] Implement blue-green deployments

### Documentation
- [ ] Add OpenAPI/Swagger spec
- [ ] Create Postman collection
- [ ] Write integration guide for Shopify
- [ ] Add troubleshooting guide
- [ ] Create video tutorials

## Estimated Production Timeline

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| Security hardening | 1 week | HMAC, rate limiting, OAuth |
| Infrastructure | 1 week | Message queue, monitoring |
| Testing | 1 week | Unit, integration, E2E tests |
| Advanced features | 2 weeks | Charts, filtering, exports |
| Documentation | 3 days | API docs, guides |
| Beta testing | 1 week | User feedback, bug fixes |

**Total: ~6 weeks** to production-ready MVP
