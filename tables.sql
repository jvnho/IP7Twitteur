DROP DATABASE IF EXISTS projetsangsiri;

CREATE DATABASE projetsangsiri;

USE projetsangsiri;

DROP TABLE IF EXISTS publication_reaction;
DROP TABLE IF EXISTS publication_mention;
DROP TABLE IF EXISTS publication_hashtag;
DROP TABLE IF EXISTS user_subscription;
DROP TABLE IF EXISTS publication;
DROP TABLE IF EXISTS user;

CREATE TABLE user(
	user_id INTEGER AUTO_INCREMENT,
	username VARCHAR(32) NOT NULL,
	email VARCHAR(64) NOT NULL,
	password VARCHAR(128) NOT NULL,
	picture VARCHAR (25) DEFAULT 'default.jpg',
	PRIMARY KEY(user_id),
	UNIQUE(username),
	UNIQUE(email)
);

CREATE TABLE user_subscription(
	user_id INTEGER,
	subscribe_to INTEGER,
	FOREIGN KEY (user_id) REFERENCES user(user_id),
	FOREIGN KEY (subscribe_to) REFERENCES user(user_id),
	PRIMARY KEY(user_id, subscribe_to)
);

CREATE TABLE publication(
	publication_id INTEGER AUTO_INCREMENT,
	author_id INTEGER NOT NULL,
	date DATETIME NOT NULL,
	content VARCHAR(280) NOT NULL,
	at_everyone BOOLEAN DEFAULT false,
	PRIMARY KEY(publication_id),
	FOREIGN KEY (author_id) REFERENCES user(user_id) 
);

CREATE TABLE publication_reaction(
	publication_id INTEGER, 
	reactor_id INTEGER,
	liked BOOLEAN DEFAULT false,
	PRIMARY KEY(publication_id, reactor_id),
	FOREIGN KEY (publication_id) REFERENCES publication(publication_id),
	FOREIGN KEY (reactor_id) REFERENCES user(user_id)
);

CREATE TABLE publication_mention(
	publication_id INTEGER,
	user_mentionned VARCHAR(32),
	FOREIGN KEY (publication_id) REFERENCES publication(publication_id),
	PRIMARY KEY(publication_id, user_mentionned)
);

CREATE TABLE publication_hashtag(
	publication_id INTEGER,
	hashtag VARCHAR(64),
	FOREIGN KEY (publication_id) REFERENCES publication(publication_id),
	PRIMARY KEY(publication_id, hashtag)
);

INSERT INTO `user` VALUES (1,'nicolas','nicolassangsiri@gmail.com','deb97a759ee7b8ba42e02dddf2b412fe','nicolas'),(2,'client','client@gmail.com','62608e08adc29a8d6dbc9754e659f125','default.jpg'),(3,'client2','client2@yahoo.fr','2c66045d4e4a90814ce9280272e510ec','default.jpg');
INSERT INTO `user_subscription` VALUES (2,1),(3,1),(1,2),(3,2);
INSERT INTO `publication` VALUES (1,1,'2021-05-08 09:35:00','Salut @everyone #nouveau',1),(2,2,'2021-05-08 09:36:48','Salut @nicolas',1),(3,1,'2021-05-08 21:52:35','salut moi',0),(4,1,'2021-05-08 21:53:24','Salut toi @everyone',1),(5,2,'2021-05-11 18:56:09','Salut @everyone',1),(6,2,'2021-05-11 19:03:53','Salut encore @everyone',1),(7,2,'2021-05-11 19:09:07','Hii @everyone',1),(8,2,'2021-05-11 19:39:54','test @everyone',1),(9,2,'2021-05-11 19:40:31','Hey @nicolas',0),(10,2,'2021-05-11 19:40:57','Salut mes abonnés ^^',0),(11,2,'2021-05-11 19:48:21','allo',0),(12,2,'2021-05-11 19:51:31','Salut salut',0);
INSERT INTO `publication_hashtag` VALUES (1,'nouveau');
INSERT INTO `publication_mention` VALUES (1,'everyone'),(2,'nicolas'),(4,'everyone'),(5,'everyone'),(6,'everyone'),(7,'everyone'),(8,'everyone'),(9,'nicolas');
INSERT INTO `publication_reaction` VALUES (2,1,1),(2,3,1),(4,2,1),(7,1,1),(8,1,1);