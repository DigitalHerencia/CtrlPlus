// Shim for 'server-only' import during Vitest runs
// Next.js exports 'server-only' as a directive; tests run in Vite and need a harmless shim.
module.exports = {}
