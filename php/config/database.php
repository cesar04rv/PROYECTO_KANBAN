<?php
/**
 * Configuración de la base de datos
 */

class Database {
    private $host = 'localhost';
    private $db = 'kanban_board';
    private $user = 'cesar';
    private $pass = 'cesar';
    private $charset = 'utf8mb4';
    private $pdo;
    private $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    /**
     * Obtener la conexión a la base de datos
     */
    public function getConnection() {
        if ($this->pdo === null) {
            try {
                $dsn = "mysql:host={$this->host};dbname={$this->db};charset={$this->charset}";
                $this->pdo = new PDO($dsn, $this->user, $this->pass, $this->options);
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode([
                    'error' => 'Error de conexión a la base de datos',
                    'message' => $e->getMessage()
                ]);
                exit;
            }
        }
        return $this->pdo;
    }
}
