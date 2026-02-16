-- Initial test database setup
CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO test_table (name) VALUES 
    ('Test Entry 1'),
    ('Test Entry 2'),
    ('Test Entry 3');
