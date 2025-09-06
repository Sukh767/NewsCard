// Type definitions for JSDoc comments

/**
 * @typedef {Object} NewsArticle
 * @property {string} _id
 * @property {string} title
 * @property {string} content
 * @property {string} description
 * @property {string} category
 * @property {string} image
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} username
 * @property {string} email
 * @property {'admin'|'user'} role
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {function(string, string): Promise<boolean>} login
 * @property {function(string, string, string): Promise<boolean>} register
 * @property {function(): void} logout
 * @property {boolean} isAuthenticated
 * @property {boolean} isAdmin
 */

export {};