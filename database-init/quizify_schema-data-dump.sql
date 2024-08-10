/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.18-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: quizify
-- ------------------------------------------------------
-- Server version	10.6.18-MariaDB-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `account_created` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'The time when the account was created',
  `first_name` varchar(255) NOT NULL COMMENT 'First Name of the user',
  `last_name` varchar(255) DEFAULT NULL COMMENT 'Optional Last Name of the user',
  `email` text NOT NULL COMMENT 'Email address of the user. Must be unique',
  `username` varchar(50) NOT NULL COMMENT 'Unique Username for each user identification',
  `password` text NOT NULL COMMENT 'A hashed password of the user',
  `quiz_attended` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT 'Count of how many quiz they attended',
  `quiz_created` bigint(20) unsigned NOT NULL DEFAULT 0 COMMENT 'Count of how many quiz they have created',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_unique` (`username`),
  UNIQUE KEY `users_email_unique` (`email`) USING HASH,
  KEY `users_email_index` (`email`(768))
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (13,'2024-06-22 06:35:12','Sai','Vishnu','saivishnu725@gmail.com','saivishnu725','$2b$10$N5wS4Zfyjne8.QDeYWzneezdQI2wElkDjjRIGb0im8GZSH14USyh6',0,2),(14,'2024-06-29 09:48:24','SAii','ggverg','sai@g.com','dss','$2b$10$gHrv9eS1i2MUX6nGr7KsgOM7yOrEcnoyDvhdYA99PPweF.JlAmQcC',0,0),(15,'2024-08-04 07:50:24','Hello','World','sai725@gmail.com','sai725@gmail.com','$2b$10$xgRyx.s3tVQ5gNWboKt.ceX7sNf1bhFcMpPZwK9kSt6FnHnfLRQRW',0,0),(16,'2024-08-07 12:46:50','Saiis','afasf','saivishnu725@gmail.c','saivishnu725@gmail.c','$2b$10$kQk8p4.XVHQZnQF1VgZ.LOLPsv5ayVywsSsVoAY2b6T48jj.4fPJ6',0,2);
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_sessions`
--

DROP TABLE IF EXISTS `quiz_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_sessions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint(20) NOT NULL,
  `session_code` bigint(20) NOT NULL,
  `host_id` bigint(20) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `quiz_sessions_session_code_unique` (`session_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_sessions`
--

LOCK TABLES `quiz_sessions` WRITE;
/*!40000 ALTER TABLE `quiz_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quizzes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `creator_id` bigint(20) NOT NULL COMMENT 'User ID of who created the quiz',
  `creation_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `maxTime` int(11) NOT NULL,
  `score` float NOT NULL,
  `negativeScore` float NOT NULL,
  `quizTag` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (1,'123456','123434',13,'2024-08-04 11:36:58','2024-08-04 11:36:58',120,1,-0.25,'13123456'),(2,'2','1234567890',13,'2024-08-07 12:16:16','2024-08-07 12:16:16',120,1,-0.25,'132'),(3,'21e421e','e21e12',13,'2024-08-07 12:54:20','2024-08-07 12:54:20',123,1,-0.25,'1321e421e'),(4,'1234564325412fcsafs','12312',16,'2024-08-08 07:54:33','2024-08-08 07:54:33',20,1,-0.25,'161234564325412fcsafs'),(5,'ascfasc','fvasv',13,'2024-08-08 11:33:34','2024-08-08 11:33:34',100,1,-0.1,'13ascfasc'),(6,'1232132112','21312312',13,'2024-08-08 11:34:52','2024-08-08 11:34:52',123,1,-0.25,'131232132112'),(7,'1232132112','21312312',13,'2024-08-08 11:36:17','2024-08-08 11:36:17',123,1,-0.25,'131232132112'),(8,'1232132112','21312312',13,'2024-08-08 11:39:13','2024-08-08 11:39:13',123,1,-0.25,'131232132112'),(9,'new','new descp',16,'2024-08-09 11:59:05','2024-08-09 11:59:05',12,1,-1.02,'16new');
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_quizzes`
--

DROP TABLE IF EXISTS `user_quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_quizzes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `quiz_at` bigint(20) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `quiz_tag` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_quizzes`
--

LOCK TABLES `user_quizzes` WRITE;
/*!40000 ALTER TABLE `user_quizzes` DISABLE KEYS */;
INSERT INTO `user_quizzes` VALUES (1,15,1,'2024-08-06 15:03:14','13123456'),(2,16,1,'2024-08-09 16:24:25','13123456'),(3,13,4,'2024-08-10 07:13:26','161234564325412fcsafs'),(4,16,3,'2024-08-09 17:04:16','1321e421e'),(5,13,9,'2024-08-10 06:28:18','16new');
/*!40000 ALTER TABLE `user_quizzes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-10 15:33:07
