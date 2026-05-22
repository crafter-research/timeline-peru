# Post-Launch Monitoring Guide - Timeline Peru

**Version:** 1.0.0
**Date:** 2026-05-21
**Purpose:** Monitor production health and respond to issues

---

## Quick Reference

**Status Dashboard:** Check these daily during Week 1

| Metric | Target | Alert Threshold | Critical Threshold |
|--------|--------|-----------------|-------------------|
| Error Rate | 0% | > 1% | > 5% |
| Page Load Time | < 3s | > 5s | > 10s |
| Time to Interactive | < 2s | > 4s | > 8s |
| Bounce Rate | < 40% | > 60% | > 80% |
| Search Errors | 0 | > 5/day | > 20/day |
| Console Errors | 0 | > 10/day | > 50/day |

---

## Daily Monitoring (First 7 Days)

### Morning Check (5 minutes)

```bash
# 1. Visit production site
# URL: [Your production URL]

# 2. Quick functionality test
- Search for "Pachacutec" (should return results)
- Click an event (drawer should open)
- Test zoom (2x, then refresh - should persist)
- Check mobile view (responsive layout)

# 3. Browser console check
- Open DevTools (F12)
- Look for red errors
- Verify no repeated warnings
```

### Analytics Check (10 minutes)

**If using Google Analytics:**
- Sessions/users (growth trend)
- Bounce rate (< 40% is good)
- Average session duration (> 2 minutes is good)
- Pages per session (> 3 is engaged users)
- Device breakdown (desktop vs mobile)

**If using custom logging:**
- Check server logs for 500 errors
- Review error tracking (Sentry, LogRocket, etc.)
- Monitor CDN performance

### Error Log Review (5 minutes)

**Check for:**
- JavaScript console errors
- Failed network requests (404s for missing resources)
- Slow API responses (if any external resources)
- Browser compatibility issues

---

## Common Issues and Solutions

### Issue 1: Events Not Loading

**Symptoms:**
- Blank timeline
- "Error al cargar eventos" message
- Console shows collection loading error

**Diagnosis:**
```javascript
// Check browser console for error messages
// Look for: "Critical error loading events"
```

**Root Causes:**
1. Build included corrupted event files
2. CDN serving stale/broken bundle
3. Browser extension blocking content

**Solutions:**
1. Rebuild and redeploy: `npm run build && [deploy]`
2. Clear CDN cache (Vercel/Netlify dashboard)
3. Test in incognito mode (rules out extensions)

**Prevention:**
- Always run `node scripts/validate-events.js` before deploy
- Test production build locally with `npm run preview`

---

### Issue 2: Search Not Working

**Symptoms:**
- No results for valid queries
- Search input freezes
- Console shows filtering errors

**Diagnosis:**
```javascript
// Check if search query updates state
// Look for debounce delay (300ms)
// Verify filteredEvents array updates
```

**Root Causes:**
1. Case-sensitivity issue with accented characters
2. Debounce not clearing properly
3. Filter logic broken by malformed data

**Solutions:**
1. Clear browser cache (force refresh: Cmd+Shift+R)
2. Test with simple query: "Lima"
3. Check event data for encoding issues

**Prevention:**
- Test search with special characters (ñ, á, é, etc.)
- Validate Spanish text encoding (UTF-8)

---

### Issue 3: Zoom Not Persisting

**Symptoms:**
- Zoom resets to 1.5x on page refresh
- localStorage key missing
- Zoom slider moves but doesn't save

**Diagnosis:**
```javascript
// Open DevTools > Application > Local Storage
// Look for: timeline-zoom-level
// Value should be between 0.5 and 3
```

**Root Causes:**
1. localStorage blocked (privacy mode)
2. localStorage quota exceeded
3. Browser doesn't support localStorage

**Solutions:**
1. Check browser settings (allow local storage)
2. Clear localStorage and retry
3. Test in different browser

**Prevention:**
- Add fallback for localStorage unavailable
- Show user message if persistence fails

---

### Issue 4: Mobile Layout Broken

**Symptoms:**
- Horizontal scroll on mobile
- Drawer doesn't open
- Touch gestures not working

**Diagnosis:**
```css
/* Check viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1">

/* Check CSS breakpoints */
@media (max-width: 768px) { ... }
```

**Root Causes:**
1. CSS media queries not applied
2. Touch event listeners not registered
3. Viewport meta tag missing

**Solutions:**
1. Verify viewport meta tag in HTML
2. Test touch events in Chrome DevTools (device mode)
3. Check CSS for mobile-specific styles

