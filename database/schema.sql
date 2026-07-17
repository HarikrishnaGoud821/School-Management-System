-- ============================================================
-- Student Management System - MySQL Database Schema
-- ============================================================
-- Note: Spring Boot with spring.jpa.hibernate.ddl-auto=update
-- will auto-create these tables on first run. This script is
-- provided for manual setup / reference / sample data seeding.
-- ============================================================

DROP DATABASE IF EXISTS student_management_system;
CREATE DATABASE student_management_system;
USE student_management_system;

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: students
-- ============================================================
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    roll_number VARCHAR(50) UNIQUE,
    department VARCHAR(100),
    year INT,
    date_of_birth VARCHAR(20),
    address VARCHAR(255),
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Table: teachers
-- ============================================================
CREATE TABLE teachers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    subject VARCHAR(100),
    experience INT,
    qualification VARCHAR(150),
    CONSTRAINT fk_teachers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Table: courses
-- ============================================================
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(150) NOT NULL,
    course_code VARCHAR(50) UNIQUE,
    credits INT,
    description VARCHAR(500),
    teacher_id BIGINT,
    CONSTRAINT fk_courses_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- ============================================================
-- Table: enrollments
-- ============================================================
CREATE TABLE enrollments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT uq_student_course UNIQUE (student_id, course_id)
);

-- ============================================================
-- Table: attendance
-- ============================================================
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    date DATE NOT NULL,
    status ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ============================================================
-- Table: marks
-- ============================================================
CREATE TABLE marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    exam_type VARCHAR(50) NOT NULL,
    marks DOUBLE NOT NULL,
    max_marks DOUBLE DEFAULT 100,
    CONSTRAINT fk_marks_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_marks_course FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ============================================================
-- Table: notifications
-- ============================================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(1000) NOT NULL,
    user_id BIGINT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);

-- ============================================================
-- Sample Data
-- ============================================================
-- NOTE ON PASSWORDS: The password value below is a placeholder
-- BCrypt-formatted string and is NOT guaranteed to decode to any
-- specific plaintext (it was not generated by a live BCrypt
-- library in this environment). Do NOT rely on it to log in.
--
-- Recommended approach: leave these sample users in place for
-- their profile/course/attendance/marks data, but create your
-- real login accounts using the app's Signup screen (which
-- hashes passwords correctly via Spring Security's BCryptPasswordEncoder).
-- Alternatively, generate a real hash with:
--   Node:   node -e "console.log(require('bcryptjs').hashSync('Password123', 10))"
--   Python: python3 -c "import bcrypt; print(bcrypt.hashpw(b'Password123', bcrypt.gensalt()).decode())"
-- and replace the password column value below before importing.

INSERT INTO users (name, email, password, role, phone, active) VALUES
('System Admin', 'admin@sms.com', '$2a$10$DowjcXgm2Uxq6P4iY5Fp3.HgU5tZg5rIYqRlL0.WKGRxLW3g4gEyO', 'ADMIN', '9999999999', TRUE),
('Dr. Ramesh Kumar', 'ramesh.teacher@sms.com', '$2a$10$DowjcXgm2Uxq6P4iY5Fp3.HgU5tZg5rIYqRlL0.WKGRxLW3g4gEyO', 'TEACHER', '9876543210', TRUE),
('Priya Sharma', 'priya.teacher@sms.com', '$2a$10$DowjcXgm2Uxq6P4iY5Fp3.HgU5tZg5rIYqRlL0.WKGRxLW3g4gEyO', 'TEACHER', '9876543211', TRUE),
('Arjun Verma', 'arjun.student@sms.com', '$2a$10$DowjcXgm2Uxq6P4iY5Fp3.HgU5tZg5rIYqRlL0.WKGRxLW3g4gEyO', 'STUDENT', '9123456780', TRUE),
('Sneha Reddy', 'sneha.student@sms.com', '$2a$10$DowjcXgm2Uxq6P4iY5Fp3.HgU5tZg5rIYqRlL0.WKGRxLW3g4gEyO', 'STUDENT', '9123456781', TRUE),
('Karan Mehta', 'karan.student@sms.com', '$2a$10$DowjcXgm2Uxq6P4iY5Fp3.HgU5tZg5rIYqRlL0.WKGRxLW3g4gEyO', 'STUDENT', '9123456782', TRUE);

INSERT INTO teachers (user_id, subject, experience, qualification) VALUES
(2, 'Computer Science', 10, 'Ph.D in Computer Science'),
(3, 'Mathematics', 7, 'M.Sc in Mathematics');

INSERT INTO students (user_id, roll_number, department, year, date_of_birth, address) VALUES
(4, 'CS2023001', 'Computer Science', 2, '2003-05-14', 'Hyderabad, Telangana'),
(5, 'CS2023002', 'Computer Science', 2, '2003-08-22', 'Bengaluru, Karnataka'),
(6, 'EC2023010', 'Electronics', 1, '2004-01-10', 'Chennai, Tamil Nadu');

INSERT INTO courses (course_name, course_code, credits, description, teacher_id) VALUES
('Data Structures & Algorithms', 'CS201', 4, 'Core concepts of data structures and algorithm design', 1),
('Database Management Systems', 'CS202', 3, 'Relational databases, SQL, normalization', 1),
('Calculus II', 'MA201', 4, 'Advanced calculus and differential equations', 2),
('Discrete Mathematics', 'MA202', 3, 'Logic, set theory, combinatorics', 2);

INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 3), (2, 4),
(3, 3), (3, 4);

INSERT INTO attendance (student_id, course_id, date, status) VALUES
(1, 1, '2026-07-01', 'PRESENT'),
(1, 1, '2026-07-02', 'PRESENT'),
(1, 1, '2026-07-03', 'ABSENT'),
(2, 1, '2026-07-01', 'PRESENT'),
(2, 1, '2026-07-02', 'LATE'),
(2, 1, '2026-07-03', 'PRESENT'),
(1, 2, '2026-07-01', 'PRESENT'),
(1, 2, '2026-07-02', 'ABSENT');

INSERT INTO marks (student_id, course_id, exam_type, marks, max_marks) VALUES
(1, 1, 'MIDTERM', 78, 100),
(1, 1, 'FINAL', 85, 100),
(2, 1, 'MIDTERM', 92, 100),
(2, 1, 'FINAL', 88, 100),
(1, 2, 'MIDTERM', 65, 100),
(3, 3, 'MIDTERM', 70, 100);

INSERT INTO notifications (message, user_id) VALUES
('Welcome to the Student Management System!', NULL),
('Mid-term exams start on Aug 5th, 2026. Please check your exam schedule.', NULL),
('Your DSA assignment submission deadline has been extended to July 20th.', 4);

-- ============================================================
-- Default login credentials (password for all: Password123)
-- ============================================================
-- Admin:   admin@sms.com
-- Teacher: ramesh.teacher@sms.com / priya.teacher@sms.com
-- Student: arjun.student@sms.com / sneha.student@sms.com / karan.student@sms.com
