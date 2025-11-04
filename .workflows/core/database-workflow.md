---
description: "Database management workflow with schema control, migration best practices, and data persistence protocols. Apply when working with database operations, schema management, or data persistence tasks."
alwaysApply: false
category: "development"
priority: "medium"
triggers:
  - "keywords: database, schema, migration, sql"
  - "file_patterns: *.sql, *.migration, schema.*"
  - "context: database operations, data modeling"
---

# Database Management Workflow

## Schema Design Principles

### Normalization

- **First Normal Form (1NF)**: Eliminate duplicate columns
- **Second Normal Form (2NF)**: Remove partial dependencies
- **Third Normal Form (3NF)**: Remove transitive dependencies
- **BCNF**: Boyce-Codd Normal Form for complex relationships

### Naming Conventions

- **Tables**: Use plural nouns (e.g., `users`, `orders`, `products`)
- **Columns**: Use descriptive names (e.g., `created_at`, `user_id`)
- **Indexes**: Prefix with `idx_` (e.g., `idx_user_email`)
- **Foreign Keys**: Use `fk_` prefix (e.g., `fk_user_id`)
- **Constraints**: Use descriptive names (e.g., `chk_positive_amount`)

### Data Types

- **Integers**: Use appropriate size (INT, BIGINT, SMALLINT)
- **Strings**: Use VARCHAR with appropriate length
- **Dates**: Use TIMESTAMP for timezone-aware dates
- **Decimals**: Use DECIMAL for precise financial calculations
- **Booleans**: Use BOOLEAN or TINYINT(1)

## Migration Management

### Migration File Structure

```sql
-- Migration: 001_create_users_table.sql
-- Description: Create users table with basic authentication fields
-- Author: [Author Name]
-- Date: [YYYY-MM-DD]

-- Up Migration
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_user_email (email),
    INDEX idx_user_created_at (created_at)
);

-- Down Migration
DROP TABLE users;
```

### Migration Best Practices

- **Sequential Naming**: Use timestamp or sequential numbers
- **Descriptive Names**: Include purpose in filename
- **Reversible**: Always include down migration
- **Atomic**: Each migration should be atomic
- **Tested**: Test both up and down migrations

### Migration Workflow

1. **Create Migration**: Generate migration file
2. **Write Schema**: Define table structure
3. **Test Locally**: Run migration on development
4. **Review**: Code review migration
5. **Deploy**: Apply to staging/production
6. **Verify**: Confirm migration success

## Database Operations

### CRUD Operations

#### Create (INSERT)

```sql
-- Single record
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES ('user@example.com', 'hashed_password', 'John', 'Doe');

-- Multiple records
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES 
    ('user1@example.com', 'hash1', 'Jane', 'Smith'),
    ('user2@example.com', 'hash2', 'Bob', 'Johnson');
```

#### Read (SELECT)

```sql
-- Basic select
SELECT id, email, first_name, last_name, created_at
FROM users
WHERE deleted_at IS NULL;

-- With joins
SELECT u.email, p.title, p.content
FROM users u
JOIN posts p ON u.id = p.user_id
WHERE u.deleted_at IS NULL;

-- With aggregation
SELECT COUNT(*) as total_users, 
       COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as new_users
FROM users
WHERE deleted_at IS NULL;
```

#### Update (UPDATE)

```sql
-- Single record update
UPDATE users 
SET first_name = 'Johnny', updated_at = CURRENT_TIMESTAMP
WHERE id = 1 AND deleted_at IS NULL;

-- Batch update
UPDATE users 
SET last_login = CURRENT_TIMESTAMP
WHERE id IN (1, 2, 3) AND deleted_at IS NULL;
```

#### Delete (DELETE)

```sql
-- Soft delete (recommended)
UPDATE users 
SET deleted_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Hard delete (use with caution)
DELETE FROM users WHERE id = 1;
```

### Query Optimization

#### Indexing Strategy

- **Primary Keys**: Automatically indexed
- **Foreign Keys**: Index for join performance
- **Frequently Queried Columns**: Add indexes
- **Composite Indexes**: For multi-column queries
- **Avoid Over-Indexing**: Too many indexes slow writes

#### Query Performance

- Use `EXPLAIN` to analyze query plans
- Avoid `SELECT *` in production
- Use appropriate WHERE clauses
- Limit result sets with `LIMIT`
- Use prepared statements for repeated queries

## Data Integrity

### Constraints

```sql
-- Primary Key
ALTER TABLE users ADD PRIMARY KEY (id);

-- Foreign Key
ALTER TABLE posts ADD CONSTRAINT fk_posts_user_id 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Check Constraint
ALTER TABLE products ADD CONSTRAINT chk_positive_price 
CHECK (price > 0);

-- Unique Constraint
ALTER TABLE users ADD CONSTRAINT uk_user_email UNIQUE (email);

-- Not Null Constraint
ALTER TABLE users MODIFY email VARCHAR(255) NOT NULL;
```

### Data Validation

- **Application Level**: Validate before database operations
- **Database Level**: Use constraints for data integrity
- **Business Rules**: Implement in stored procedures or application logic
- **Data Types**: Use appropriate data types for validation

## Security Best Practices

### SQL Injection Prevention

- Use parameterized queries/prepared statements
- Validate and sanitize all inputs
- Use least privilege principle for database users
- Regular security audits and updates

### Access Control

```sql
-- Create specific database user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'secure_password';

-- Grant minimal required permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON myapp.* TO 'app_user'@'localhost';

-- Revoke unnecessary permissions
REVOKE ALL PRIVILEGES ON *.* FROM 'app_user'@'localhost';
```

### Data Protection

- Encrypt sensitive data at rest
- Use SSL/TLS for database connections
- Implement proper backup and recovery procedures
- Regular security updates and patches

## Backup and Recovery

### Backup Strategy

- **Full Backups**: Complete database backup
- **Incremental Backups**: Changes since last backup
- **Point-in-Time Recovery**: Restore to specific timestamp
- **Automated Backups**: Schedule regular backups

### Recovery Procedures

1. **Assess Damage**: Determine scope of data loss
2. **Choose Recovery Method**: Full restore vs. point-in-time
3. **Prepare Environment**: Set up recovery environment
4. **Execute Recovery**: Restore from backup
5. **Verify Data**: Confirm data integrity
6. **Update Application**: Point application to recovered database

## Monitoring and Maintenance

### Performance Monitoring

- Monitor query performance
- Track slow queries
- Monitor database size and growth
- Check index usage statistics

### Maintenance Tasks

- Regular index optimization
- Update table statistics
- Clean up old data
- Monitor disk space usage
- Check for deadlocks and blocking

---

**Success Criteria**: Well-designed schema, efficient queries, data integrity, security compliance, and reliable backup/recovery procedures.
