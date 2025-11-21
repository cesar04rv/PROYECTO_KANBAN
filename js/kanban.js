// ============================================
// LÓGICA DEL TABLERO KANBAN
// ============================================
let currentEditId = null; // Declaro una variable para almacenar el ID de la tarea que estoy editando

// Función para cargar las tareas desde el servidor y renderizarlas en el tablero Kanban
async function loadTasks() {
    try {
        // Muestra el indicador de carga y oculta el tablero mientras se cargan las tareas
        document.getElementById('loadingContainer').style.display = 'block';
        document.getElementById('kanbanBoard').style.display = 'none';
        
        // Obtengo las tareas desde la API
        const tasks = await TaskAPI.getTasks();
        renderTasks(tasks); // Llamo a la función que se encarga de mostrar las tareas

        // Vuelvo a mostrar el tablero Kanban y oculto el indicador de carga
        document.getElementById('loadingContainer').style.display = 'none';
        document.getElementById('kanbanBoard').style.display = 'grid';
    } catch (error) {
        // Si ocurre un error, muestro el mensaje de error
        showError('Error al cargar las tareas: ' + error.message);
        document.getElementById('loadingContainer').style.display = 'none'; // Aseguro que el contenedor de carga se oculte
    }
}

// Función para renderizar las tareas en el tablero Kanban, organizándolas por estado
function renderTasks(tasks) {
    // Borro las tareas anteriores de cada contenedor
    document.querySelectorAll('.tasks-container').forEach(container => {
        container.innerHTML = '';
    });

    // Creo un objeto para organizar las tareas por su estado
    const tasksByStatus = {
        'Some day': [],
        'To do': [],
        'In progress': [],
        'Done': []
    };

    // Agrupo las tareas según su estado
    tasks.forEach(task => {
        if (tasksByStatus[task.status]) {
            tasksByStatus[task.status].push(task);
        }
    });

    // Para cada estado de tarea, coloco las tareas en el contenedor correspondiente
    Object.keys(tasksByStatus).forEach(status => {
        const container = document.querySelector(`.tasks-container[data-status="${status}"]`);
        const tasks = tasksByStatus[status];
        
        const column = container.closest('.column');
        const counter = column.querySelector('.task-count');
        counter.textContent = tasks.length; // Actualizo el contador de tareas por columna

        tasks.forEach(task => {
            const taskCard = createTaskCard(task); // Creo la tarjeta de la tarea
            container.appendChild(taskCard); // Agrego la tarjeta al contenedor
        });
    });
}

// Función para crear una tarjeta de tarea con la información correspondiente
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority}`; // Defino la clase según la prioridad de la tarea
    card.draggable = true; // Hago que la tarjeta sea arrastrable
    card.dataset.id = task.id; // Asigno el ID de la tarea como un dato de la tarjeta
    card.dataset.status = task.status; // Asigno el estado de la tarea como un dato de la tarjeta

    // Defino el HTML dentro de la tarjeta con la descripción y acciones
    card.innerHTML = `
        <div class="task-description">${escapeHtml(task.description)}</div>
        <div class="task-footer">
            <span class="priority-badge priority-${task.priority}">
                ${task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
                ${task.priority}
            </span>
            <div class="task-actions">
                <button class="btn-icon btn-edit" onclick="openEditModal(${task.id})" title="Editar">✏️</button>
                <button class="btn-icon btn-delete" onclick="deleteTask(${task.id})" title="Eliminar">🗑️</button>
            </div>
        </div>
    `;

    // Añadimos los eventos de arrastrar y soltar
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card; // Retorno la tarjeta creada
}

// Función para manejar la adición de una nueva tarea
async function handleAddTask(e) {
    e.preventDefault(); // Prevenimos el comportamiento por defecto del formulario
    
    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;

    // Verifico si la descripción está vacía
    if (!description) {
        showError('La descripción no puede estar vacía');
        return;
    }

    try {
        // Intento crear la tarea a través de la API
        await TaskAPI.createTask(description, status, priority);
        document.getElementById('addTaskForm').reset(); // Reseteo el formulario
        await loadTasks(); // Vuelvo a cargar las tareas
        showSuccess('Tarea creada correctamente');
    } catch (error) {
        showError('Error al crear la tarea: ' + error.message);
    }
}

// Función para abrir el modal de edición de una tarea
function openEditModal(id) {
    const card = document.querySelector(`[data-id="${id}"]`); // Busco la tarjeta de la tarea
    const description = card.querySelector('.task-description').textContent;
    const priority = card.className.match(/priority-(\w+)/)[1]; // Extraigo la prioridad de la clase
    const status = card.dataset.status;

    currentEditId = id; // Almaceno el ID de la tarea que estoy editando
    document.getElementById('editDescription').value = description;
    document.getElementById('editStatus').value = status;
    document.getElementById('editPriority').value = priority;
    document.getElementById('editModal').classList.add('active'); // Muestro el modal
}

// Función para cerrar el modal de edición
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditId = null; // Limpio el ID de la tarea que estaba editando
}

// Función para guardar los cambios de una tarea después de la edición
async function saveTask() {
    if (!currentEditId) return; // Si no hay tarea editada, no hago nada

    const description = document.getElementById('editDescription').value.trim();
    const status = document.getElementById('editStatus').value;
    const priority = document.getElementById('editPriority').value;

    // Verifico si la descripción está vacía
    if (!description) {
        showError('La descripción no puede estar vacía');
        return;
    }

    try {
        // Intento actualizar la tarea a través de la API
        await TaskAPI.updateTask(currentEditId, description, status, priority);
        closeEditModal(); // Cierro el modal
        await loadTasks(); // Vuelvo a cargar las tareas
        showSuccess('Tarea actualizada correctamente');
    } catch (error) {
        showError('Error al actualizar la tarea: ' + error.message);
    }
}

// Función para eliminar una tarea
async function deleteTask(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) { // Confirmo la eliminación
        return;
    }

    try {
        // Intento eliminar la tarea a través de la API
        await TaskAPI.deleteTask(id);
        await loadTasks(); // Vuelvo a cargar las tareas
        showSuccess('Tarea eliminada correctamente');
    } catch (error) {
        showError('Error al eliminar la tarea: ' + error.message);
    }
}

// FUNCIONES AUXILIARES

// Función para escapar caracteres HTML en una cadena de texto
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función para mostrar un mensaje de error
function showError(message) {
    const container = document.getElementById('errorContainer');
    container.innerHTML = `<div class="error">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = ''; // Elimino el mensaje de error después de 5 segundos
    }, 5000);
}

// Función para mostrar un mensaje de éxito
function showSuccess(message) {
    const container = document.getElementById('errorContainer');
    container.innerHTML = `<div class="error" style="background: #e8f5e9; color: #2e7d32; border-left-color: #4caf50;">${message}</div>`;
    setTimeout(() => {
        container.innerHTML = ''; // Elimino el mensaje de éxito después de 3 segundos
    }, 3000);
}
