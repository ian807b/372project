-- create database
CREATE DATABASE planet_online;

-- users table
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(18) PRIMARY KEY,
    email VARCHAR(255),
    password VARCHAR(60),
    role CHAR DEFAULT 'u',
    city VARCHAR(25),
    country VARCHAR(25),
    lat DECIMAL,
    long DECIMAL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- forum topics
CREATE TABLE IF NOT EXISTS topics (
    topic_id VARCHAR(18) PRIMARY KEY,
    topic_name VARCHAR(60),
    description TEXT
);
-- messages
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_name VARCHAR(18) REFERENCES users(username) NOT NULL,
  receiver_name VARCHAR(18) REFERENCES users(username) NOT NULL,
  content TEXT NOT NULL,
  conversation_id INTEGER REFERENCES conversations(id) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);
-- conversation
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user1_name VARCHAR(18) REFERENCES users(username) NOT NULL,
  user2_name VARCHAR(18) REFERENCES users(username) NOT NULL,
  last_message_id INTEGER REFERENCES messages(id),
  UNIQUE (user1_name, user2_name)
);

--- default topics
INSERT INTO topics(topic_id, topic_name, description) VALUES ('ot', 'Offtopic', 'A place for all other topics.');
INSERT INTO topics(topic_id, topic_name, description) VALUES ('fin', 'Finance', 'Business, markets, and personal finance.');
INSERT INTO topics(topic_id, topic_name, description) VALUES ('fit', 'Fitness', 'Health and Fitness');
INSERT INTO topics(topic_id, topic_name, description) VALUES ('med', 'Media', 'Films, Television, etc.');
INSERT INTO topics(topic_id, topic_name, description) VALUES ('tech', 'Technology', 'Any kind of technologies.');
INSERT INTO topics(topic_id, topic_name, description) VALUES ('adv', 'Advice', 'Giving and recieving advice.');

CREATE TABLE IF NOT EXISTS posts (
	-- post data
	p_post_id SERIAL PRIMARY KEY,
	p_username VARCHAR(18) REFERENCES users(username),
	p_topic_id VARCHAR(18) REFERENCES topics(topic_id),
	p_text VARCHAR(2000),
	p_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	p_thread_id INT DEFAULT -1, --1 indicates its a thread
	p_country_code CHAR(2) DEFAULT '',
	p_banned_for BOOLEAN DEFAULT 'f',

	-- thread data (only if p_thread_id == -1)
	t_subject VARCHAR(120),
	t_pinned BOOLEAN DEFAULT 'f',
	t_bump_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- table for holding replies relationship between posts
CREATE TABLE Replies(
	parent_id SERIAL REFERENCES posts(p_post_id),
	reply_id SERIAL REFERENCES posts(p_post_id)
);


-- post in a thread function (returns the newly added post id)
CREATE OR REPLACE FUNCTION post_reply(
	in_p_username VARCHAR(18),
	in_p_topic_id VARCHAR(18),
	in_p_text VARCHAR(2000),
	in_p_thread_id INT,
	in_p_country_code CHAR(2)
)
RETURNS INT AS $$
DECLARE fresh_user INT := 1;
DECLARE new_post_id INT := -1;
BEGIN
	INSERT INTO Posts(
		p_thread_id, p_topic_id, p_username, p_text, p_country_code)
	VALUES(
		in_p_thread_id, in_p_topic_id, in_p_username, in_p_text, in_p_country_code);
	SELECT currval(pg_get_serial_sequence('posts', 'p_post_id')) INTO new_post_id;
	RETURN new_post_id;
END;
$$ LANGUAGE plpgsql;

-- admin account with 'admin' password
INSERT INTO users(username, password, role) VALUES('admin', '$2b$06$1wcYUIBGW9pdy9Nv/M4a/eYtJyIUG7DPVTDIJ3KCoLVtw8eAhbC6a', 'a');