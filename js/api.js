// ============================================
// CLASE API
// ============================================
const API_URL = 'http://localhost/php/api/tasks.php'; // URL donde se encuentran las tareas en el servidor

class TaskAPI {
    // Función para validar los datos de la tarea antes de hacer cualquier operación
    static validateTask(description, status, priority) {
        // Verifico que la descripción sea una cadena de texto no vacía
        if (!description || typeof description !== 'string') {
            throw new Error('La descripción debe ser un texto válido.');
        }

        // Verifico que el estado sea uno de los valores permitidos
        const validStatus = ['Some day', 'To do', 'In progress', 'Done'];
        if (status && !validStatus.includes(status)) {
            throw new Error(`Estado inválido. Valores permitidos: ${validStatus.join(', ')}`);
        }

        // Verifico que la prioridad sea uno de los valores permitidos
        const validPriority = ['low', 'medium', 'high'];
        if (priority && !validPriority.includes(priority)) {
            throw new Error(`Prioridad inválida. Valores permitidos: ${validPriority.join(', ')}`);
        }
    }

    // Función para manejar la respuesta de la API
    static async handleResponse(response) {
        // Si la respuesta no es correcta (código de estado diferente a 2xx), lanzo un error
        if (!response.ok) {
            const errorText = await response.text(); // Extraigo el mensaje de error del servidor
            throw new Error(`Error HTTP ${response.status}: ${errorText || 'Respuesta no válida'}`);
        }

        // Si la respuesta es válida, intento convertirla en JSON
        try {
            return await response.json();
        } catch {
            // Si la conversión falla, lanzo un error
            throw new Error('La respuesta del servidor no es JSON válido.');
        }
    }

    // Función para obtener todas las tareas desde la API
    static async getTasks() {
        try {
            // Hago la solicitud GET para obtener las tareas
            const response = await fetch(API_URL);
            // Paso la respuesta a la función que la valida y la convierte en JSON
            return await this.handleResponse(response);
        } catch (err) {
            console.error('Error al obtener tareas:', err.message); // Si ocurre un error, lo imprimo en la consola
            throw err; // Lanza el error para que el código que llamó a esta función pueda manejarlo
        }
    }

    // Función para crear una nueva tarea
    static async createTask(description, status = 'Some day', priority = 'medium') {
        // Valido los datos antes de enviarlos
        this.validateTask(description, status, priority);

        try {
            // Hago una solicitud POST para crear la tarea en el servidor
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, status, priority }) // Paso los datos de la tarea en el cuerpo de la solicitud
            });
            // Valido y obtengo la respuesta
            return await this.handleResponse(response);
        } catch (err) {
            console.error('Error al crear tarea:', err.message); // Si ocurre un error, lo imprimo en la consola
            throw err; // Lanza el error
        }
    }

    // Función para actualizar una tarea existente
    static async updateTask(id, description, status, priority) {
        // Valido los datos antes de enviarlos
        this.validateTask(description, status, priority);

        try {
            // Hago una solicitud PUT para actualizar la tarea en el servidor
            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, status, priority }) // Paso los datos de la tarea en el cuerpo de la solicitud
            });
            // Valido y obtengo la respuesta
            return await this.handleResponse(response);
        } catch (err) {
            console.error(`Error al actualizar tarea ${id}:`, err.message); // Si ocurre un error, lo imprimo en la consola
            throw err; // Lanza el error
        }
    }

    // Función para hacer una actualización parcial de una tarea (por ejemplo, cambiar solo el estado)
    static async patchTask(id, fields) {
        try {
            // Hago una solicitud PATCH para actualizar parcialmente la tarea en el servidor
            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fields) // Paso solo los campos que quiero actualizar
            });
            // Valido y obtengo la respuesta
            return await this.handleResponse(response);
        } catch (err) {
            console.error(`Error al actualizar parcialmente tarea ${id}:`, err.message); // Si ocurre un error, lo imprimo en la consola
            throw err; // Lanza el error
        }
    }

    // Función para eliminar una tarea
    static async deleteTask(id) {
        try {
            // Hago una solicitud DELETE para eliminar la tarea en el servidor
            const response = await fetch(`${API_URL}?id=${id}`, {
                method: 'DELETE'
            });
            // Valido y obtengo la respuesta
            return await this.handleResponse(response);
        } catch (err) {
            console.error(`Error al eliminar tarea ${id}:`, err.message); // Si ocurre un error, lo imprimo en la consola
            throw err; // Lanza el error
        }
    }
}
