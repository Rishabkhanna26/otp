/**
 * userStore.js — In-memory user store.
 * Replace with MongoDB / PostgreSQL in production.
 */

const users = new Map();

function findUser(email) {
  return users.get(email.toLowerCase().trim()) || null;
}

function createUser({ name, email }) {
  const user = {
    id: Date.now().toString(),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    createdAt: new Date().toISOString(),
  };
  users.set(user.email, user);
  return user;
}

function userExists(email) {
  return users.has(email.toLowerCase().trim());
}

module.exports = { findUser, createUser, userExists };
