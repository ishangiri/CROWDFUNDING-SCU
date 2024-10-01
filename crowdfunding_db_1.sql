CREATE DATABASE `crowdfunding_db`;
USE `crowdfunding_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: crowdfunding_db
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.24.04.1


DROP TABLE IF EXISTS `CATEGORY`;
CREATE TABLE `CATEGORY` (
  `CATEGORY_ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`CATEGORY_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Dumping data for table `CATEGORY`
--

LOCK TABLES `CATEGORY` WRITE;
/*!40000 ALTER TABLE `CATEGORY` DISABLE KEYS */;
INSERT INTO `CATEGORY` VALUES (1,'Medical'),(2,'Education'),(3,'Social Impact'),(4,'Natural Disaster'),(5,'WAR CRISIS');
/*!40000 ALTER TABLE `CATEGORY` ENABLE KEYS */;
UNLOCK TABLES;


DROP TABLE IF EXISTS `DONATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DONATION` (
  `DONATION_ID` int NOT NULL AUTO_INCREMENT,
  `DATE` datetime NOT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `GIVER` varchar(255) NOT NULL,
  `FUNDRAISER_ID` int DEFAULT NULL,
  PRIMARY KEY (`DONATION_ID`),
  KEY `FUNDRAISER_ID` (`FUNDRAISER_ID`),
  CONSTRAINT `DONATION_ibfk_1` FOREIGN KEY (`FUNDRAISER_ID`) REFERENCES `FUNDRAISER` (`FUNDRAISER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



LOCK TABLES `DONATION` WRITE;
/*!40000 ALTER TABLE `DONATION` DISABLE KEYS */;
INSERT INTO `DONATION` VALUES (1,'2024-09-20 12:30:00',100.00,'John Doe',1),(2,'2024-09-21 14:15:00',200.00,'Jane Smith',2),(3,'2024-09-22 09:00:00',50.00,'Michael Johnson',3),(4,'2024-09-22 10:45:00',150.00,'Emily Brown',4),(5,'2024-09-23 16:30:00',75.00,'Chris Green',5),(6,'2024-09-23 18:00:00',300.00,'Anna White',6),(7,'2024-09-24 08:20:00',120.00,'David Black',7),(8,'2024-09-24 11:50:00',90.00,'Laura Wilson',8),(9,'2024-09-25 15:05:00',250.00,'Robert Harris',9),(10,'2024-09-25 17:30:00',175.00,'Sophia Davis',10);
/*!40000 ALTER TABLE `DONATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FUNDRAISER`
--

DROP TABLE IF EXISTS `FUNDRAISER`;
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FUNDRAISER`
--

LOCK TABLES `FUNDRAISER` WRITE;
/*!40000 ALTER TABLE `FUNDRAISER` DISABLE KEYS */;
INSERT INTO `FUNDRAISER` VALUES (1,'Steve Smith','Help the Smith\'s rebuild their life after a flood disaster.',100000.00,11000.40,'Byron Bay',1,4),(2,'Jessica Davis','Support Jessica\'s fight against Cancer',85000.00,35000.00,'Sydney',1,1),(3,'Local School Burleigh','Fund new Computers for Underprivileged Students',15000.00,5000.00,'Gold Coast',1,2),(4,'Homeless Shelter','Winter Clothing Drive for the Homeless',5000.00,2500.00,'Perth',1,3),(5,'Palestinian Children Fund','Help Homeless Children in War-Torn Palestine',150000.00,100000.00,'GAZA',1,5),(6,'Andrew Bing','Support Andrew\'s Recovery from a Serious Bike Accident',18000.00,500.00,'Gold Coast',0,1),(7,'Green Village Fund','Raise Funds to Rebuild a Village Hit by a Natural Disaster',120000.00,9000.00,'Brisbane',1,4),(8,'Anna Miller','Help Anna Undergo a Lifesaving Surgery',200000.00,70000.00,'Melbourne',1,1),(9,'Education for All','Sponsor Education for Underprivileged Children',25000.00,13000.00,'Adelaide',1,2),(10,'Operation Warmth','Provide Blankets for Homeless Families in the Winter',8000.00,5500.00,'Canberra',1,3);
/*!40000 ALTER TABLE `FUNDRAISER` ENABLE KEYS */;
UNLOCK TABLES;


