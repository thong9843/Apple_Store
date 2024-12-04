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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `specification` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'IPhone 16','/contents/descriptions/iphone_16_description.html','/contents/specifications/iphone_16_specifications.xml',799.00,1,'2024-10-18 11:41:25','2024-10-25 09:47:31'),(2,'IPhone 16 Plus','/contents/descriptions/3abbd7f0-657f-4e5c-acdf-0dc0f6573701_iphone_16pl_description.html','/contents/specifications/f1d281b0-2562-477f-b60b-061a02675bd5_iphone_16pl_specifications.xml',1099.00,1,'2024-10-18 11:42:00','2024-10-25 09:47:31'),(67,'Charger','/contents/descriptions/393936ae-ea7e-4015-8ef0-f5e9b4125b70_Charger123.html','/contents/specifications/43922f82-2403-4f00-8ea0-e004277fc407_Charger_specifications123.xml',16.00,5,'2024-11-09 20:00:01','2024-11-09 20:00:01'),(69,'IPhone 16 Pro','/contents/descriptions/ee460124-ac5c-4240-8d55-44fc879fdb93_iphone_16pr_description.html','/contents/specifications/0f7a841d-9cfe-41a8-80a1-a07848c94710_iphone_16pro_specifications.xml',1299.00,1,'2024-11-10 16:14:18','2024-11-10 16:14:18'),(70,'IPhone 16 Pro Max','/contents/descriptions/46408b65-3c83-4f4d-af21-6f3cf0c3bf54_iphone_16prm_description.html','/contents/specifications/4a410cce-2182-4696-a0ff-3f7b6e33081a_iphone_16promax_specifications.xml',1599.00,1,'2024-11-11 05:01:10','2024-11-11 05:01:10'),(71,'IPad M4','/contents/descriptions/50ee6ec9-586c-436d-9d69-27c2fac89bf4_ipad_AirM4_description.html','/contents/specifications/6d0fba49-8f71-4260-b41b-b0f582b4aaed_Ipad_M4_specifications.xml',699.00,2,'2024-11-11 05:05:02','2024-11-11 05:05:02'),(72,'IPad Air M2','/contents/descriptions/a1a644ce-d997-422a-9501-9060d499d349_ipad_AirM2_description.html','/contents/specifications/7a7784a4-c83f-45da-9ea7-3de1645ff009_IpadPro_M2_specifications.xml',599.00,2,'2024-11-11 05:06:59','2024-11-11 05:06:59'),(73,'Macbook Air M1','/contents/descriptions/b852340f-fd6a-4623-bb4d-e27a6fa0ec59_MacBook_AirM1_description.html','/contents/specifications/1c3d12b1-75b3-4e33-8038-86c9106740e5_MacAir_M1_specifications.xml',1099.00,3,'2024-11-11 05:08:38','2024-11-11 05:08:38'),(74,'Mac Pro','/contents/descriptions/c80f18ed-ca94-4d57-814e-5d1ef58af054_MacBook_ProM1_description.html','/contents/specifications/9085a997-20e2-467a-8208-7a334910b7c3_MacPro_M1_specifications.xml',1299.00,3,'2024-11-11 05:10:12','2024-11-11 05:10:12'),(75,'Watch','/contents/descriptions/5197e53f-8ea2-4f58-b8ff-4f7617699490_iphone_16prm_description.html',NULL,699.00,4,'2024-11-11 05:11:19','2024-11-11 05:11:19'),(77,'Test Product','/contents/descriptions/bb07ce2d-f39c-42bf-ba36-c94686be6c0f_Charger123.html','/contents/specifications/7abb2f33-e125-4b12-ba04-4353651024e8_Charger_specifications123.xml',599.00,5,'2024-11-12 09:15:05','2024-11-12 09:15:05'),(78,'Anoter',NULL,NULL,156.00,5,'2024-11-12 09:20:08','2024-11-12 09:20:08'),(79,'123','/contents/descriptions/bcda7f0d-350d-4ffc-bb7a-991152485f30_Charger123.html','/contents/specifications/e7e886ea-1b19-447d-8a0b-a8971542c9f4_Charger_specifications123.xml',1231.00,5,'2024-11-13 21:40:20','2024-11-13 21:40:20');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-22 16:44:06
