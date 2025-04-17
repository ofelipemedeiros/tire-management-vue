// src/utils/token.js

let cachedToken = null;

export function getTokenFromUrl() {
  if (cachedToken) return cachedToken;
  const params = new URLSearchParams(window.location.search);
  cachedToken = params.get('token');
  return cachedToken;
}

export function setToken(token) {
  cachedToken = token;
}

export function getToken() {
  return cachedToken;
}