**Prevention:**
- Always test mobile layout before deploy
- Use real device testing, not just browser simulation

---

### Issue 5: Performance Degradation

**Symptoms:**
- Page load > 5 seconds
- Scrolling is janky
- High memory usage

**Diagnosis:**
```javascript
// Chrome DevTools > Performance tab
// Record 5 seconds of scrolling
// Look for:
// - Long tasks (> 50ms)
// - Memory leaks (increasing heap)
// - Excessive reflows/repaints
```

**Root Causes:**
1. Too many events rendered at once (3266 events)
2. IntersectionObserver not working
3. Memory leak in event listeners

**Solutions:**
1. Verify RAF throttling is active (lines 448-481 in EditorialTimeline.tsx)
2. Check IntersectionObserver cleanup (lines 195-224)
3. Profile memory usage over time

**Prevention:**
- Run Lighthouse audits before deploy
- Monitor bundle size growth
- Consider virtualization if event count grows 10x

---

## Performance Monitoring

### Lighthouse Audits (Weekly)

```bash
# Run Lighthouse from Chrome DevTools
# Or use CLI:
lighthouse https://your-site.com --view

# Target Scores:
# Performance: > 90
# Accessibility: > 95
# Best Practices: > 95
# SEO: > 90
```

**Key Metrics to Track:**

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| First Contentful Paint (FCP) | < 1.8s | 1.8s - 3s | > 3s |
| Largest Contentful Paint (LCP) | < 2.5s | 2.5s - 4s | > 4s |
| Time to Interactive (TTI) | < 3.8s | 3.8s - 7.3s | > 7.3s |
| Total Blocking Time (TBT) | < 200ms | 200ms - 600ms | > 600ms |
| Cumulative Layout Shift (CLS) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Real User Monitoring (RUM)

**If using Vercel Analytics:**
- Real Experience Score (aim for > 90)
- Core Web Vitals passing %
- Geographic performance breakdown

**If using Google Analytics:**
- Page Load Time (Behavior > Site Speed)
- Average Page Load by Browser
- Average Page Load by Device

**Custom Tracking:**
```javascript
// Example: Track key interactions
window.addEventListener('load', () => {
  performance.mark('page-interactive');
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log('Load time:', perfData.loadEventEnd - perfData.fetchStart);
});
```

---

## Error Tracking Setup

### Option 1: Browser Console Monitoring

**Manual Check:**
1. Open site in production
2. Open DevTools Console (F12)
3. Filter by: Errors (red X icon)
4. Document any recurring errors

**Automated Collection:**
```javascript
// Add to index.astro or global script
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Send to logging service if available
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});
```

### Option 2: Sentry (Recommended)

**Setup (if not already configured):**
```bash
npm install @sentry/astro

# Add to astro.config.mjs:
import sentry from '@sentry/astro';

export default defineConfig({
  integrations: [sentry()],
});
```

**Monitor:**
- Error rate trends
- Error grouping (same error repeated)
- User impact (how many users affected)
- Browser/device breakdown

### Option 3: LogRocket / Session Replay

**Benefits:**
- See exactly what user saw when error occurred
- Replay user sessions
- Console logs captured
- Network requests captured

---

## User Feedback Collection

### Passive Monitoring

**Analytics Signals:**
- High bounce rate on specific page → UX issue
- Low time on page → Content not engaging
- Search with 0 results → Missing content
- Repeat visits with short duration → Looking for specific info

### Active Feedback

**GitHub Issues:**
- Monitor repository for user-reported bugs
- Label issues: `bug`, `enhancement`, `question`
- Prioritize by severity and user impact

**Social Media:**
- Monitor mentions of site
- Respond to complaints/questions
- Document feature requests

**Contact Form (if available):**
- Categorize feedback: bug, feature, question
- Track common requests
- Respond within 24-48 hours

---

## Weekly Checklist

### Week 1 Post-Launch

```
[ ] Monday: Lighthouse audit, check error logs
[ ] Tuesday: Review analytics (sessions, bounce rate)
[ ] Wednesday: Mobile device testing (real iPhone/Android)
[ ] Thursday: Cross-browser check (Firefox, Safari)
[ ] Friday: User feedback review, prioritize issues
[ ] Weekend: Monitor any weekend traffic spikes
```

### Week 2-4

```
[ ] Weekly Lighthouse audit (compare trends)
[ ] Weekly analytics review (growth, engagement)
[ ] Bi-weekly device/browser testing
[ ] Continuous error log monitoring
[ ] Monthly comprehensive QA review
```

---

## Alerting Thresholds

