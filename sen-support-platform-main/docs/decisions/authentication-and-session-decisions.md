# Authentication, session and password decisions

**Owner:** Aknur — Security, Privacy & QA  
**Status:** Draft for supervisor and backend review, 22 October 2026  
**Scope:** pre-defense design decision; the API does not yet implement authentication.

## Decision summary

| Topic | Proposed decision | Reason / follow-up |
|---|---|---|
| Password hashing | Argon2id using a maintained Go library, unique random salt and parameters stored with the hash | Memory-hard default candidate. Pin and review the library; benchmark on the deployment target before fixing parameters. Bcrypt is an acceptable fallback if Argon2id integration is not supportable. |
| Access credential | Short-lived signed access token held in browser memory only | Limits persistence after page close. Validate signature algorithm, issuer, audience, expiry and account status on each request. Never accept a role from client claims without checking trusted server-side data. |
| Refresh credential | Opaque, high-entropy random token in `Secure`, `HttpOnly`, `SameSite=Lax` cookie; store only a hash server-side; rotate at refresh and revoke on logout/reuse detection | Cookie is not readable by JavaScript; because it is sent automatically, use CSRF protection on state-changing requests and strict Origin/CORS checks. |
| Browser persistence | Do not put access or refresh tokens in `localStorage` or `sessionStorage` | Persistent script-readable storage increases the impact of XSS. |
| Password reset / email verification | Single-use random token, hashed at rest, short expiry, generic response that does not reveal whether an email exists; invalidate outstanding reset tokens after use | Exact expiry and mail delivery mechanism remain backend decisions. Do not log token values. |
| Logout / revocation | Revoke the refresh-token family server-side and clear the cookie; reject inactive accounts and revoked credentials | Short access-token lifetime bounds the remaining exposure; if immediate access-token revocation is required, add a server-side session/version check. |

## Request flow

1. Registration stores a password hash; the public request cannot set `role=admin`.
2. Login verifies the hash with a timing-safe library operation and returns a short-lived access token in the response body, plus a refresh cookie.
3. The React client keeps the access token in memory and sends it as a bearer token. It never writes credentials to browser storage.
4. Refresh uses the cookie plus CSRF/Origin checks, rotates the token atomically, and rejects reuse of an already rotated token.
5. Logout revokes the server-side token record and expires the cookie.

## Security acceptance points

- HTTPS only in deployment; `Secure` cookies outside local development.
- CSRF token or equivalent defense for cookie-authenticated refresh/logout operations; strict CORS allowlist; no wildcard credentialed CORS.
- Refresh token hash is not a password hash; use a fast cryptographic hash for high-entropy random tokens and never store the raw token.
- Hash parameters are configurable and benchmarked; rehash on successful login when parameters become obsolete.
- Login/reset messages do not disclose account existence; rate limits and audit events contain no secrets.
- Tests cover wrong/expired/reused tokens, logout revocation, account deactivation, CSRF, XSS storage review and role tampering.

## Alternatives and decision caveat

Server-side opaque sessions simplify immediate revocation and make token handling less error-prone, but require a session store and lookup on requests. JWTs fit the current security requirements, but do not provide immediate revocation by themselves. The proposed hybrid is consistent with the existing short-lived access token plus rotated refresh token requirements; confirm it with the supervisor and backend owner before implementation. If the prototype scope does not need distributed API clients, switching to opaque server sessions is a valid simpler option.

## References

- OWASP, Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- OWASP, Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP, CSRF Prevention Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Existing project requirements: [Security and privacy requirements](../security-privacy-requirements.md), SEC-01–08 and SEC-22.
