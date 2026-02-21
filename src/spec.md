# Specification

## Summary
**Goal:** Build a web-based workforce platform connecting blue-collar workers with employers through skill-based job matching, QR attendance tracking, and reliability scoring.

**Planned changes:**
- Worker authentication with profile creation (name, mobile, auto-generated Worker ID, skills multi-select, experience level, availability toggle, wage range, location)
- Generate unique QR code per worker for identification and attendance
- Employer authentication with company profile setup (company name, contact person, mobile, company type, location)
- Job posting system for single/bulk listings (skill, wage, duration, shift timing, worker count, location, description)
- Job matching algorithm based on skill match %, distance radius, availability, and reliability score
- Worker job discovery interface with filters (distance, wage, duration) and accept/reject functionality
- QR-based check-in/check-out system with work history tracking
- 5-star rating system with reliability score calculation (ratings + attendance + completion rate)
- Worker payment tracking interface (payment status, earning history, total earnings)
- Employer workforce management dashboard (hired workers, live attendance, replacement requests, analytics)
- Admin dashboard with system metrics (workers, employers, jobs, fill rate, time to fill, retention rates)
- Employer candidate review interface (matched workers with scores, confirm slots, auto-fill option)
- Modern, minimal UI with clean color scheme (avoiding blue/purple), large touch targets, and clear typography

**User-visible outcome:** Workers can create profiles with QR codes, discover and apply for nearby jobs, track attendance and earnings. Employers can post jobs, review matched candidates, track attendance via QR scanning, rate workers, and manage workforce. Admins can monitor platform-wide metrics and performance.
