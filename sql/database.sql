-- ============================================
-- Script de creación de base de datos
-- Kanban Board
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS kanban_board 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE kanban_board;

-- Eliminar tabla si existe (para desarrollo)
DROP TABLE IF EXISTS tasks;

-- Crear tabla de tareas
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(500) NOT NULL,
    status ENUM('Some day', 'To do', 'In progress', 'Done') NOT NULL DEFAULT 'To do',
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (opcional)
INSERT INTO tasks (description, status, priority) VALUES
('Diseñar la interfaz de usuario', 'Done', 'high'),
('Implementar API REST', 'In progress', 'high'),
('Escribir documentación', 'To do', 'medium'),
('Realizar pruebas unitarias', 'To do', 'medium'),
('Optimizar rendimiento', 'Some day', 'low'),
('Añadir autenticación de usuarios', 'Some day', 'medium');

-- Verificar que se creó correctamente
SELECT * FROM tasks;

-- Mostrar estructura de la tabla
DESCRIBE tasks;
