-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: toystore
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `carts_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,NULL,2,1,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(2,3,NULL,19,1,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(3,5,NULL,20,2,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(4,NULL,'session_abc123',11,1,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(5,NULL,'session_abc123',17,1,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(6,7,NULL,5,1,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(7,9,NULL,7,1,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(8,NULL,'session_def456',3,2,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(9,NULL,'session_def456',12,1,'2026-06-22 09:12:59','2026-06-22 09:12:59'),(10,10,NULL,1,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `parent_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Электроника','Все виды электроники и гаджетов',NULL,NULL,1),(2,'Смартфоны и телефоны','Мобильные телефоны и аксессуары',1,NULL,1),(3,'Ноутбуки и компьютеры','Ноутбуки, ПК и комплектующие',1,NULL,2),(4,'Одежда и обувь','Мужская и женская одежда',NULL,NULL,2),(5,'Мужская одежда','Куртки, футболки, джинсы',4,NULL,1),(6,'Женская одежда','Платья, юбки, блузки',4,NULL,2),(7,'Дом и уют','Товары для дома',NULL,NULL,3),(8,'Кухонная утварь','Посуда, приборы, техника для кухни',7,NULL,1),(9,'Декор','Картины, вазы, свечи',7,NULL,2);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `daily_sales_summary`
--

