// How long any single request to the backend API is allowed to hang before
// we give up on it. Without this, a fetch() to a slow/unresponsive backend
// (a dead host that drops packets instead of refusing, or a sleeping free-tier
// server slowly waking up) can hang far longer than that — which, during
// `next build`, blows past Vercel's per-page static-generation time limit and
// fails the whole deployment. A short, explicit timeout means a bad backend
// fails fast and predictably instead.
export const API_TIMEOUT_MS = 8_000;
