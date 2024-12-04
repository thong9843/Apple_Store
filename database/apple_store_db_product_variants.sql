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
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `variant_name` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
INSERT INTO `product_variants` VALUES (14,1,'Black - 256GB',899.00,44,1,'2024-10-26 09:03:24','2024-11-22 09:40:26'),(15,1,'Pink - 512GB',999.00,47,1,'2024-10-26 09:03:24','2024-11-22 09:39:55'),(16,2,'Gold - 1TB',1099.00,49,1,'2024-10-26 09:03:24','2024-10-27 05:49:24'),(17,1,'Blue - 128GB',799.00,49,1,'2024-10-26 20:27:13','2024-11-22 09:39:55'),(23,67,'25W',16.00,1000,1,'2024-11-09 20:00:22','2024-11-09 20:00:22'),(25,67,'Bocchi',13.00,14,1,'2024-11-10 02:22:33','2024-11-10 02:22:33'),(26,69,'White - 256GB',1299.00,1000,1,'2024-11-10 16:16:07','2024-11-10 16:16:07'),(27,69,'Black - 512GB',1399.00,1000,1,'2024-11-10 16:16:39','2024-11-10 16:16:39'),(28,70,'Gold - 1TB',1999.00,1000,1,'2024-11-11 05:02:54','2024-11-11 05:02:54'),(29,70,'White - 512GB',1599.00,1000,1,'2024-11-11 05:03:43','2024-11-11 05:03:43'),(30,71,'White - 256GB',699.00,1000,1,'2024-11-11 05:05:33','2024-11-11 05:05:33'),(31,72,'Lmao',599.00,1000,1,'2024-11-11 05:07:35','2024-11-11 05:07:35'),(32,73,'128GB',1099.00,1000,1,'2024-11-11 05:09:18','2024-11-11 05:09:18'),(33,74,'White - 256GB',1299.00,1000,1,'2024-11-11 05:10:37','2024-11-11 05:10:37'),(34,75,'Watch',699.00,1000,1,'2024-11-11 05:11:51','2024-11-11 05:11:51');
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
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