DROP TABLE IF EXISTS `daily_sales_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `daily_sales_summary` (
  `report_date` date NOT NULL,
  `total_orders` int NOT NULL,
  `total_revenue` decimal(10,2) NOT NULL,
  `avg_order_value` decimal(10,2) NOT NULL,
  `unique_users` int NOT NULL,
  PRIMARY KEY (`report_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daily_sales_summary`
--

LOCK TABLES `daily_sales_summary` WRITE;
/*!40000 ALTER TABLE `daily_sales_summary` DISABLE KEYS */;
INSERT INTO `daily_sales_summary` VALUES ('2026-06-22',15,755500.00,50366.67,10),('2026-07-20',3,55500.00,18500.00,3),('2026-07-21',4,81900.00,20475.00,4),('2026-07-22',4,151300.00,37825.00,4),('2026-07-23',4,82700.00,20675.00,4);
/*!40000 ALTER TABLE `daily_sales_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total` decimal(10,2) GENERATED ALWAYS AS ((`quantity` * `price`)) STORED,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `order_items_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (1,1,1,1,120000.00),(2,1,19,1,30000.00),(3,1,20,1,28000.00),(4,2,8,1,5000.00),(5,3,3,1,35000.00),(6,5,4,1,250000.00),(7,6,15,1,6000.00),(8,6,18,2,2500.00),(9,7,10,1,25000.00),(10,7,12,1,7000.00),(11,8,11,1,8000.00),(12,9,19,1,30000.00),(13,10,2,1,110000.00),(14,12,20,1,28000.00),(15,13,13,1,12000.00),(16,14,6,1,150000.00),(17,14,9,2,1500.00),(18,15,16,1,5500.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_statuses`
--

DROP TABLE IF EXISTS `order_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_statuses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_statuses`
--

LOCK TABLES `order_statuses` WRITE;
/*!40000 ALTER TABLE `order_statuses` DISABLE KEYS */;
INSERT INTO `order_statuses` VALUES (1,'new','Заказ создан'),(2,'unpaid','Ожидает оплаты'),(3,'processing','В обработке'),(4,'shipped','В доставке'),(5,'delivered','Доставлен'),(6,'cancelled','Заказ отменен');
/*!40000 ALTER TABLE `order_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status_id` int NOT NULL,
  `payment_method_id` int NOT NULL,
  `delivery_address` text NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `comment` text,
  `total_amount` decimal(10,2) NOT NULL,
  `is_paid` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `status_id` (`status_id`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`status_id`) REFERENCES `order_statuses` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2026-06-22 09:12:15',2,1,'г. Москва, ул. Тверская, д. 5, кв. 12','2026-06-25','Позвонить за час',155000.00,1),(2,2,'2026-06-22 09:12:15',4,2,'г. Санкт-Петербург, Невский пр., д. 10, кв. 5','2026-06-20',NULL,5000.00,1),(3,3,'2026-06-22 09:12:15',1,3,'г. Казань, ул. Баумана, д. 3, кв. 8','2026-06-28','Срочно!',35000.00,0),(4,4,'2026-06-22 09:12:15',6,1,'г. Новосибирск, Красный пр., д. 15, кв. 20',NULL,'Отменить заказ',0.00,0),(5,5,'2026-06-22 09:12:15',3,2,'г. Екатеринбург, ул. Ленина, д. 7, кв. 3','2026-06-22',NULL,180000.00,1),(6,1,'2026-06-22 09:12:15',4,1,'г. Москва, ул. Тверская, д. 5, кв. 12','2026-06-18','Оставить у двери',12000.00,1),(7,6,'2026-06-22 09:12:15',2,3,'г. Краснодар, ул. Красная, д. 20, кв. 15','2026-06-27',NULL,25000.00,1),(8,7,'2026-06-22 09:12:15',1,1,'г. Воронеж, ул. Плехановская, д. 8, кв. 7','2026-06-30',NULL,8000.00,0),(9,8,'2026-06-22 09:12:15',3,2,'г. Ростов-на-Дону, ул. Большая Садовая, д. 12, кв. 9','2026-06-24',NULL,30000.00,1),(10,9,'2026-06-22 09:12:15',4,1,'г. Нижний Новгород, ул. Большая Покровская, д. 5, кв. 2','2026-06-19',NULL,110000.00,1),(11,2,'2026-06-22 09:12:15',6,3,'г. Санкт-Петербург, Невский пр., д. 10, кв. 5',NULL,'Передумал',0.00,0),(12,10,'2026-06-22 09:12:15',2,1,'г. Челябинск, ул. Кирова, д. 15, кв. 10','2026-06-26',NULL,28000.00,1),(13,3,'2026-06-22 09:12:15',3,2,'г. Казань, ул. Баумана, д. 3, кв. 8','2026-06-23',NULL,12000.00,1),(14,5,'2026-06-22 09:12:15',4,1,'г. Екатеринбург, ул. Ленина, д. 7, кв. 3','2026-06-21',NULL,150000.00,1),(15,7,'2026-06-22 09:12:15',1,2,'г. Воронеж, ул. Плехановская, д. 8, кв. 7','2026-06-29',NULL,5500.00,0),(46,1,'2026-07-20 07:15:00',2,1,'г. Москва, ул. Арбат, д. 15, кв. 8','2026-07-22','Позвонить заранее',32000.00,1),(47,2,'2026-07-20 11:30:00',4,2,'г. Санкт-Петербург, Невский пр., д. 25, кв. 12','2026-07-21',NULL,5500.00,1),(48,18,'2026-07-20 16:00:00',1,3,'г. Казань, ул. Баумана, д. 10, кв. 3','2026-07-24','Оставить у двери',18000.00,0),(49,3,'2026-07-21 06:30:00',3,1,'г. Новосибирск, Красный пр., д. 5, кв. 20','2026-07-23',NULL,45000.00,1),(50,12,'2026-07-21 09:10:00',2,2,'г. Екатеринбург, ул. Ленина, д. 12, кв. 7','2026-07-22','Срочно!',8700.00,1),(51,13,'2026-07-21 13:20:00',1,1,'г. Краснодар, ул. Красная, д. 30, кв. 5','2026-07-25',NULL,25000.00,0),(52,4,'2026-07-21 17:00:00',4,3,'г. Воронеж, ул. Плехановская, д. 2, кв. 9','2026-07-22',NULL,3200.00,1),(53,5,'2026-07-22 05:45:00',2,1,'г. Ростов-на-Дону, ул. Большая Садовая, д. 8, кв. 1','2026-07-24',NULL,120000.00,1),(54,14,'2026-07-22 08:30:00',3,2,'г. Нижний Новгород, ул. Большая Покровская, д. 3, кв. 10','2026-07-23','Передать в офис',15000.00,1),(55,15,'2026-07-22 12:00:00',1,1,'г. Челябинск, ул. Кирова, д. 10, кв. 4','2026-07-26',NULL,6800.00,0),(56,17,'2026-07-22 15:30:00',2,3,'г. Москва, ул. Арбат, д. 15, кв. 8','2026-07-24','Повторный заказ',9500.00,1),(57,6,'2026-07-23 06:00:00',4,1,'г. Казань, ул. Баумана, д. 10, кв. 3','2026-07-24',NULL,28000.00,1),(58,12,'2026-07-23 10:15:00',2,2,'г. Санкт-Петербург, Невский пр., д. 25, кв. 12','2026-07-25',NULL,4200.00,1),(59,7,'2026-07-23 14:40:00',1,1,'г. Екатеринбург, ул. Ленина, д. 12, кв. 7','2026-07-27','Домофон не работает',33000.00,0),(60,2,'2026-07-23 18:30:00',3,2,'г. Новосибирск, Красный пр., д. 5, кв. 20','2026-07-24',NULL,17500.00,1);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_methods`
--

DROP TABLE IF EXISTS `payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'card','Банковская карта'),(2,'cash','Наличные при получении'),(3,'sbp','Через систему быстрых платежей'),(4,'online','Электронные кошельки'),(5,'installment','Долями/частями');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT '0',
  `category_id` int DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 15 Pro Max','Флагманский смартфон Apple с титановым корпусом',120000.00,129999.00,15,2,'Apple','IP15PM-001',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(2,'Samsung Galaxy S24 Ultra','Мощный Android-смартфон с S Pen',110000.00,119999.00,8,2,'Samsung','SGS24U-002',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(3,'Xiaomi Redmi Note 13 Pro','Бюджетный смартфон с отличной камерой',35000.00,39999.00,25,2,'Xiaomi','XRN13P-003',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(4,'MacBook Pro 16\" M3','Профессиональный ноутбук Apple',250000.00,NULL,5,3,'Apple','MBP16-004',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(5,'Lenovo ThinkPad X1 Carbon','Легкий бизнес-ноутбук',180000.00,195000.00,7,3,'Lenovo','TPX1C-005',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(6,'ASUS ROG Zephyrus G14','Игровой ноутбук с RTX 4060',150000.00,165000.00,3,3,'ASUS','ROGZ14-006',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(7,'Куртка кожаная мужская','Натуральная кожа, черная',15000.00,18000.00,20,5,'Biker','JK-007',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(8,'Джинсы классические','Синие джинсы прямого кроя',5000.00,6500.00,35,5,'Levi\'s','JEANS-008',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(9,'Футболка хлопковая','Белая футболка 100% хлопок',1500.00,2000.00,50,5,'Fruit of Loom','TEE-009',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(10,'Платье вечернее','Длинное платье в пол, шелк',25000.00,30000.00,8,6,'Chanel','DRESS-010',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(11,'Юбка миди','Кожаная юбка-карандаш',8000.00,9500.00,12,6,'Zara','SKIRT-011',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(12,'Блузка шелковая','Шелковая блуза с бантом',7000.00,8500.00,18,6,'H&M','BLOUSE-012',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(13,'Набор кастрюль','6 кастрюль из нержавеющей стали',12000.00,15000.00,10,8,'Tefal','POTS-013',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(14,'Мультиварка Redmond','Мультиварка с 20 программами',8000.00,10000.00,6,8,'Redmond','MC-014',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(15,'Кофеварка капельная','Кофеварка на 12 чашек',6000.00,7500.00,9,8,'Bosch','COFFEE-015',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(16,'Картина на холсте','Абстракция 80x100 см',5500.00,7000.00,5,9,'Art','PAINT-016',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(17,'Ваза напольная','Керамическая ваза 60 см',8500.00,10000.00,4,9,'L\'Objet','VASE-017',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(18,'Набор свечей','Ароматические свечи 3 шт',2500.00,3000.00,20,9,'Yankee Candle','CANDLE-018',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(19,'Наушники Sony WH-1000XM5','Беспроводные наушники с шумоподавлением',30000.00,35000.00,14,1,'Sony','SONY-019',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58'),(20,'Умные часы Apple Watch SE','Смарт-часы с GPS',28000.00,32000.00,11,1,'Apple','AWSE-020',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_revoked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_token` (`token`(255)),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (1,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc4MzQxMjkxMSwiZXhwIjoxNzg0MDE3NzExfQ.dV0fG5eJockMM994evhK5Xs6VNX5KR4-FhObcqIpZQs','2026-07-14 08:28:32','2026-07-07 08:28:31',0),(2,14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImlhdCI6MTc4MzQxMzM0MiwiZXhwIjoxNzg0MDE4MTQyfQ.9y8cqoyVE4c3o71qrCto4LYmBB2ZrTFL8m75kPwWWso','2026-07-14 08:35:42','2026-07-07 08:35:42',0);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_approved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_review` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,5,'Отличный телефон! Очень доволен покупкой.','2026-06-22 09:12:49',1),(2,2,8,4,'Хорошие джинсы, но немного велики','2026-06-22 09:12:49',1),(3,3,3,5,'Отличный бюджетный смартфон, камера супер!','2026-06-22 09:12:49',1),(4,4,4,5,'MacBook Pro - мощь и красота','2026-06-22 09:12:49',1),(5,5,6,4,'Хороший ноутбук, но греется','2026-06-22 09:12:49',1),(6,1,19,5,'Наушники топ, шумоподавление отличное','2026-06-22 09:12:49',1),(7,6,10,3,'Красивое платье, но дороговато','2026-06-22 09:12:49',1),(8,7,13,4,'Кастрюли качественные, но тяжелые','2026-06-22 09:12:49',1),(9,8,15,5,'Кофеварка супер! Пользуюсь каждый день','2026-06-22 09:12:49',1),(10,9,2,5,'Samsung S24 - лучший Android','2026-06-22 09:12:49',1),(11,10,20,4,'Хорошие часы, но разряжаются быстро','2026-06-22 09:12:49',1),(12,2,18,5,'Свечи ароматные, запах держится долго','2026-06-22 09:12:49',1),(13,3,9,3,'Футболка обычная, ничего особенного','2026-06-22 09:12:49',1),(14,5,16,4,'Картина красивая, отлично вписалась в интерьер','2026-06-22 09:12:49',1),(15,7,14,5,'Мультиварка - мастхэв на кухне!','2026-06-22 09:12:49',1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `registration_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `is_admin` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ivan@mail.ru','hash_ivan123','Иван','Петров','+7-900-111-22-33','1990-05-15','2026-06-22 08:40:45',NULL,1,0),(2,'petr@yandex.ru','hash_petr456','Петр','Сидоров','+7-900-222-33-44','1985-08-22','2026-06-22 08:40:45',NULL,1,0),(3,'maria@gmail.com','hash_maria789','Мария','Иванова','+7-900-333-44-55','1995-03-10','2026-06-22 08:40:45',NULL,1,0),(4,'elena@bk.ru','hash_elena101','Елена','Козлова','+7-900-444-55-66','1988-12-01','2026-06-22 08:40:45',NULL,1,0),(5,'dmitry@yandex.ru','hash_dmitry202','Дмитрий','Смирнов','+7-900-555-66-77','1992-07-19','2026-06-22 08:40:45',NULL,1,0),(6,'olga@gmail.com','hash_olga303','Ольга','Новикова','+7-900-666-77-88','1983-09-25','2026-06-22 08:40:45',NULL,1,0),(7,'alexey@mail.ru','hash_alexey404','Алексей','Морозов','+7-900-777-88-99','1998-11-03','2026-06-22 08:40:45',NULL,1,0),(8,'tatiana@bk.ru','hash_tatiana505','Татьяна','Волкова','+7-900-888-99-00','1991-04-17','2026-06-22 08:40:45',NULL,1,0),(9,'sergey@yandex.ru','hash_sergey606','Сергей','Зайцев','+7-900-999-00-11','1986-06-28','2026-06-22 08:40:45',NULL,1,0),(10,'anna@gmail.com','hash_anna707','Анна','Соколова','+7-900-000-11-22','1993-02-14','2026-06-22 08:40:45',NULL,1,1),(12,'anna1@gmail.com','122','анна','соколова','444242',NULL,'2026-06-23 08:26:17',NULL,0,1),(13,'test@example.com','$2b$10$FkQO.jcbb1I2K8GwHEvUpe9HxtDk6bsBkD/Xy5bmm5lp6dgO4GPYe','Иван','Тестов','+7-900-123-45-67','1990-01-01','2026-07-06 09:29:15',NULL,1,0),(14,'testtt@mail.ru','$2b$10$NANbjQOY7kaFgGsk3J.62uM3OVsfpKWpZ.M3FEF.uMNRp1SPxPmYG','Тест','Тестов',NULL,NULL,'2026-07-07 08:28:31',NULL,1,0),(15,'new_user1@mail.ru','hash_new1','Артём','Кузнецов','+7-999-111-11-11','1995-04-10','2026-07-18 07:00:00',NULL,1,0),(16,'new_user2@yandex.ru','hash_new2','Виктория','Смирнова','+7-999-222-22-22','1992-08-15','2026-07-19 11:30:00',NULL,1,0),(17,'new_user3@gmail.com','hash_new3','Максим','Попов','+7-999-333-33-33','1989-11-20','2026-07-20 06:15:00',NULL,1,0),(18,'new_user4@bk.ru','hash_new4','Алиса','Морозова','+7-999-444-44-44','1998-02-25','2026-07-21 13:45:00',NULL,1,0),(19,'new_user5@yandex.ru','hash_new5','Егор','Зайцев','+7-999-555-55-55','1993-07-05','2026-07-22 08:00:00',NULL,1,0);
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

-- Dump completed on 2026-07-22 10:09:50
