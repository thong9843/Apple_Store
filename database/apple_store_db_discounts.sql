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
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `discount_code` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_type` enum('PERCENTAGE','FIXED') NOT NULL,
  `discount_value` decimal(38,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `min_order_value` decimal(38,2) DEFAULT NULL,
  `max_discount_amount` decimal(38,2) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `discount_scope` enum('ORDER','PRODUCT') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discount_code` (`discount_code`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
INSERT INTO `discounts` VALUES (2,'TESTORD','TEST','FIXED',150.00,'2024-01-01','2025-11-10',400.00,150.00,60,'2024-10-23 09:50:12','2024-11-12 07:31:48','ORDER'),(12,'FALL20245','FALL Sale 2024','PERCENTAGE',20.00,'2024-06-01','2024-08-31',100.00,50.00,1000,'2024-10-23 10:20:33','2024-11-15 14:07:01','PRODUCT'),(26,'ts','ts','PERCENTAGE',25.00,'2024-11-12','2024-11-30',NULL,NULL,123,'2024-11-12 07:54:48','2024-11-12 08:05:23','PRODUCT'),(30,'123','123','PERCENTAGE',12.00,'2024-11-12','2024-11-30',NULL,NULL,1233,'2024-11-12 08:05:48','2024-11-12 08:06:27','PRODUCT'),(31,'23','23','FIXED',23.00,'2024-11-12','2024-11-30',15.00,55.00,123,'2024-11-12 08:06:16','2024-11-12 08:06:22','ORDER'),(33,'1234','1234','FIXED',123.00,'2024-11-15','2024-11-16',123.00,123.00,123,'2024-11-15 14:06:27','2024-11-15 14:06:27','ORDER');
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-22 16:44:04
