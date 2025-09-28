-- =========================================================
-- RoleManager schema & seed (SQLite dialect)
-- This script creates the many-to-many Users↔Roles schema,
-- seeds a few sample rows, and includes the required query:
-- "All users that have the 'Admin' role".
-- NOTE: Works on SQLite as-is. For SQL Server, minor syntax
-- adjustments may be required (e.g., IDENTITY vs AUTOINCREMENT).
-- =========================================================

-- Enforce foreign keys (SQLite requires enabling it per connection)
PRAGMA foreign_keys = ON;

-- ===========================
-- Tables
-- ===========================

-- Users: application accounts. Email has no unique constraint here
-- because this script is designed for a one-time initialization.
CREATE TABLE IF NOT EXISTS Users (
  Id       INTEGER PRIMARY KEY AUTOINCREMENT,
  Username TEXT    NOT NULL,
  Email    TEXT    NOT NULL
);

-- Roles: catalog of role names. RoleName is unique.
CREATE TABLE IF NOT EXISTS Roles (
  Id       INTEGER PRIMARY KEY AUTOINCREMENT,
  RoleName TEXT    NOT NULL UNIQUE
);

-- UserRoles: junction table (many-to-many between Users and Roles).
-- Composite primary key prevents duplicate assignments.
-- ON DELETE CASCADE removes links if a user/role is deleted.
CREATE TABLE IF NOT EXISTS UserRoles (
  UserId INTEGER NOT NULL,
  RoleId INTEGER NOT NULL,
  PRIMARY KEY (UserId, RoleId),
  FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
  FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

-- ===========================
-- Seed data (example rows)
-- ===========================

INSERT INTO Users (Username, Email) VALUES
('alice',  'alice@example.com'),
('bob',    'bob@example.com'),
('charlie','charlie@example.com');

INSERT INTO Roles (RoleName) VALUES
('Admin'),
('Editor'),
('Viewer');

-- Example assignments:
-- alice  → Admin
-- bob    → Viewer
-- (Using a SELECT join style to look up the foreign keys by names.)
INSERT INTO UserRoles (UserId, RoleId)
SELECT u.Id, r.Id FROM Users u, Roles r
WHERE u.Username = 'alice' AND r.RoleName = 'Admin';

INSERT INTO UserRoles (UserId, RoleId)
SELECT u.Id, r.Id FROM Users u, Roles r
WHERE u.Username = 'bob' AND r.RoleName = 'Viewer';

-- ===========================
-- Required query:
-- All users that have a role named 'Admin'
-- ===========================
SELECT u.*
FROM Users u
JOIN UserRoles ur ON u.Id = ur.UserId
JOIN Roles r      ON r.Id = ur.RoleId
WHERE r.RoleName = 'Admin';
