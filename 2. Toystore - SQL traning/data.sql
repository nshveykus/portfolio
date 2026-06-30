-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
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
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,NULL,2,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (2,3,NULL,19,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (3,5,NULL,20,2,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (4,NULL,'session_abc123',11,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (5,NULL,'session_abc123',17,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (6,7,NULL,5,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (7,9,NULL,7,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (8,NULL,'session_def456',3,2,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (9,NULL,'session_def456',12,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
INSERT INTO `carts` VALUES (10,10,NULL,1,1,'2026-06-22 09:12:59','2026-06-22 09:12:59');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Электроника','Все виды электроники и гаджетов',NULL,NULL,1);
INSERT INTO `categories` VALUES (2,'Смартфоны и телефоны','Мобильные телефоны и аксессуары',1,NULL,1);
INSERT INTO `categories` VALUES (3,'Ноутбуки и компьютеры','Ноутбуки, ПК и комплектующие',1,NULL,2);
INSERT INTO `categories` VALUES (4,'Одежда и обувь','Мужская и женская одежда',NULL,NULL,2);
INSERT INTO `categories` VALUES (5,'Мужская одежда','Куртки, футболки, джинсы',4,NULL,1);
INSERT INTO `categories` VALUES (6,'Женская одежда','Платья, юбки, блузки',4,NULL,2);
INSERT INTO `categories` VALUES (7,'Дом и уют','Товары для дома',NULL,NULL,3);
INSERT INTO `categories` VALUES (8,'Кухонная утварь','Посуда, приборы, техника для кухни',7,NULL,1);
INSERT INTO `categories` VALUES (9,'Декор','Картины, вазы, свечи',7,NULL,2);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (1,1,1,1,120000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (2,1,19,1,30000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (3,1,20,1,28000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (4,2,8,1,5000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (5,3,3,1,35000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (6,5,4,1,250000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (7,6,15,1,6000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (8,6,18,2,2500.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (9,7,10,1,25000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (10,7,12,1,7000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (11,8,11,1,8000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (12,9,19,1,30000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (13,10,2,1,110000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (14,12,20,1,28000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (15,13,13,1,12000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (16,14,6,1,150000.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (17,14,9,2,1500.00);
INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`) VALUES (18,15,16,1,5500.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `order_statuses`
--

LOCK TABLES `order_statuses` WRITE;
/*!40000 ALTER TABLE `order_statuses` DISABLE KEYS */;
INSERT INTO `order_statuses` VALUES (1,'new','Заказ создан');
INSERT INTO `order_statuses` VALUES (2,'unpaid','Ожидает оплаты');
INSERT INTO `order_statuses` VALUES (3,'processing','В обработке');
INSERT INTO `order_statuses` VALUES (4,'shipped','В доставке');
INSERT INTO `order_statuses` VALUES (5,'delivered','Доставлен');
INSERT INTO `order_statuses` VALUES (6,'cancelled','Заказ отменен');
/*!40000 ALTER TABLE `order_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,1,'2026-06-22 09:12:15',2,1,'г. Москва, ул. Тверская, д. 5, кв. 12','2026-06-25','Позвонить за час',155000.00,1);
INSERT INTO `orders` VALUES (2,2,'2026-06-22 09:12:15',4,2,'г. Санкт-Петербург, Невский пр., д. 10, кв. 5','2026-06-20',NULL,5000.00,1);
INSERT INTO `orders` VALUES (3,3,'2026-06-22 09:12:15',1,3,'г. Казань, ул. Баумана, д. 3, кв. 8','2026-06-28','Срочно!',35000.00,0);
INSERT INTO `orders` VALUES (4,4,'2026-06-22 09:12:15',6,1,'г. Новосибирск, Красный пр., д. 15, кв. 20',NULL,'Отменить заказ',0.00,0);
INSERT INTO `orders` VALUES (5,5,'2026-06-22 09:12:15',3,2,'г. Екатеринбург, ул. Ленина, д. 7, кв. 3','2026-06-22',NULL,180000.00,1);
INSERT INTO `orders` VALUES (6,1,'2026-06-22 09:12:15',4,1,'г. Москва, ул. Тверская, д. 5, кв. 12','2026-06-18','Оставить у двери',12000.00,1);
INSERT INTO `orders` VALUES (7,6,'2026-06-22 09:12:15',2,3,'г. Краснодар, ул. Красная, д. 20, кв. 15','2026-06-27',NULL,25000.00,1);
INSERT INTO `orders` VALUES (8,7,'2026-06-22 09:12:15',1,1,'г. Воронеж, ул. Плехановская, д. 8, кв. 7','2026-06-30',NULL,8000.00,0);
INSERT INTO `orders` VALUES (9,8,'2026-06-22 09:12:15',3,2,'г. Ростов-на-Дону, ул. Большая Садовая, д. 12, кв. 9','2026-06-24',NULL,30000.00,1);
INSERT INTO `orders` VALUES (10,9,'2026-06-22 09:12:15',4,1,'г. Нижний Новгород, ул. Большая Покровская, д. 5, кв. 2','2026-06-19',NULL,110000.00,1);
INSERT INTO `orders` VALUES (11,2,'2026-06-22 09:12:15',6,3,'г. Санкт-Петербург, Невский пр., д. 10, кв. 5',NULL,'Передумал',0.00,0);
INSERT INTO `orders` VALUES (12,10,'2026-06-22 09:12:15',2,1,'г. Челябинск, ул. Кирова, д. 15, кв. 10','2026-06-26',NULL,28000.00,1);
INSERT INTO `orders` VALUES (13,3,'2026-06-22 09:12:15',3,2,'г. Казань, ул. Баумана, д. 3, кв. 8','2026-06-23',NULL,12000.00,1);
INSERT INTO `orders` VALUES (14,5,'2026-06-22 09:12:15',4,1,'г. Екатеринбург, ул. Ленина, д. 7, кв. 3','2026-06-21',NULL,150000.00,1);
INSERT INTO `orders` VALUES (15,7,'2026-06-22 09:12:15',1,2,'г. Воронеж, ул. Плехановская, д. 8, кв. 7','2026-06-29',NULL,5500.00,0);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `payment_methods`
--

LOCK TABLES `payment_methods` WRITE;
/*!40000 ALTER TABLE `payment_methods` DISABLE KEYS */;
INSERT INTO `payment_methods` VALUES (1,'card','Банковская карта');
INSERT INTO `payment_methods` VALUES (2,'cash','Наличные при получении');
INSERT INTO `payment_methods` VALUES (3,'sbp','Через систему быстрых платежей');
INSERT INTO `payment_methods` VALUES (4,'online','Электронные кошельки');
INSERT INTO `payment_methods` VALUES (5,'installment','Долями/частями');
/*!40000 ALTER TABLE `payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'iPhone 15 Pro Max','Флагманский смартфон Apple с титановым корпусом',120000.00,129999.00,15,2,'Apple','IP15PM-001',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (2,'Samsung Galaxy S24 Ultra','Мощный Android-смартфон с S Pen',110000.00,119999.00,8,2,'Samsung','SGS24U-002',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (3,'Xiaomi Redmi Note 13 Pro','Бюджетный смартфон с отличной камерой',35000.00,39999.00,25,2,'Xiaomi','XRN13P-003',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (4,'MacBook Pro 16\" M3','Профессиональный ноутбук Apple',250000.00,NULL,5,3,'Apple','MBP16-004',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (5,'Lenovo ThinkPad X1 Carbon','Легкий бизнес-ноутбук',180000.00,195000.00,7,3,'Lenovo','TPX1C-005',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (6,'ASUS ROG Zephyrus G14','Игровой ноутбук с RTX 4060',150000.00,165000.00,3,3,'ASUS','ROGZ14-006',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (7,'Куртка кожаная мужская','Натуральная кожа, черная',15000.00,18000.00,20,5,'Biker','JK-007',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (8,'Джинсы классические','Синие джинсы прямого кроя',5000.00,6500.00,35,5,'Levi\'s','JEANS-008',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (9,'Футболка хлопковая','Белая футболка 100% хлопок',1500.00,2000.00,50,5,'Fruit of Loom','TEE-009',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (10,'Платье вечернее','Длинное платье в пол, шелк',25000.00,30000.00,8,6,'Chanel','DRESS-010',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (11,'Юбка миди','Кожаная юбка-карандаш',8000.00,9500.00,12,6,'Zara','SKIRT-011',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (12,'Блузка шелковая','Шелковая блуза с бантом',7000.00,8500.00,18,6,'H&M','BLOUSE-012',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (13,'Набор кастрюль','6 кастрюль из нержавеющей стали',12000.00,15000.00,10,8,'Tefal','POTS-013',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (14,'Мультиварка Redmond','Мультиварка с 20 программами',8000.00,10000.00,6,8,'Redmond','MC-014',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (15,'Кофеварка капельная','Кофеварка на 12 чашек',6000.00,7500.00,9,8,'Bosch','COFFEE-015',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (16,'Картина на холсте','Абстракция 80x100 см',5500.00,7000.00,5,9,'Art','PAINT-016',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (17,'Ваза напольная','Керамическая ваза 60 см',8500.00,10000.00,4,9,'L\'Objet','VASE-017',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (18,'Набор свечей','Ароматические свечи 3 шт',2500.00,3000.00,20,9,'Yankee Candle','CANDLE-018',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (19,'Наушники Sony WH-1000XM5','Беспроводные наушники с шумоподавлением',30000.00,35000.00,14,1,'Sony','SONY-019',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
INSERT INTO `products` VALUES (20,'Умные часы Apple Watch SE','Смарт-часы с GPS',28000.00,32000.00,11,1,'Apple','AWSE-020',NULL,1,'2026-06-22 08:56:58','2026-06-22 08:56:58');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,5,'Отличный телефон! Очень доволен покупкой.','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (2,2,8,4,'Хорошие джинсы, но немного велики','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (3,3,3,5,'Отличный бюджетный смартфон, камера супер!','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (4,4,4,5,'MacBook Pro - мощь и красота','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (5,5,6,4,'Хороший ноутбук, но греется','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (6,1,19,5,'Наушники топ, шумоподавление отличное','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (7,6,10,3,'Красивое платье, но дороговато','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (8,7,13,4,'Кастрюли качественные, но тяжелые','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (9,8,15,5,'Кофеварка супер! Пользуюсь каждый день','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (10,9,2,5,'Samsung S24 - лучший Android','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (11,10,20,4,'Хорошие часы, но разряжаются быстро','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (12,2,18,5,'Свечи ароматные, запах держится долго','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (13,3,9,3,'Футболка обычная, ничего особенного','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (14,5,16,4,'Картина красивая, отлично вписалась в интерьер','2026-06-22 09:12:49',1);
INSERT INTO `reviews` VALUES (15,7,14,5,'Мультиварка - мастхэв на кухне!','2026-06-22 09:12:49',1);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ivan@mail.ru','hash_ivan123','Иван','Петров','+7-900-111-22-33','1990-05-15','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (2,'petr@yandex.ru','hash_petr456','Петр','Сидоров','+7-900-222-33-44','1985-08-22','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (3,'maria@gmail.com','hash_maria789','Мария','Иванова','+7-900-333-44-55','1995-03-10','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (4,'elena@bk.ru','hash_elena101','Елена','Козлова','+7-900-444-55-66','1988-12-01','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (5,'dmitry@yandex.ru','hash_dmitry202','Дмитрий','Смирнов','+7-900-555-66-77','1992-07-19','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (6,'olga@gmail.com','hash_olga303','Ольга','Новикова','+7-900-666-77-88','1983-09-25','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (7,'alexey@mail.ru','hash_alexey404','Алексей','Морозов','+7-900-777-88-99','1998-11-03','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (8,'tatiana@bk.ru','hash_tatiana505','Татьяна','Волкова','+7-900-888-99-00','1991-04-17','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (9,'sergey@yandex.ru','hash_sergey606','Сергей','Зайцев','+7-900-999-00-11','1986-06-28','2026-06-22 08:40:45',NULL,1,0);
INSERT INTO `users` VALUES (10,'anna@gmail.com','hash_anna707','Анна','Соколова','+7-900-000-11-22','1993-02-14','2026-06-22 08:40:45',NULL,1,1);
INSERT INTO `users` VALUES (12,'anna1@gmail.com','122','анна','соколова','444242',NULL,'2026-06-23 08:26:17',NULL,0,1);
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

-- Dump completed on 2026-06-30 10:05:04
