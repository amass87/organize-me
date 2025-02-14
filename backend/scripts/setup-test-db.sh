#!/bin/bash
# backend/scripts/setup-test-db.sh

# Load test environment variables
source .env.test

# Create test database and user
psql "postgresql://postgres@localhost" << EOF
  DROP DATABASE IF EXISTS ${DB_NAME};
  DROP USER IF EXISTS ${DB_USER};
  
  CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
  CREATE DATABASE ${DB_NAME} WITH OWNER ${DB_USER};
  
  \c ${DB_NAME}
  
  GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${DB_USER};
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${DB_USER};
  ALTER USER ${DB_USER} CREATEDB;
EOF
