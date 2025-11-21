// ============================================
// FUNCIONALIDAD DE DRAG AND DROP (ARRASTRAR Y SOLTAR)
// ============================================
let draggedElement = null; // Declaro una variable para almacenar el elemento que estoy arrastrando

// Función que se ejecuta cuando empiezo a arrastrar un elemento
function handleDragStart(e) {
    draggedElement = e.target; // Guardo el elemento que estoy arrastrando
    e.target.classList.add('dragging'); // Agrego una clase para cambiar su apariencia visual mientras se arrastra
    e.dataTransfer.effectAllowed = 'move'; // Indico que quiero mover el elemento
    e.dataTransfer.setData('text/html', e.target.innerHTML); // Guardo el contenido HTML del elemento arrastrado
}

// Función que se ejecuta cuando dejo de arrastrar el elemento
function handleDragEnd(e) {
    e.target.classList.remove('dragging'); // Quito la clase 'dragging' para restaurar su apariencia normal
}

// Función que se ejecuta cuando estoy arrastrando el elemento sobre un área donde puedo soltarlo
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Evito el comportamiento por defecto del navegador (como no permitir el "drop")
    }
    e.dataTransfer.dropEffect = 'move'; // Establezco el efecto visual que indica que puedo mover el elemento

    const column = e.target.closest('.column'); // Busco la columna más cercana sobre la que estoy arrastrando el elemento
    if (column) {
        column.classList.add('drag-over'); // Agrego una clase 'drag-over' para resaltar visualmente la columna
    }

    return false; // Prevengo que se ejecute cualquier otra acción por defecto
}

// Función que se ejecuta cuando el elemento arrastrado deja de estar sobre la zona de "drop"
function handleDragLeave(e) {
    const column = e.target.closest('.column'); // Busco la columna sobre la que estoy dejando de arrastrar
    if (column) {
        column.classList.remove('drag-over'); // Quito la clase 'drag-over' para dejar de resaltar la columna
    }
}

// Función que se ejecuta cuando suelto el elemento arrastrado sobre un área válida
async function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // Prevengo que el evento se propague a otros elementos
    }

    const column = e.target.closest('.column'); // Busco la columna más cercana donde se soltó el elemento
    if (column) {
        column.classList.remove('drag-over'); // Quito la clase 'drag-over' de la columna, ya que el "drop" ha ocurrido
    }

    if (draggedElement) { // Verifico que realmente haya un elemento arrastrado
        const container = e.target.closest('.tasks-container'); // Busco el contenedor donde se soltó el elemento
        if (container) {
            const newStatus = container.dataset.status; // Obtengo el nuevo estado del contenedor (por ejemplo, "en progreso")
            const taskId = draggedElement.dataset.id; // Obtengo el ID de la tarea arrastrada
            const oldStatus = draggedElement.dataset.status; // Obtengo el estado anterior de la tarea

            if (newStatus !== oldStatus) { // Si el estado de la tarea ha cambiado
                try {
                    // Intento actualizar la tarea en el servidor con el nuevo estado
                    await TaskAPI.patchTask(taskId, { status: newStatus });
                    await loadTasks(); // Vuelvo a cargar las tareas para reflejar el cambio
                    showSuccess('Tarea movida correctamente'); // Muestra un mensaje de éxito
                } catch (error) {
                    showError('Error al mover la tarea: ' + error.message); // Muestra un mensaje de error si algo falla
                }
            }
        }
    }

    return false; // Prevengo que se ejecute cualquier otra acción por defecto
}
