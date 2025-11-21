<?php
/**
 * Controlador de Tareas
 * Maneja la lógica de negocio y coordina entre el modelo y la API
 */

class TaskController {
    private $taskModel;

    public function __construct($pdo) {
        $this->taskModel = new Task($pdo);
    }

    /**
     * Obtener todas las tareas
     */
    public function index() {
        try {
            $tasks = $this->taskModel->getAll();
            $this->sendSuccess($tasks);
        } catch (Exception $e) {
            $this->sendError('Error al obtener tareas: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Crear una nueva tarea
     */
    public function store($data) {
        // Validar datos
        if (!$data) {
            $this->sendError('Datos JSON inválidos', 400);
        }

        $errors = Task::validate($data, true);
        if (!empty($errors)) {
            $this->sendError(implode('. ', $errors), 400);
        }

        try {
            $newTask = $this->taskModel->create(
                $data['description'],
                $data['status'],
                $data['priority']
            );
            $this->sendSuccess($newTask, 201);
        } catch (Exception $e) {
            $this->sendError('Error al crear tarea: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar una tarea completa
     */
    public function update($id, $data) {
        // Validar ID
        if (!$id || !is_numeric($id)) {
            $this->sendError('ID de tarea inválido', 400);
        }

        // Validar datos
        if (!$data) {
            $this->sendError('Datos JSON inválidos', 400);
        }

        $errors = Task::validate($data, true);
        if (!empty($errors)) {
            $this->sendError(implode('. ', $errors), 400);
        }

        // Verificar que la tarea existe
        if (!$this->taskModel->exists($id)) {
            $this->sendError('Tarea no encontrada', 404);
        }

        try {
            $updatedTask = $this->taskModel->update(
                $id,
                $data['description'],
                $data['status'],
                $data['priority']
            );
            $this->sendSuccess($updatedTask);
        } catch (Exception $e) {
            $this->sendError('Error al actualizar tarea: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Actualizar campos específicos de una tarea
     */
    public function patch($id, $data) {
        // Validar ID
        if (!$id || !is_numeric($id)) {
            $this->sendError('ID de tarea inválido', 400);
        }

        // Validar datos
        if (!$data) {
            $this->sendError('Datos JSON inválidos', 400);
        }

        // Verificar que la tarea existe
        if (!$this->taskModel->exists($id)) {
            $this->sendError('Tarea no encontrada', 404);
        }

        // Validar solo los campos que se están actualizando
        $errors = Task::validate($data, false);
        if (!empty($errors)) {
            $this->sendError(implode('. ', $errors), 400);
        }

        try {
            $updatedTask = $this->taskModel->patch($id, $data);
            $this->sendSuccess($updatedTask);
        } catch (Exception $e) {
            $this->sendError('Error al actualizar tarea: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Eliminar una tarea
     */
    public function destroy($id) {
        // Validar ID
        if (!$id || !is_numeric($id)) {
            $this->sendError('ID de tarea inválido', 400);
        }

        // Verificar que la tarea existe
        if (!$this->taskModel->exists($id)) {
            $this->sendError('Tarea no encontrada', 404);
        }

        try {
            $result = $this->taskModel->delete($id);
            $this->sendSuccess($result);
        } catch (Exception $e) {
            $this->sendError('Error al eliminar tarea: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Enviar respuesta de error
     */
    private function sendError($message, $code = 400) {
        http_response_code($code);
        echo json_encode(['error' => $message]);
        exit;
    }

    /**
     * Enviar respuesta exitosa
     */
    private function sendSuccess($data, $code = 200) {
        http_response_code($code);
        echo json_encode($data);
        exit;
    }
}