### Critical (Respond Immediately)

- Error rate > 5%
- Site completely down (500 errors)
- Data integrity issue (events missing)
- Security vulnerability discovered

**Action:**
1. Assess impact (how many users affected)
2. Roll back if necessary (see DEPLOYMENT-CHECKLIST.md)
3. Fix and hotfix deploy
4. Post-mortem document

### High (Respond Within 24 Hours)

- Error rate > 1%
- Page load time > 10s
- Search not working for some users
- Mobile layout broken on specific devices

**Action:**
1. Document issue in GitHub Issues
2. Reproduce locally
3. Prioritize fix in next sprint
4. Deploy fix within 48 hours

### Medium (Respond Within Week)

- Performance degradation (LCP > 4s)
- UX issues (zoom not persisting for some users)
- Minor visual bugs (alignment, spacing)
- Accessibility issues discovered

**Action:**
1. Add to backlog
2. Prioritize based on user impact
3. Fix in regular maintenance window

### Low (Backlog)

- Style/linting warnings
- Minor performance optimizations
- Nice-to-have features
- Documentation improvements

**Action:**
1. Document in backlog
2. Fix when time permits
3. Bundle with other low-priority fixes

---

## Metrics Dashboard Template

Create a simple dashboard (Google Sheets or Notion):

| Date | Sessions | Bounce Rate | Avg Load | Errors | Mobile % | Notes |
|------|----------|-------------|----------|--------|----------|-------|
| 2026-05-21 | 0 | - | - | 0 | - | Launch day |
| 2026-05-22 | | | | | | |
| 2026-05-23 | | | | | | |
| ... | | | | | | |

**Track:**
- Daily sessions/users
- Bounce rate trend
- Average page load time
- Error count per day
- Mobile traffic percentage
- Notable events or issues

---

## When to Escalate

### Escalate to Team Lead If:

- Critical bug affecting > 10% of users
- Data integrity issue (events corrupted)
- Performance degraded > 50% from baseline
- Security vulnerability reported
- Negative press or viral complaint

### Escalate to DevOps If:

- Server/CDN outage
- SSL certificate expired
- DNS issues
- Hosting platform problems
- DDoS or suspicious traffic

### Escalate to Legal If:

- Copyright complaint (event content)
- Privacy concern (GDPR, etc.)
- Accessibility lawsuit threat
- Data breach or security incident

---

## Success Metrics (30 Days)

### Technical Health

- [x] Error rate < 1%
- [x] Page load time < 3s (median)
- [x] Lighthouse score > 90
- [x] 99.9% uptime
- [x] Zero critical bugs

### User Engagement

- [ ] > 1000 unique visitors
- [ ] Bounce rate < 40%
- [ ] Average session > 3 minutes
- [ ] > 5 pages per session
- [ ] Search used by > 30% of users

### Business Goals

- [ ] Positive user feedback (if survey)
- [ ] Social media shares/mentions
- [ ] Return visitor rate > 30%
- [ ] Mobile traffic > 40%
- [ ] Zero escalated issues

---

## Resources

### Documentation

- DEPLOYMENT-CHECKLIST.md - Deployment process
- QA-REPORT-ROUND-4.md - Final QA findings
- E2E-TEST-PLAN.md - Comprehensive test suite

### Tools

- Chrome DevTools - Performance profiling
- Lighthouse - Automated audits
- Google Analytics - User analytics (if configured)
- Vercel/Netlify Dashboard - Hosting metrics

### Support

- GitHub Issues - Bug reports
- Stack Overflow - Technical questions
- Astro Discord - Framework support

---

## Monthly Review Template

**Month 1 Review:**

**Technical Performance:**
- Average page load: [X]s
- Average error rate: [X]%
- Lighthouse scores: P:[X] A:[X] BP:[X] SEO:[X]
- Uptime: [X]%

**User Engagement:**
- Total sessions: [X]
- Unique visitors: [X]
- Bounce rate: [X]%
- Average session duration: [X] minutes
- Top searches: [list]

**Issues Resolved:**
- Critical: [X]
- High: [X]
- Medium: [X]
- Low: [X]

**Issues Remaining:**
- Critical: [X]
- High: [X]
- Medium: [X]
- Low: [X]

**Action Items for Month 2:**
1. [Priority item 1]
2. [Priority item 2]
3. [Priority item 3]

---

**Monitoring Guide Prepared By:** Sage (QA Agent)
**Last Updated:** 2026-05-21
**Review Schedule:** Update monthly or after major incidents

---

**Status: Active Monitoring** 📊
