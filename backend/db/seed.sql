-- Insert sample users (password is 'password123' for all)
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@teamtalk.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('john_doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('jane_smith', 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- Insert sample chats
INSERT INTO chats (name, type, created_by) VALUES 
('General', 'group', 1),
('Development', 'group', 1);

-- Add members to chats
INSERT INTO chat_members (chat_id, user_id, role) VALUES 
(1, 1, 'admin'),
(1, 2, 'member'),
(1, 3, 'member'),
(2, 1, 'admin'),
(2, 2, 'member');

-- Insert sample messages
INSERT INTO messages (chat_id, sender_id, content) VALUES 
(1, 1, 'Welcome to TeamTalk Pro+! 🎉'),
(1, 2, 'Thanks for setting this up!'),
(2, 1, 'Let''s discuss the project here');
