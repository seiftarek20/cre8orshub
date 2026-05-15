# Security Rate Limiting

## Frontend Safeguards

The app includes lightweight frontend cooldowns to reduce accidental double submits and repeated clicks. These checks improve UX, but they are not real security controls.

Users can bypass frontend JavaScript, open multiple devices, replay network requests, or call Supabase endpoints directly. Supabase RLS, validation, and backend/edge rate limiting must remain the authority.

## Production Recommendation

Use server-side or edge-side rate limiting for all write-heavy and abuse-prone flows:

- Supabase Edge Functions for protected LMS mutations.
- Vercel Edge Middleware for route-level and API-level request throttling.
- Upstash Redis or a similar shared low-latency store for counters.
- CAPTCHA on public booking if spam appears.

## Recommended Limits

| Action | Limit |
| --- | --- |
| Login/signup | 5 requests per minute per IP |
| Booking requests | 3 requests per minute per IP |
| Task submissions | 2 requests per minute per user |
| Project updates | 5 requests per minute per user |
| Admin review actions | 10 requests per minute per admin |
| Admin task/project/booking updates | 10 requests per minute per admin |

## Implementation Notes

- Keep Supabase Row Level Security enabled for all LMS tables.
- Keep service-role keys only in trusted backend/edge environments.
- Do not expose service-role keys to Vite, React, or browser code.
- Prefer shared counters keyed by IP, authenticated user ID, action name, and route.
- Log rejected attempts for public booking and auth abuse monitoring.
- Return generic error messages to users and detailed diagnostics only to server logs.
