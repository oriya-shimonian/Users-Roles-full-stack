-- יצירת טבלאות (SQLite Dialect, יעבוד גם ברוב הכלים עם התאמות קלות ל-SQL Server)
PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS Users (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  Username TEXT NOT NULL,
  Email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Roles (
  Id INTEGER PRIMARY KEY AUTOINCREMENT,
  RoleName TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS UserRoles (
  UserId INTEGER NOT NULL,
  RoleId INTEGER NOT NULL,
  PRIMARY KEY (UserId, RoleId),
  FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
  FOREIGN KEY (RoleId) REFERENCES Roles(Id) ON DELETE CASCADE
);

-- נתוני התחלה
INSERT INTO Users (Username, Email) VALUES
('alice', 'alice@example.com'),
('bob',   'bob@example.com'),
('charlie','charlie@example.com');

INSERT INTO Roles (RoleName) VALUES
('Admin'),
('Editor'),
('Viewer');

-- שיוכים לדוגמה
INSERT INTO UserRoles (UserId, RoleId)
SELECT u.Id, r.Id FROM Users u, Roles r
WHERE u.Username='alice' AND r.RoleName='Admin';

INSERT INTO UserRoles (UserId, RoleId)
SELECT u.Id, r.Id FROM Users u, Roles r
WHERE u.Username='bob' AND r.RoleName='Viewer';

-- שאילתה: כל המשתמשים שיש להם תפקיד בשם 'Admin'
-- (נדרש במשימה)
-- הפקה:
SELECT u.*
FROM Users u
JOIN UserRoles ur ON u.Id = ur.UserId
JOIN Roles r ON r.Id = ur.RoleId
WHERE r.RoleName = 'Admin';
