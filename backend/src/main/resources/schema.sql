-- ============================================================
-- University Library & Financial Management System
-- PostgreSQL Database Schema
-- ============================================================

-- ============================================================
-- 1. USERS (Admin & Staff login accounts)
-- ============================================================
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(100) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,         -- store hashed password (BCrypt)
    full_name   VARCHAR(150) NOT NULL,
    email       VARCHAR(150) UNIQUE,
    phone       VARCHAR(20),
    role        VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'STAFF')),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. BOOKS
-- ============================================================
CREATE TABLE books (
    id                  SERIAL PRIMARY KEY,
    title               VARCHAR(255) NOT NULL,
    author              VARCHAR(150),
    category            VARCHAR(100),
    isbn                VARCHAR(50) UNIQUE,
    publisher           VARCHAR(150),
    published_year      INT,
    total_quantity      INT DEFAULT 1,
    available_quantity  INT DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. MEMBERS (Students & University Staff who borrow books)
-- ============================================================
CREATE TABLE members (
    id              SERIAL PRIMARY KEY,
    full_name       VARCHAR(150) NOT NULL,
    email           VARCHAR(150) UNIQUE,
    phone           VARCHAR(20),
    student_id      VARCHAR(50) UNIQUE,        -- student/staff ID card number
    member_type     VARCHAR(20) CHECK (member_type IN ('STUDENT', 'STAFF')),
    department      VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. BORROW RECORDS
-- ============================================================
CREATE TABLE borrow_records (
    id              SERIAL PRIMARY KEY,
    book_id         INT NOT NULL REFERENCES books(id),
    member_id       INT NOT NULL REFERENCES members(id),
    issued_by       INT REFERENCES users(id),  -- staff who issued the book
    borrow_date     DATE NOT NULL,
    due_date        DATE NOT NULL,
    return_date     DATE,
    status          VARCHAR(20) DEFAULT 'BORROWED' CHECK (status IN ('BORROWED', 'RETURNED', 'OVERDUE')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 5. FINES
-- ============================================================
CREATE TABLE fines (
    id              SERIAL PRIMARY KEY,
    borrow_id       INT NOT NULL REFERENCES borrow_records(id),
    member_id       INT NOT NULL REFERENCES members(id),
    amount          DECIMAL(10,2) NOT NULL,
    paid            BOOLEAN DEFAULT FALSE,
    paid_at         TIMESTAMP,
    collected_by    INT REFERENCES users(id),  -- staff who collected fine
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. THESIS INVOICE
-- ============================================================
CREATE TABLE thesis_invoices (
    id              SERIAL PRIMARY KEY,
    invoice_number  VARCHAR(50) UNIQUE NOT NULL,
    member_id       INT NOT NULL REFERENCES members(id),
    thesis_title    VARCHAR(255),
    description     TEXT,
    amount          DECIMAL(10,2) NOT NULL,
    status          VARCHAR(20) DEFAULT 'UNPAID' CHECK (status IN ('UNPAID', 'PAID', 'CANCELLED')),
    issued_by       INT REFERENCES users(id),
    paid_at         TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. CLEARANCE REQUESTS
-- ============================================================
CREATE TABLE clearance_requests (
    id              SERIAL PRIMARY KEY,
    member_id       INT NOT NULL REFERENCES members(id),
    reason          TEXT,
    request_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    note            TEXT,                      -- admin note on approval/rejection
    reviewed_by     INT REFERENCES users(id),  -- admin who approved/rejected
    reviewed_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. INCOME TRANSACTIONS
-- ============================================================
CREATE TABLE income_transactions (
    id                  SERIAL PRIMARY KEY,
    source              VARCHAR(50) CHECK (source IN ('FINE', 'THESIS', 'OTHER')),
    reference_id        INT,                   -- fine id or thesis_invoice id
    amount              DECIMAL(10,2) NOT NULL,
    description         TEXT,
    transaction_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    received_by         INT REFERENCES users(id),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 9. EXPENSES
-- ============================================================
CREATE TABLE expenses (
    id              SERIAL PRIMARY KEY,
    category        VARCHAR(100),              -- e.g. 'SUPPLIES', 'MAINTENANCE', 'UTILITIES'
    amount          DECIMAL(10,2) NOT NULL,
    description     TEXT,
    expense_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    created_by      INT REFERENCES users(id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 10. STAFF PAYOUTS
-- ============================================================
CREATE TABLE staff_payouts (
    id              SERIAL PRIMARY KEY,
    user_id         INT NOT NULL REFERENCES users(id),
    amount          DECIMAL(10,2) NOT NULL,
    payout_date     DATE NOT NULL DEFAULT CURRENT_DATE,
    note            TEXT,
    status          VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID')),
    approved_by     INT REFERENCES users(id),  -- admin who approved
    paid_at         TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- DEFAULT ADMIN ACCOUNT
-- password: admin123 (BCrypt hashed - change after first login!)
-- ============================================================
INSERT INTO users (username, password, full_name, email, role)
VALUES (
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'System Administrator',
    'admin@library.edu',
    'ADMIN'
);
