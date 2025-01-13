CREATE DATABASE IntranetSystem;
USE IntranetSystem;

-- 1. Kullanıcılar Tablosu
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role ENUM('Admin', 'Employee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Duyurular Tablosu
CREATE TABLE Announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 3. İzinler Tablosu
CREATE TABLE LeaveRequests (
    leave_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
	reason TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 4. Maaşlar Tablosu
CREATE TABLE Salaries (
    salary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    salary_amount DECIMAL(10, 2),
    payment_date DATE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 5. Etkinlikler Tablosu
CREATE TABLE Events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    date DATE,
    description TEXT,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 6. Loglar Tablosu
CREATE TABLE Logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255),
    user_id INT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- 7. Sessions Tablosu
CREATE TABLE Sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Kullanıcı Ekleme
DELIMITER //
CREATE PROCEDURE AddUser (
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password_hash VARCHAR(255),
    IN p_role ENUM('Admin', 'Employee')
)
BEGIN
    INSERT INTO Users (name, email, password_hash, role)
    VALUES (p_name, p_email, p_password_hash, p_role);
END //
DELIMITER ;

-- Kullanıcı Güncelleme
DELIMITER //
CREATE PROCEDURE UpdateUser (
    IN p_user_id INT,
    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_role ENUM('Admin', 'Employee')
)
BEGIN
    UPDATE Users
    SET name = p_name, email = p_email, role = p_role
    WHERE user_id = p_user_id;
END //
DELIMITER ;

-- Kullanıcı Silme
DELIMITER //
CREATE PROCEDURE DeleteUser (
    IN p_user_id INT
)
BEGIN
    DELETE FROM Users WHERE user_id = p_user_id;
END //
DELIMITER ;

-- Kullanıcıları Listeleme
DELIMITER //
CREATE PROCEDURE GetUsers ()
BEGIN
    SELECT user_id, name, email, role, created_at FROM Users;
END //
DELIMITER ;

-- Duyuru Ekleme
DELIMITER //
CREATE PROCEDURE AddAnnouncement (
    IN p_title VARCHAR(255),
    IN p_description TEXT,
    IN p_created_by INT
)
BEGIN
    INSERT INTO Announcements (title, description, created_by)
    VALUES (p_title, p_description, p_created_by);
END //
DELIMITER ;

-- Duyuru Güncelleme
DELIMITER //
CREATE PROCEDURE UpdateAnnouncement (
    IN p_announcement_id INT,
    IN p_title VARCHAR(255),
    IN p_description TEXT
)
BEGIN
    UPDATE Announcements
    SET title = p_title, description = p_description
    WHERE announcement_id = p_announcement_id;
END //
DELIMITER ;

-- Duyuru Silme
DELIMITER //
CREATE PROCEDURE DeleteAnnouncement (
    IN p_announcement_id INT
)
BEGIN
    DELETE FROM Announcements WHERE announcement_id = p_announcement_id;
END //
DELIMITER ;

-- Duyuruları Listeleme
DELIMITER //
CREATE PROCEDURE GetAnnouncements ()
BEGIN
    SELECT a.announcement_id, a.title, a.description, u.name AS created_by, a.created_at
    FROM Announcements a
    JOIN Users u ON a.created_by = u.user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetAllAnnouncements()
BEGIN
    SELECT announcement_id, title, description, created_by, created_at
    FROM Announcements
    ORDER BY created_at DESC;
END //
DELIMITER ;

-- İzin Talebi Ekleme
DELIMITER //
CREATE PROCEDURE AddLeaveRequest (
    IN p_user_id INT,
    IN p_reason TEXT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    INSERT INTO LeaveRequests (user_id, reason, start_date, end_date)
    VALUES (p_user_id, p_reason, p_start_date, p_end_date);
END //
DELIMITER ;

-- İzin Talebini Güncelleme
DELIMITER //
CREATE PROCEDURE UpdateLeaveStatus (
    IN p_leave_id INT,
    IN p_status ENUM('Pending', 'Approved', 'Rejected')
)
BEGIN
    UPDATE LeaveRequests
    SET status = p_status
    WHERE leave_id = p_leave_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE UpdateLeaveRequest(
    IN p_leave_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_reason TEXT
)
BEGIN
    UPDATE LeaveRequests 
    SET start_date = p_start_date, 
        end_date = p_end_date, 
        reason = p_reason
    WHERE leave_id = p_leave_id;
END //
DELIMITER ;


-- İzin Talebini Silme
DELIMITER //
CREATE PROCEDURE DeleteLeaveRequest (
    IN p_leave_id INT
)
BEGIN
    DELETE FROM LeaveRequests WHERE leave_id = p_leave_id;
END //
DELIMITER ;

-- İzin Taleplerini Listeleme
DELIMITER //
CREATE PROCEDURE GetLeaveRequests ()
BEGIN
    SELECT l.leave_id, u.name AS user_name, l.reason, l.start_date, l.end_date, l.status, l.request_date
    FROM LeaveRequests l
    JOIN Users u ON l.user_id = u.user_id;
END //
DELIMITER ;

-- Maaş Bilgisi Ekle
DELIMITER //
CREATE PROCEDURE AddSalary (
    IN p_user_id INT,
    IN p_salary_amount DECIMAL(10, 2),
    IN p_payment_date DATE
)
BEGIN
    INSERT INTO Salaries (user_id, salary_amount, payment_date)
    VALUES (p_user_id, p_salary_amount, p_payment_date);
END //
DELIMITER ;

-- Maaş Güncelle
DELIMITER //
CREATE PROCEDURE UpdateSalary (
    IN p_salary_id INT,
    IN p_salary_amount DECIMAL(10, 2),
    IN p_payment_date DATE
)
BEGIN
    UPDATE Salaries
    SET salary_amount = p_salary_amount, payment_date = p_payment_date
    WHERE salary_id = p_salary_id;
END //
DELIMITER ;

-- Maaş Sil
DELIMITER //
CREATE PROCEDURE DeleteSalary (
    IN p_salary_id INT
)
BEGIN
    DELETE FROM Salaries WHERE salary_id = p_salary_id;
END //
DELIMITER ;

-- Maaşları Listele
DELIMITER //
CREATE PROCEDURE GetSalaries ()
BEGIN
    SELECT s.salary_id, u.name AS user_name, s.salary_amount, s.payment_date
    FROM Salaries s
    JOIN Users u ON s.user_id = u.user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE GetSalaryByUserId (
    IN p_user_id INT
)
BEGIN
    SELECT s.salary_id, s.salary_amount, s.payment_date, u.name AS user_name
    FROM salaries s
    JOIN users u ON s.user_id = u.user_id
    WHERE s.user_id = p_user_id;
END //
DELIMITER ;


-- Etkinlik Ekle
DELIMITER //
CREATE PROCEDURE AddEvent (
    IN p_title VARCHAR(255),
    IN p_date DATE,
    IN p_description TEXT,
    IN p_created_by INT
)
BEGIN
    INSERT INTO Events (title, date, description, created_by)
    VALUES (p_title, p_date, p_description, p_created_by);
END //
DELIMITER ;

-- Etkinlik Güncelle
DELIMITER //
CREATE PROCEDURE UpdateEvent (
    IN p_event_id INT,
    IN p_title VARCHAR(255),
    IN p_date DATE,
    IN p_description TEXT
)
BEGIN
    UPDATE Events
    SET title = p_title, date = p_date, description = p_description
    WHERE event_id = p_event_id;
END //
DELIMITER ;

-- Etkinlik Sil
DELIMITER //
CREATE PROCEDURE DeleteEvent (
    IN p_event_id INT
)
BEGIN
    DELETE FROM Events WHERE event_id = p_event_id;
END //
DELIMITER ;

-- Etkinlikleri Listele
DELIMITER //
CREATE PROCEDURE GetEvents ()
BEGIN
    SELECT e.event_id, e.title, e.date, e.description, u.name AS created_by
    FROM Events e
    JOIN Users u ON e.created_by = u.user_id;
END //
DELIMITER ;

-- Oturum Ekle
DELIMITER //
CREATE PROCEDURE AddSession (
    IN p_user_id INT,
    IN p_session_token VARCHAR(255)
)
BEGIN
    INSERT INTO Sessions (user_id, session_token)
    VALUES (p_user_id, p_session_token);
END //
DELIMITER ;

-- Oturumu Sil
DELIMITER //
CREATE PROCEDURE DeleteSession (
    IN p_session_token VARCHAR(255)
)
BEGIN
    DELETE FROM Sessions WHERE session_token = p_session_token;
END //
DELIMITER ;

-- Oturumları Listele
DELIMITER //
CREATE PROCEDURE GetSessions ()
BEGIN
    SELECT s.session_id, u.name AS user_name, s.session_token, s.created_at
    FROM Sessions s
    JOIN Users u ON s.user_id = u.user_id;
END //
DELIMITER ;

-- Maaşa Yüzdelik Zam Yapma
DELIMITER //
CREATE FUNCTION AdjustSalary(
    current_salary DECIMAL(10, 2), 
    percentage_increase DECIMAL(5, 2)
) 
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
    RETURN current_salary + (current_salary * (percentage_increase / 100));
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER LogLeaveStatusChange
AFTER UPDATE ON LeaveRequests
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status THEN
        INSERT INTO Logs (action, user_id)
        VALUES (
            CONCAT('Leave status changed to ', NEW.status, ' for leave ID: ', NEW.leave_id),
            NEW.user_id
        );
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER WelcomeNewUser
AFTER INSERT ON Users
FOR EACH ROW
BEGIN
    INSERT INTO Announcements (title, description, created_by)
    VALUES (
        'Hoş Geldiniz',
        CONCAT('Yeni kullanıcı: ', NEW.name, ' aramıza katıldı!'),
        NEW.user_id
    );
END //
DELIMITER ;