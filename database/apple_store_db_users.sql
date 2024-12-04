-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: apple_store_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_verify` tinyint(1) DEFAULT 0,
  `reset_password_code` varchar(255) DEFAULT NULL,
  `reset_password_code_expire_at` datetime(6) DEFAULT NULL,
  `verification_code` varchar(255) DEFAULT NULL,
  `verification_code_expire_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admina','nguyenvana_new@example.com','$2a$10$hHjUM27il2WVeyIXPLfJwOoBSJDQ4sy5mgXLjCeACM7wuNZRyQgX2','0987654321','456 Đường XYZ, Quận ABC, TP. HCM','admin','2024-10-20 15:12:56','2024-10-20 15:12:56',0,NULL,NULL,NULL,NULL),(13,'Laravel','ccc@ccc.com','$2y$12$x9To7mNJsVJqkCtWphvHuu3PEVIIcaWHspHRycI5gPW7Wg94BfKqS','ccc','ccc','customer','2024-10-24 16:02:53','2024-10-24 16:02:53',0,NULL,NULL,NULL,NULL),(15,'Spring Boot','c@ccc.com','$2a$10$Y/wj7oN1m/09Pgn9688XPuPFwgsJc27t5lJrDeg2.hRNmDpETG982','ccc','ccc','customer','2024-10-24 23:03:10','2024-10-24 16:23:38',0,NULL,NULL,NULL,NULL),(19,'tabbyneko','tabbyneko@t.c','$2a$10$Z4RMuTnTwMyyjYQUDp9kTuVcmA0X4KALE6AOaARnqc2XE31cEGGzG','0766933787','gv','customer','2024-10-26 10:11:09','2024-10-26 10:11:09',0,NULL,NULL,NULL,NULL),(20,'ad','ad@ad.ad','$2a$10$JwD53ZLZJ4NNKLyh.Rbiou4Q/Gdaa7Q7uvY5w0NBNXhdWcuubbyfq',NULL,NULL,'customer','2024-10-27 16:00:57','2024-10-27 16:00:57',0,NULL,NULL,NULL,NULL),(26,'Thanh','tnbluw1892@gmail.com','$2a$10$BGYWL.c/z2tpe6KuSi1rK.UTORXPza5rD4wWwlfrtFAsrAmHRSA3G','123','123','customer','2024-10-29 08:45:50','2024-10-29 08:45:50',1,'483171','2024-10-29 16:02:19.000000',NULL,NULL),(27,'Name Lon','chitam1401@gmail.com','$2a$10$2sYYdQ3mafL2Kzbk6fAVJuwrhYy7kImBPac5RaJ4q508ryQfNk2t.','','','admin','2024-11-08 09:29:58','2024-11-10 10:11:02',0,NULL,NULL,NULL,NULL),(55,'tam','khongthichchamco@gmail.com','$2a$10$7zqlXZy0jGif1bHknnTXpeQi2eRfkoZToWQYpQBH7AwNcp3HRdSWO',NULL,NULL,'customer','2024-11-13 18:31:19','2024-11-13 18:31:19',1,NULL,NULL,NULL,NULL),(56,'Tabby Neko','tam.ha.cm.ag@gmail.com','$2a$10$xppBPo6aKF4rDL/9P0peeekV3/lqMq/xHVerDxwm8gqzT07CvedZO','0766933787','1234','admin','2024-11-13 21:30:19','2024-11-13 21:33:39',1,NULL,NULL,NULL,NULL),(57,'Thong','tabbynekokawaii@gmail.com','$2a$10$Cldj/uuD53otPdWKeMg9rO9f3biWGBIqJ1xUEweiabpa96riTFTzC',NULL,NULL,'customer','2024-11-22 02:11:48','2024-11-22 02:11:48',1,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-22 16:44:05
