DROP DATABASE IF EXISTS projetsangsiri;

CREATE DATABASE projetsangsiri;

USE projetsangsiri;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS user_subscription;
DROP TABLE IF EXISTS publication;
DROP TABLE IF EXISTS publication_reaction;
DROP TABLE IF EXISTS publication_mention;
DROP TABLE IF EXISTS publication_hashtag;

CREATE TABLE user(
	user_id INTEGER AUTO_INCREMENT,
	username VARCHAR(16) NOT NULL,
	email VARCHAR(24) NOT NULL,
	password VARCHAR(128) NOT NULL,
	picture VARCHAR (25) DEFAULT 'default.jpg',
	PRIMARY KEY(user_id),
	UNIQUE(username),
	UNIQUE(email),	
	UNIQUE(picture)
);

CREATE TABLE user_subscription(
	user_id INTEGER,
	subscribe_to INTEGER,
	FOREIGN KEY (user_id) REFERENCES user(user_id),
	FOREIGN KEY (subscribe_to) REFERENCES user(user_id),
	PRIMARY KEY(user_id, subscribe_to)
);

-- faire un UNION our prendre en compte le at_everyone--
-- gérer au côté client la limite de 280 caractères--
CREATE TABLE publication(
	publication_id INTEGER AUTO_INCREMENT,
	author_id INTEGER NOT NULL,
	date DATE NOT NULL,
	content VARCHAR(280) NOT NULL,
	at_everyone BOOLEAN DEFAULT false,
	PRIMARY KEY(publication_id),
	FOREIGN KEY (author_id) REFERENCES user(user_id) 
);

CREATE TABLE publication_reaction(
	publication_id INTEGER, 
	reactor_id INTEGER,
	liked BOOLEAN DEFAULT NULL,
	PRIMARY KEY(publication_id, reactor_id),
	FOREIGN KEY (publication_id) REFERENCES publication(publication_id),
	FOREIGN KEY (reactor_id) REFERENCES user(user_id)
);

CREATE TABLE publication_mention(
	publication_id INTEGER,
	user_id INTEGER,
	FOREIGN KEY (user_id) REFERENCES user(user_id),
	FOREIGN KEY (publication_id) REFERENCES publication(publication_id),
	PRIMARY KEY(publication_id, user_id)
);

CREATE TABLE publication_hashtag(
	publication_id INTEGER,
	hashtag VARCHAR(64),
	FOREIGN KEY (publication_id) REFERENCES publication(publication_id),
	PRIMARY KEY(publication_id, hashtag)
);

	

