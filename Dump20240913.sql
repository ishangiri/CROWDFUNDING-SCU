-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: crowdfunding_db
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.24.04.1

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
-- Table structure for table `CATEGORY`
--

DROP TABLE IF EXISTS `CATEGORY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CATEGORY` (
  `CATEGORY_ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CATEGORY`
--

LOCK TABLES `CATEGORY` WRITE;
/*!40000 ALTER TABLE `CATEGORY` DISABLE KEYS */;
INSERT INTO `CATEGORY` VALUES (1,'Medical'),(2,'Education'),(3,'Social Impact'),(4,'Natural Disaster'),(5,'WAR CRISIS');
/*!40000 ALTER TABLE `CATEGORY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FUNDRAISER`
--

DROP TABLE IF EXISTS `FUNDRAISER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FUNDRAISER` (
  `FUNDRAISER_ID` int NOT NULL AUTO_INCREMENT,
  `ORGANIZER` varchar(100) NOT NULL,
  `CAPTION` varchar(255) NOT NULL,
  `TARGET_FUNDING` decimal(10,2) NOT NULL,
  `CURRENT_FUNDING` decimal(10,2) NOT NULL DEFAULT '0.00',
  `CITY` varchar(100) NOT NULL,
  `ACTIVE` tinyint(1) NOT NULL DEFAULT '1',
  `CATEGORY_ID` int DEFAULT NULL,
  PRIMARY KEY (`FUNDRAISER_ID`),
  KEY `CATEGORY_ID` (`CATEGORY_ID`),
  CONSTRAINT `FUNDRAISER_ibfk_1` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `CATEGORY` (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FUNDRAISER`
--

LOCK TABLES `FUNDRAISER` WRITE;
/*!40000 ALTER TABLE `FUNDRAISER` DISABLE KEYS */;
INSERT INTO `FUNDRAISER` VALUES (1,'Steve Smith','Help the Smith\'s rebuild their life after a flood disaster.',100000.00,11000.40,'Byron Bay',1,4),(2,'Jessica','PLease help Jessica fight her Cancer',85000.00,35000.00,'Sydney',1,1),(3,'Local School Burleigh','New Computers for Underprivileged Students',15000.00,5000.00,'Gold Coast',1,2),(4,'Homeless Shelter','Winter Clothes for the Homeless',5000.00,2500.00,'Perth',1,3),(5,'Homeless Childrens','Please Help the homeless children in palestine',150000.00,100000.00,'GAZA',1,5),(6,'Andrew Bing','Please help Andrew recover from his bike accident',18000.00,0.00,'Gold Coast',0,1);
/*!40000 ALTER TABLE `FUNDRAISER` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-13 11:13:45
