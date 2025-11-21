<?php
/**
 * Modelo de Tarea
 * Maneja todas las operaciones de base de datos relacionadas con tareas
 */

class Task {
    private $pdo;
    private $table = 'tasks';

    // Estados y prioridades válidos
    const VALID_STATUS = ['Some day', 'To do', 'In progress', 'Done'];
    const VALID_PRIORITY = ['low', 'medium', 'high'];

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Obtener todas las tareas
     */
    public function getAll() {
        $stmt = $this->pdo->query("SELECT * FROM {$this->table} ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    /**
     * Obtener una tarea por ID
     */
    public function getById($id) {
        $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /**
     * Crear una nueva tarea
     */
    public function create($description, $status, $priority) {
        $stmt = $this->pdo->prepare(
            "INSERT INTO {$this->table} (description, status, priority) VALUES (?, ?, ?)"
        );
        
        $stmt->execute([$description, $status, $priority]);
        
        return [
            'id' => $this->pdo->lastInsertId(),
            'description' => $description,
            'status' => $status,
            'priority' => $priority,
            'created_at' => date('Y-m-d H:i:s')
        ];
    }

    /**
     * Actualizar una tarea completa
     */
    public function update($id, $description, $status, $priority) {
        $stmt = $this->pdo->prepare(
            "UPDATE {$this->table} SET description = ?, status = ?, priority = ? WHERE id = ?"
        );
        
        $stmt->execute([$description, $status, $priority, $id]);
        
        return $this->getById($id);
    }

    /**
     * Actualizar campos específicos de una tarea
     */
    public function patch($id, $fields) {
        $updates = [];
        $params = [];
        
        if (isset($fields['description'])) {
            $updates[] = 'description = ?';
            $params[] = $fields['description'];
        }
        if (isset($fields['status'])) {
            $updates[] = 'status = ?';
            $params[] = $fields['status'];
        }
        if (isset($fields['priority'])) {
            $updates[] = 'priority = ?';
            $params[] = $fields['priority'];
        }
        
        if (empty($updates)) {
            throw new Exception('No hay campos para actualizar');
        }
        
        $params[] = $id;
        $sql = "UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE id = ?";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        
        return $this->getById($id);
    }

    /**
     * Eliminar una tarea
     */
    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        
        return ['message' => 'Tarea eliminada correctamente', 'id' => $id];
    }

    /**
     * Verificar si una tarea existe
     */
    public function exists($id) {
        $stmt = $this->pdo->prepare("SELECT id FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() !== false;
    }

    /**
     * Validar datos de una tarea
     */
    public static function validate($data, $requireAll = true) {
        $errors = [];
        
        // Validar descripción
        if ($requireAll || isset($data['description'])) {
            if (empty($data['description']) || !is_string($data['description'])) {
                $errors[] = 'La descripción es obligatoria y debe ser un texto válido';
            } elseif (strlen($data['description']) > 500) {
                $errors[] = 'La descripción no puede superar los 500 caracteres';
            }
        }
        
        // Validar estado
        if ($requireAll || isset($data['status'])) {
            if (empty($data['status']) || !in_array($data['status'], self::VALID_STATUS)) {
                $errors[] = 'Estado inválido. Valores permitidos: ' . implode(', ', self::VALID_STATUS);
            }
        }
        
        // Validar prioridad
        if ($requireAll || isset($data['priority'])) {
            if (empty($data['priority']) || !in_array($data['priority'], self::VALID_PRIORITY)) {
                $errors[] = 'Prioridad inválida. Valores permitidos: ' . implode(', ', self::VALID_PRIORITY);
            }
        }
        
        return $errors;
    }
}
