-- MySQL dump 10.13  Distrib 8.0.25, for Linux (x86_64)
--
-- Host: localhost    Database: projetsangsiri
-- ------------------------------------------------------
-- Server version	8.0.25-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `publication`
--

DROP TABLE IF EXISTS `publication`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publication` (
  `publication_id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL,
  `date` datetime NOT NULL,
  `content` varchar(280) NOT NULL,
  `at_everyone` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`publication_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `publication_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publication`
--

LOCK TABLES `publication` WRITE;
/*!40000 ALTER TABLE `publication` DISABLE KEYS */;
INSERT INTO `publication` VALUES (1,1,'2021-05-08 09:35:00','Salut @everyone #nouveau',1),(2,2,'2021-05-08 09:36:48','Salut @nicolas',1),(3,1,'2021-05-08 21:52:35','salut moi',0),(4,1,'2021-05-08 21:53:24','Salut toi @everyone',1),(5,2,'2021-05-11 18:56:09','Salut @everyone',1),(6,2,'2021-05-11 19:03:53','Salut encore @everyone',1),(7,2,'2021-05-11 19:09:07','Hii @everyone',1),(8,2,'2021-05-11 19:39:54','test @everyone',1),(9,2,'2021-05-11 19:40:31','Hey @nicolas',0),(10,2,'2021-05-11 19:40:57','Salut mes abonnés ^^',0),(11,2,'2021-05-11 19:48:21','allo',0),(12,2,'2021-05-11 19:51:31','Salut salut',0);
/*!40000 ALTER TABLE `publication` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publication_hashtag`
--

DROP TABLE IF EXISTS `publication_hashtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publication_hashtag` (
  `publication_id` int NOT NULL,
  `hashtag` varchar(64) NOT NULL,
  PRIMARY KEY (`publication_id`,`hashtag`),
  CONSTRAINT `publication_hashtag_ibfk_1` FOREIGN KEY (`publication_id`) REFERENCES `publication` (`publication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publication_hashtag`
--

LOCK TABLES `publication_hashtag` WRITE;
/*!40000 ALTER TABLE `publication_hashtag` DISABLE KEYS */;
INSERT INTO `publication_hashtag` VALUES (1,'nouveau');
/*!40000 ALTER TABLE `publication_hashtag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publication_mention`
--

DROP TABLE IF EXISTS `publication_mention`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publication_mention` (
  `publication_id` int NOT NULL,
  `user_mentionned` varchar(32) NOT NULL,
  PRIMARY KEY (`publication_id`,`user_mentionned`),
  CONSTRAINT `publication_mention_ibfk_1` FOREIGN KEY (`publication_id`) REFERENCES `publication` (`publication_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publication_mention`
--

LOCK TABLES `publication_mention` WRITE;
/*!40000 ALTER TABLE `publication_mention` DISABLE KEYS */;
INSERT INTO `publication_mention` VALUES (1,'everyone'),(2,'nicolas'),(4,'everyone'),(5,'everyone'),(6,'everyone'),(7,'everyone'),(8,'everyone'),(9,'nicolas');
/*!40000 ALTER TABLE `publication_mention` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publication_reaction`
--

DROP TABLE IF EXISTS `publication_reaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `publication_reaction` (
  `publication_id` int NOT NULL,
  `reactor_id` int NOT NULL,
  `liked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`publication_id`,`reactor_id`),
  KEY `reactor_id` (`reactor_id`),
  CONSTRAINT `publication_reaction_ibfk_1` FOREIGN KEY (`publication_id`) REFERENCES `publication` (`publication_id`),
  CONSTRAINT `publication_reaction_ibfk_2` FOREIGN KEY (`reactor_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publication_reaction`
--

LOCK TABLES `publication_reaction` WRITE;
/*!40000 ALTER TABLE `publication_reaction` DISABLE KEYS */;
INSERT INTO `publication_reaction` VALUES (2,1,1),(2,3,1),(4,2,1),(7,1,1),(8,1,1);
/*!40000 ALTER TABLE `publication_reaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `picture` varchar(25) DEFAULT 'default.jpg',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'nicolas','nicolassangsiri@gmail.com','deb97a759ee7b8ba42e02dddf2b412fe','nicolas'),(2,'client','client@gmail.com','62608e08adc29a8d6dbc9754e659f125','default.jpg'),(3,'client2','client2@yahoo.fr','2c66045d4e4a90814ce9280272e510ec','default.jpg');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_subscription`
--

DROP TABLE IF EXISTS `user_subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_subscription` (
  `user_id` int NOT NULL,
  `subscribe_to` int NOT NULL,
  PRIMARY KEY (`user_id`,`subscribe_to`),
  KEY `subscribe_to` (`subscribe_to`),
  CONSTRAINT `user_subscription_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `user_subscription_ibfk_2` FOREIGN KEY (`subscribe_to`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_subscription`
--

LOCK TABLES `user_subscription` WRITE;
/*!40000 ALTER TABLE `user_subscription` DISABLE KEYS */;
INSERT INTO `user_subscription` VALUES (2,1),(3,1),(1,2),(3,2);
/*!40000 ALTER TABLE `user_subscription` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-22 19:10:43
