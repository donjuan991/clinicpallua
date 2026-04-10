-- database.sql
CREATE DATABASE IF NOT EXISTS clinic_db;
USE clinic_db;

-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'patient') DEFAULT 'patient',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Таблица врачей
CREATE TABLE IF NOT EXISTS doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    experience INT,
    rating DECIMAL(3,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
);

-- Таблица услуг
CREATE TABLE IF NOT EXISTS services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration INT COMMENT 'длительность в минутах',
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
);

-- Таблица записей на прием
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL COMMENT 'ID авторизованного пользователя',
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255),
    doctor_id INT NOT NULL,
    service_id INT,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(10) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_doctor_date (doctor_id, appointment_date)
);

-- Таблица расписания врачей (слоты)
CREATE TABLE IF NOT EXISTS schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    day_of_week INT NOT NULL COMMENT '0-6, где 0-воскресенье, 1-понедельник...',
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    is_working_day BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doctor_day (doctor_id, day_of_week)
);

-- Таблица исключений в расписании (отпуска, больничные)
CREATE TABLE IF NOT EXISTS schedule_exceptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    doctor_id INT NOT NULL,
    exception_date DATE NOT NULL,
    is_working BOOLEAN DEFAULT FALSE,
    reason VARCHAR(255),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_doctor_date (doctor_id, exception_date)
);

-- Вставка начальных данных
-- Врачи
INSERT INTO doctors (name, specialization, description, experience, rating, is_active, order_index) VALUES
('Проф. Н. Паллуа', 'Главный пластический хирург', 'Европейская ассоциация пластических хирургов (ФЕБОПРАС), Высшая категория', 30, 5.0, TRUE, 1),
('Др. Мария Делакур', 'Эксперт по лицу', 'Университет Париж Декарт, Франция', 15, 4.9, TRUE, 2),
('Др. Ханс Мюллер', 'Реконструктивная хирургия', 'Шарите - Медицинский университет Берлина', 12, 4.9, TRUE, 3),
('Др. Анна Вольф', 'Хирургия тела', 'Венский медицинский университет, Австрия', 10, 4.8, TRUE, 4),
('Др. Луиджи Росси', 'Мужская пластика', 'Миланский университет, Италия', 8, 4.8, TRUE, 5),
('Др. Эмили Чен', 'Косметолог-дерматолог', 'Гарвардская медицинская школа, США', 8, 4.9, TRUE, 6);

-- Услуги
INSERT INTO services (name, description, price, duration, category, is_active, order_index) VALUES
('Консультация профессора Паллуа', 'Первичная консультация с осмотром', 5000, 60, 'consultation', TRUE, 1),
('Ринопластика', 'Коррекция формы носа', 150000, 180, 'face-surgery', TRUE, 2),
('Блефаропластика', 'Коррекция век', 80000, 120, 'face-surgery', TRUE, 3),
('SMAS-подтяжка лица', 'Круговая подтяжка лица', 250000, 240, 'face-surgery', TRUE, 4),
('Липосакция', 'Удаление жира (одна зона)', 80000, 150, 'body-surgery', TRUE, 5),
('Абдоминопластика', 'Подтяжка живота', 180000, 210, 'body-surgery', TRUE, 6),
('Маммопластика', 'Увеличение груди', 220000, 180, 'breast-surgery', TRUE, 7),
('Ботулинотерапия', 'Инъекции ботокса (одна зона)', 8000, 30, 'non-surgical', TRUE, 8);

-- Расписание (пн-пт 9-18, сб 9-15, вс выходной)
-- Для каждого врача добавляем расписание
INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, is_working_day) VALUES
-- Для врача 1
(1, 1, '09:00', '18:00', TRUE),
(1, 2, '09:00', '18:00', TRUE),
(1, 3, '09:00', '18:00', TRUE),
(1, 4, '09:00', '18:00', TRUE),
(1, 5, '09:00', '18:00', TRUE),
(1, 6, '09:00', '15:00', TRUE),
-- Для врача 2
(2, 1, '09:00', '18:00', TRUE),
(2, 2, '09:00', '18:00', TRUE),
(2, 3, '09:00', '18:00', TRUE),
(2, 4, '09:00', '18:00', TRUE),
(2, 5, '09:00', '18:00', TRUE),
(2, 6, '09:00', '15:00', TRUE);

-- Администратор (пароль: admin123)
INSERT INTO users (email, password_hash, name, role) VALUES 
('admin@clinic.ru', '$2a$10$YourHashedPasswordHere', 'Администратор', 'admin');