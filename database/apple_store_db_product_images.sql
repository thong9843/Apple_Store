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
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) NOT NULL,
  `variant_id` bigint(20) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_images_ibfk_2` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,14,'/contents/image/product/16.jpeg','2024-10-25 09:48:59','2024-10-26 09:04:36'),(2,1,15,'/contents/image/product/16.jpeg','2024-10-25 09:48:59','2024-10-26 09:04:36'),(3,1,16,'/contents/image/product/16.jpeg','2024-10-25 09:48:59','2024-10-26 09:04:36'),(28,1,17,'/contents/image/product/16.jpeg','2024-10-26 20:58:13','2024-11-08 17:19:51'),(37,67,23,'/contents/image/product/44737861-0cda-431f-bfb3-ee0e7f2e1f94_sac.jpg','2024-11-09 20:00:22','2024-11-09 20:00:22'),(39,67,25,'/contents/image/product/deb73193-b64a-423d-840b-c8f44784dd79_08b.gif','2024-11-10 02:22:34','2024-11-10 02:22:34'),(40,69,26,'/contents/image/product/2e1fcd7c-5277-4821-9cf7-0de1d566716d_8_925d9dfd2f28436ba83ad973d018ef81_master.webp','2024-11-10 16:16:07','2024-11-10 16:16:07'),(41,69,27,'/contents/image/product/b771b51d-6202-4b3e-889d-17d9e8be5a37_ck18403923-dien-thoai-iphone-16-pro-black-titanium-(3).jpg','2024-11-10 16:16:39','2024-11-10 16:16:39'),(42,2,16,'/contents/image/product/8aaa8950-565d-4e64-9490-df78bf35585b_16pl.jpeg','2024-11-11 04:59:32','2024-11-11 04:59:32'),(43,70,28,'/contents/image/product/66bae3c3-c87d-4fc2-84e5-c4b8d9663d8c_iPhone-16-Pro-Max-12.webp','2024-11-11 05:02:54','2024-11-11 05:02:54'),(44,70,29,'/contents/image/product/d65c5514-81bd-44b1-9560-1e8c6f483625_400291111.jpeg','2024-11-11 05:03:43','2024-11-11 05:03:43'),(45,71,30,'/contents/image/product/98d562b2-1a76-4f3d-b37d-856f67fa5f21_ipM4.jpeg','2024-11-11 05:05:33','2024-11-11 05:05:33'),(46,72,31,'/contents/image/product/c3616058-4ead-4252-a4bb-a14747dc2f20_ipAirM2.png','2024-11-11 05:07:35','2024-11-11 05:07:35'),(47,73,32,'/contents/image/product/2a264c59-af19-419e-b9c0-559c8414c7c4_macproM1.jpeg','2024-11-11 05:09:18','2024-11-11 05:09:18'),(48,74,33,'/contents/image/product/0533e62a-5f53-428e-920d-bfda986b316e_imacM1.webp','2024-11-11 05:10:37','2024-11-11 05:10:37'),(49,75,34,'/contents/image/product/ce7b84fa-e7a4-4b9f-903a-02377af93fc1_images.jpg','2024-11-11 05:11:51','2024-11-11 05:11:51'),(51,77,NULL,'/contents/image/product/9307d912-7691-4555-be48-1fadcd6c2cf8_sac.jpg','2024-11-12 09:15:30','2024-11-12 09:15:30');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
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
