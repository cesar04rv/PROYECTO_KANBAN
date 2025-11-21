<?php
/**
 * API RESTful de Tareas
 * Punto de entrada para todas las operaciones CRUD
 */

// Headers CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Incluir archivos necesarios
require_once '../config/database.php';
require_once '../models/Task.php';
require_once '../controllers/TaskController.php';

try {
    // Inicializar conexión a la base de datos
    $database = new Database();
    $pdo = $database->getConnection();
    
    // Inicializar controlador
    $controller = new TaskController($pdo);
    
    // Obtener método HTTP
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Obtener datos JSON del body
    $inputData = json_decode(file_get_contents('php://input'), true);
    
    // Obtener ID de la URL si existe
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    // Enrutamiento según el método HTTP
    switch ($method) {
        case 'GET':
            // Obtener todas las tareas
            $controller->index();
            break;
            
        case 'POST':
            // Crear nueva tarea
            $controller->store($inputData);
            break;
            
        case 'PUT':
            // Actualizar tarea completa
            $controller->update($id, $inputData);
            break;
            
        case 'PATCH':
            // Actualizar campos específicos
            $controller->patch($id, $inputData);
            break;
            
        case 'DELETE':
            // Eliminar tarea
            $controller->destroy($id);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Método no permitido']);
    }
    
} catch (PDOException $e) {
    error_log('Error de base de datos: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Error en la base de datos',
        'message' => $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log('Error general: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Error del servidor',
        'message' => $e->getMessage()
    ]);
}
