document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let currentPage = 1;
    const totalPages = 5;
    let registros = JSON.parse(localStorage.getItem('registrosMedicos')) || [];
    let editingIndex = null;
    let editingFamiliarIndex = null;
    
    // Elementos del DOM
    const pages = document.querySelectorAll('.form-page');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const saveBtn = document.getElementById('saveBtn');
    const addFamiliarBtn = document.getElementById('addFamiliar');
    const addCondicionBtn = document.getElementById('addCondicion');
    const addInternamientoBtn = document.getElementById('addInternamiento');
    const familiaresContainer = document.getElementById('familiaresContainer');
    const condicionesContainer = document.getElementById('condicionesContainer');
    const internamientosContainer = document.getElementById('internamientosContainer');
    const resumenContainer = document.getElementById('resumenContainer');
    const registrosList = document.getElementById('registrosList');
    
    // Modal elements
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Editar Familiar</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label>Nombre Completo:</label>
                    <input type="text" id="modalFamiliarNombre" required>
                </div>
                <div class="form-group">
                    <label>Parentesco:</label>
                    <input type="text" id="modalFamiliarParentesco" required>
                </div>
                <div class="form-group">
                    <label>Edad:</label>
                    <input type="number" id="modalFamiliarEdad" required>
                </div>
            </div>
            <div class="modal-actions">
                <button class="cancel-modal-btn">Cancelar</button>
                <button class="save-modal-btn">Guardar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Plantillas
    const familiarTemplate = document.getElementById('familiarTemplate');
    const condicionTemplate = document.getElementById('condicionTemplate');
    const internamientoTemplate = document.getElementById('internamientoTemplate');
    const registroTemplate = document.getElementById('registroTemplate');
    
    // Inicializar la aplicación
    init();
    
    function init() {
        showPage(currentPage);
        loadRegistros();
        
        // Event listeners para navegación
        nextButtons.forEach(btn => {
            btn.addEventListener('click', nextPage);
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', prevPage);
        });
        
        // Event listeners para botones de acción
        saveBtn.addEventListener('click', saveRegistro);
        addFamiliarBtn.addEventListener('click', addFamiliar);
        addCondicionBtn.addEventListener('click', addCondicion);
        addInternamientoBtn.addEventListener('click', addInternamiento);
        
        // Event listeners para el modal
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('.cancel-modal-btn').addEventListener('click', closeModal);
        modal.querySelector('.save-modal-btn').addEventListener('click', saveFamiliarModal);
        
        // Delegación de eventos para botones en elementos dinámicos
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('remove-btn')) {
                e.target.closest('.dynamic-item').remove();
            }
            
            if (e.target.classList.contains('edit-item-btn')) {
                const item = e.target.closest('.dynamic-item');
                const index = Array.from(item.parentNode.children).indexOf(item);
                editFamiliar(item, index);
            }
            
            if (e.target.classList.contains('save-item-btn')) {
                const item = e.target.closest('.dynamic-item');
                const index = Array.from(item.parentNode.children).indexOf(item);
                saveFamiliar(item, index);
            }
        });
    }
    
    // Navegación entre páginas
    function showPage(pageNumber) {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(`page${pageNumber}`).classList.add('active');
        currentPage = pageNumber;
        
        // Si estamos en la página 5, generar el resumen
        if (pageNumber === 5) {
            generateResumen();
        }
    }
    
    function nextPage() {
        if (validateCurrentPage()) {
            if (currentPage < totalPages) {
                showPage(currentPage + 1);
            }
        }
    }
    
    function prevPage() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    }
    
    // Validación de página actual
    function validateCurrentPage() {
        switch(currentPage) {
            case 1:
                const requiredInputs = document.querySelectorAll('#personalForm [required]');
                for (let input of requiredInputs) {
                    if (!input.value.trim()) {
                        alert(`Por favor complete el campo: ${input.previousElementSibling.textContent}`);
                        input.focus();
                        return false;
                    }
                }
                return true;
                
            case 2:
                if (familiaresContainer.children.length === 0) {
                    alert('Por favor agregue al menos un familiar');
                    return false;
                }
                return true;
                
            case 3:
                if (condicionesContainer.children.length === 0) {
                    alert('Por favor agregue al menos una condición pre-existente');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }
    
    // Funciones para agregar elementos dinámicos
    function addFamiliar() {
        const clone = familiarTemplate.content.cloneNode(true);
        const familiarElement = clone.querySelector('.dynamic-item');
        
        // Agregar botones de guardar y editar
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';
        actionsDiv.innerHTML = `
            <button class="edit-item-btn">Editar</button>
            <button class="save-item-btn" style="display:none">Guardar</button>
            <button class="remove-btn">Eliminar</button>
        `;
        
        familiarElement.appendChild(actionsDiv);
        familiaresContainer.appendChild(familiarElement);
    }
    
    function addCondicion() {
        const clone = condicionTemplate.content.cloneNode(true);
        condicionesContainer.appendChild(clone);
    }
    
    function addInternamiento() {
        const clone = internamientoTemplate.content.cloneNode(true);
        internamientosContainer.appendChild(clone);
    }
    
    // Editar familiar (abre modal)
    function editFamiliar(item, index) {
        editingFamiliarIndex = index;
        
        // Llenar el modal con los datos del familiar
        const nombre = item.querySelector('.familiar-nombre').value;
        const parentesco = item.querySelector('.familiar-parentesco').value;
        const edad = item.querySelector('.familiar-edad').value;
        
        document.getElementById('modalFamiliarNombre').value = nombre;
        document.getElementById('modalFamiliarParentesco').value = parentesco;
        document.getElementById('modalFamiliarEdad').value = edad;
        
        // Mostrar el modal
        modal.style.display = 'flex';
    }
    
    // Guardar familiar desde el modal
    function saveFamiliarModal() {
        const nombre = document.getElementById('modalFamiliarNombre').value;
        const parentesco = document.getElementById('modalFamiliarParentesco').value;
        const edad = document.getElementById('modalFamiliarEdad').value;
        
        if (!nombre || !parentesco || !edad) {
            alert('Por favor complete todos los campos');
            return;
        }
        
        const familiarElement = familiaresContainer.children[editingFamiliarIndex];
        familiarElement.querySelector('.familiar-nombre').value = nombre;
        familiarElement.querySelector('.familiar-parentesco').value = parentesco;
        familiarElement.querySelector('.familiar-edad').value = edad;
        
        closeModal();
    }
    
    // Guardar familiar directamente (sin modal)
    function saveFamiliar(item, index) {
        const nombre = item.querySelector('.familiar-nombre').value;
        const parentesco = item.querySelector('.familiar-parentesco').value;
        const edad = item.querySelector('.familiar-edad').value;
        
        if (!nombre || !parentesco || !edad) {
            alert('Por favor complete todos los campos');
            return;
        }
        
        // Ocultar botón guardar y mostrar editar
        item.querySelector('.save-item-btn').style.display = 'none';
        item.querySelector('.edit-item-btn').style.display = 'inline-block';
        
        // Deshabilitar campos
        item.querySelectorAll('input').forEach(input => {
            input.disabled = true;
        });
    }
    
    function closeModal() {
        modal.style.display = 'none';
        editingFamiliarIndex = null;
    }
    
    // Generar resumen de datos
    function generateResumen() {
        // Obtener datos personales
        const personalData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            genero: document.getElementById('genero').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            direccion: document.getElementById('direccion').value
        };
        
        // Obtener familiares
        const familiares = [];
        const familiarElements = familiaresContainer.querySelectorAll('.dynamic-item');
        familiarElements.forEach(el => {
            familiares.push({
                nombre: el.querySelector('.familiar-nombre').value,
                parentesco: el.querySelector('.familiar-parentesco').value,
                edad: el.querySelector('.familiar-edad').value
            });
        });
        
        // Obtener condiciones pre-existentes
        const condiciones = [];
        const condicionElements = condicionesContainer.querySelectorAll('.dynamic-item');
        condicionElements.forEach(el => {
            condiciones.push({
                enfermedad: el.querySelector('.condicion-enfermedad').value,
                tiempo: el.querySelector('.condicion-tiempo').value
            });
        });
        
        // Obtener internamientos
        const internamientos = [];
        const internamientoElements = internamientosContainer.querySelectorAll('.dynamic-item');
        internamientoElements.forEach(el => {
            internamientos.push({
                fecha: el.querySelector('.internamiento-fecha').value,
                centro: el.querySelector('.internamiento-centro').value,
                diagnostico: el.querySelector('.internamiento-diagnostico').value
            });
        });
        
        // Generar HTML del resumen
        let html = `
            <div class="resumen-section">
                <h3>Datos Personales</h3>
                <p><strong>Nombre:</strong> ${personalData.nombre} ${personalData.apellido}</p>
                <p><strong>Edad:</strong> ${personalData.edad}</p>
                <p><strong>Género:</strong> ${personalData.genero}</p>
                <p><strong>Teléfono:</strong> ${personalData.telefono || 'No especificado'}</p>
                <p><strong>Email:</strong> ${personalData.email || 'No especificado'}</p>
                <p><strong>Dirección:</strong> ${personalData.direccion || 'No especificado'}</p>
            </div>
            
            <div class="resumen-section">
                <h3>Familiares (${familiares.length})</h3>
        `;
        
        familiares.forEach(f => {
            html += `
                <p><strong>${f.nombre}</strong> - ${f.parentesco}, ${f.edad} años</p>
            `;
        });
        
        html += `
            </div>
            
            <div class="resumen-section">
                <h3>Condiciones Pre-Existentes (${condiciones.length})</h3>
        `;
        
        condiciones.forEach(c => {
            html += `
                <p><strong>${c.enfermedad}</strong> - ${c.tiempo} años</p>
            `;
        });
        
        html += `
            </div>
            
            <div class="resumen-section">
                <h3>Internamientos (${internamientos.length})</h3>
        `;
        
        internamientos.forEach(i => {
            const fecha = i.fecha ? new Date(i.fecha).toLocaleDateString() : 'No especificada';
            html += `
                <p><strong>${fecha}</strong> - ${i.centro}</p>
                <p><em>Diagnóstico:</em> ${i.diagnostico}</p>
                <hr>
            `;
        });
        
        html += `</div>`;
        
        resumenContainer.innerHTML = html;
    }
    
    // Guardar registro
    function saveRegistro() {
        // Obtener todos los datos
        const personalData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            genero: document.getElementById('genero').value,
            telefono: document.getElementById('telefono').value,
            email: document.getElementById('email').value,
            direccion: document.getElementById('direccion').value
        };
        
        const familiares = [];
        const familiarElements = familiaresContainer.querySelectorAll('.dynamic-item');
        familiarElements.forEach(el => {
            familiares.push({
                nombre: el.querySelector('.familiar-nombre').value,
                parentesco: el.querySelector('.familiar-parentesco').value,
                edad: el.querySelector('.familiar-edad').value
            });
        });
        
        const condiciones = [];
        const condicionElements = condicionesContainer.querySelectorAll('.dynamic-item');
        condicionElements.forEach(el => {
            condiciones.push({
                enfermedad: el.querySelector('.condicion-enfermedad').value,
                tiempo: el.querySelector('.condicion-tiempo').value
            });
        });
        
        const internamientos = [];
        const internamientoElements = internamientosContainer.querySelectorAll('.dynamic-item');
        internamientoElements.forEach(el => {
            internamientos.push({
                fecha: el.querySelector('.internamiento-fecha').value,
                centro: el.querySelector('.internamiento-centro').value,
                diagnostico: el.querySelector('.internamiento-diagnostico').value
            });
        });
        
        // Crear objeto de registro completo
        const registro = {
            personal: personalData,
            familiares: familiares,
            condiciones: condiciones,
            internamientos: internamientos,
            fechaRegistro: new Date().toISOString()
        };
        
        // Guardar o actualizar el registro
        if (editingIndex !== null) {
            registros[editingIndex] = registro;
            editingIndex = null;
        } else {
            registros.push(registro);
        }
        
        // Guardar en localStorage
        localStorage.setItem('registrosMedicos', JSON.stringify(registros));
        
        // Mostrar mensaje y resetear formulario
        alert('Registro guardado exitosamente');
        resetForm();
        loadRegistros();
        showPage(1);
    }
    
    // Cargar registros guardados
    function loadRegistros() {
        registrosList.innerHTML = '';
        
        if (registros.length === 0) {
            registrosList.innerHTML = '<p>No hay registros guardados</p>';
            return;
        }
        
        registros.forEach((registro, index) => {
            const clone = registroTemplate.content.cloneNode(true);
            
            clone.querySelector('.registro-nombre').textContent = registro.personal.nombre;
            clone.querySelector('.registro-apellido').textContent = registro.personal.apellido;
            clone.querySelector('.registro-edad').textContent = registro.personal.edad;
            
            const editBtn = clone.querySelector('.edit-btn');
            const deleteBtn = clone.querySelector('.delete-btn');
            const viewBtn = clone.querySelector('.view-btn');
            
            editBtn.addEventListener('click', () => editRegistro(index));
            deleteBtn.addEventListener('click', () => deleteRegistro(index));
            viewBtn.addEventListener('click', () => viewRegistro(index));
            
            registrosList.appendChild(clone);
        });
    }
    
    // Editar registro
    function editRegistro(index) {
        editingIndex = index;
        const registro = registros[index];
        
        // Llenar datos personales
        document.getElementById('nombre').value = registro.personal.nombre;
        document.getElementById('apellido').value = registro.personal.apellido;
        document.getElementById('edad').value = registro.personal.edad;
        document.getElementById('genero').value = registro.personal.genero;
        document.getElementById('telefono').value = registro.personal.telefono;
        document.getElementById('email').value = registro.personal.email;
        document.getElementById('direccion').value = registro.personal.direccion;
        
        // Limpiar contenedores
        familiaresContainer.innerHTML = '';
        condicionesContainer.innerHTML = '';
        internamientosContainer.innerHTML = '';
        
        // Llenar familiares
        registro.familiares.forEach(familiar => {
            addFamiliar();
            const lastFamiliar = familiaresContainer.lastElementChild;
            lastFamiliar.querySelector('.familiar-nombre').value = familiar.nombre;
            lastFamiliar.querySelector('.familiar-parentesco').value = familiar.parentesco;
            lastFamiliar.querySelector('.familiar-edad').value = familiar.edad;
            
            // Deshabilitar campos y ocultar botón guardar
            lastFamiliar.querySelectorAll('input').forEach(input => {
                input.disabled = true;
            });
            lastFamiliar.querySelector('.save-item-btn').style.display = 'none';
        });
        
        // Llenar condiciones
        registro.condiciones.forEach(condicion => {
            addCondicion();
            const lastCondicion = condicionesContainer.lastElementChild;
            lastCondicion.querySelector('.condicion-enfermedad').value = condicion.enfermedad;
            lastCondicion.querySelector('.condicion-tiempo').value = condicion.tiempo;
        });
        
        // Llenar internamientos
        registro.internamientos.forEach(internamiento => {
            addInternamiento();
            const lastInternamiento = internamientosContainer.lastElementChild;
            lastInternamiento.querySelector('.internamiento-fecha').value = internamiento.fecha;
            lastInternamiento.querySelector('.internamiento-centro').value = internamiento.centro;
            lastInternamiento.querySelector('.internamiento-diagnostico').value = internamiento.diagnostico;
        });
        
        // Ir a la primera página
        showPage(1);
    }
    
    // Eliminar registro
    function deleteRegistro(index) {
        if (confirm('¿Está seguro que desea eliminar este registro?')) {
            registros.splice(index, 1);
            localStorage.setItem('registrosMedicos', JSON.stringify(registros));
            loadRegistros();
        }
    }
    
    // Ver registro completo
    function viewRegistro(index) {
        const registro = registros[index];
        
        let html = `
            <div class="resumen-section">
                <h3>Datos Personales</h3>
                <p><strong>Nombre:</strong> ${registro.personal.nombre} ${registro.personal.apellido}</p>
                <p><strong>Edad:</strong> ${registro.personal.edad}</p>
                <p><strong>Género:</strong> ${registro.personal.genero}</p>
                <p><strong>Teléfono:</strong> ${registro.personal.telefono || 'No especificado'}</p>
                <p><strong>Email:</strong> ${registro.personal.email || 'No especificado'}</p>
                <p><strong>Dirección:</strong> ${registro.personal.direccion || 'No especificado'}</p>
                <p><strong>Fecha de registro:</strong> ${new Date(registro.fechaRegistro).toLocaleString()}</p>
            </div>
            
            <div class="resumen-section">
                <h3>Familiares (${registro.familiares.length})</h3>
        `;
        
        registro.familiares.forEach(f => {
            html += `
                <p><strong>${f.nombre}</strong> - ${f.parentesco}, ${f.edad} años</p>
            `;
        });
        
        html += `
            </div>
            
            <div class="resumen-section">
                <h3>Condiciones Pre-Existentes (${registro.condiciones.length})</h3>
        `;
        
        registro.condiciones.forEach(c => {
            html += `
                <p><strong>${c.enfermedad}</strong> - ${c.tiempo} años</p>
            `;
        });
        
        html += `
            </div>
            
            <div class="resumen-section">
                <h3>Internamientos (${registro.internamientos.length})</h3>
        `;
        
        registro.internamientos.forEach(i => {
            const fecha = i.fecha ? new Date(i.fecha).toLocaleDateString() : 'No especificada';
            html += `
                <p><strong>${fecha}</strong> - ${i.centro}</p>
                <p><em>Diagnóstico:</em> ${i.diagnostico}</p>
                <hr>
            `;
        });
        
        html += `</div>`;
        
        // Mostrar en un modal
        const viewModal = document.createElement('div');
        viewModal.className = 'modal';
        viewModal.innerHTML = `
            <div class="modal-content" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3>Detalles del Registro</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    ${html}
                </div>
                <div class="modal-actions">
                    <button class="close-modal-btn">Cerrar</button>
                </div>
            </div>
        `;
        
        viewModal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(viewModal);
        });
        
        viewModal.querySelector('.close-modal-btn').addEventListener('click', () => {
            document.body.removeChild(viewModal);
        });
        
        document.body.appendChild(viewModal);
    }
    
    // Resetear formulario
    function resetForm() {
        document.getElementById('personalForm').reset();
        familiaresContainer.innerHTML = '';
        condicionesContainer.innerHTML = '';
        internamientosContainer.innerHTML = '';
        editingIndex = null;
    }
});