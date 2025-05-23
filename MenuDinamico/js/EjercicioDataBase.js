// Database simulation (in a real app, this would be API calls to a backend)
let database = {
    records: [],
    settings: {
        dbType: 'mysql',
        dbHost: 'localhost',
        dbPort: '3306',
        dbName: 'mi_base_de_datos_rd',
        dbUser: 'root',
        dbPassword: ''
    },
    backups: []
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load sample data if localStorage is empty
    if (!localStorage.getItem('database')) {
        loadSampleData();
    } else {
        database = JSON.parse(localStorage.getItem('database'));
    }
    
    // Initialize UI components
    initNavigation();
    initForms();
    initModals();
    
    // Show dashboard by default
    showSection('dashboard-section');
    updateDashboard();
    updateStats();
    
    // Load records table
    loadRecordsTable();
});

// Load sample data for demonstration with RD-specific data
function loadSampleData() {
    const sampleRecords = [
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan.perez@example.com',
            telefono: '8091234567',
            fecha_nacimiento: '1985-05-15',
            direccion: 'Calle Principal 123, Santo Domingo Este',
            ciudad: 'Santo Domingo',
            pais: 'DO',
            cedula: '001-1234567-8',
            estatus: 1,
            notas: 'Cliente preferente',
            created_at: '2023-01-10T09:30:00',
            updated_at: '2023-01-10T09:30:00'
        },
        {
            id: 2,
            nombre: 'María García',
            email: 'maria.garcia@example.com',
            telefono: '8299876543',
            fecha_nacimiento: '1990-08-22',
            direccion: 'Avenida Estrella Sadhalá, Santiago',
            ciudad: 'Santiago',
            pais: 'DO',
            cedula: '002-7654321-9',
            estatus: 1,
            notas: '',
            created_at: '2023-02-15T14:20:00',
            updated_at: '2023-02-15T14:20:00'
        },
        {
            id: 3,
            nombre: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@example.com',
            telefono: '8494567890',
            fecha_nacimiento: '1978-11-30',
            direccion: 'Calle Duarte #45, La Vega',
            ciudad: 'La Vega',
            pais: 'DO',
            cedula: '003-9876543-2',
            estatus: 0,
            notas: 'Cliente inactivo desde hace 6 meses',
            created_at: '2022-11-05T10:15:00',
            updated_at: '2023-03-20T16:45:00'
        },
        {
            id: 4,
            nombre: 'Ana Martínez',
            email: 'ana.martinez@example.com',
            telefono: '8097890123',
            fecha_nacimiento: '1995-04-18',
            direccion: 'Avenida Circunvalación, San Pedro de Macorís',
            ciudad: 'San Pedro de Macorís',
            pais: 'DO',
            cedula: '004-5678901-2',
            estatus: 1,
            notas: 'Nuevo cliente',
            created_at: '2023-04-01T11:00:00',
            updated_at: '2023-04-01T11:00:00'
        },
        {
            id: 5,
            nombre: 'Roberto Sánchez',
            email: 'roberto.sanchez@example.com',
            telefono: '8092345678',
            fecha_nacimiento: '1982-07-25',
            direccion: 'Calle Sánchez #202, La Romana',
            ciudad: 'La Romana',
            pais: 'DO',
            cedula: '005-3456789-0',
            estatus: 1,
            notas: '',
            created_at: '2023-03-12T13:45:00',
            updated_at: '2023-03-12T13:45:00'
        }
    ];
    
    database.records = sampleRecords;
    saveDatabase();
}

// Save database to localStorage
function saveDatabase() {
    localStorage.setItem('database', JSON.stringify(database));
}

// Initialize navigation between sections
function initNavigation() {
    document.getElementById('dashboard-link').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('dashboard-section');
        updateDashboard();
    });
    
    document.getElementById('insert-link').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('insert-section');
    });
    
    document.getElementById('view-link').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('view-section');
        loadRecordsTable();
    });
    
    document.getElementById('search-link').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('search-section');
    });
    
    document.getElementById('reports-link').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('reports-section');
        generateReports();
    });
    
    document.getElementById('settings-link').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('settings-section');
        loadDBSettings();
    });
}

// Show a specific section and hide others
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the requested section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update active link in sidebar
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find the corresponding link and activate it
    const activeLink = document.querySelector(`.sidebar .nav-link[href="#"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initialize form event listeners
function initForms() {
    // Insert form
    document.getElementById('insert-form').addEventListener('submit', function(e) {
        e.preventDefault();
        insertRecord();
    });
    
    // Search form
    document.getElementById('search-form').addEventListener('submit', function(e) {
        e.preventDefault();
        searchRecords();
    });
    
    // Report filter form
    document.getElementById('report-filter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        generateReports();
    });
    
    // Reset report filters
    document.getElementById('reset-report-filters').addEventListener('click', function() {
        document.getElementById('report-start-date').value = '';
        document.getElementById('report-end-date').value = '';
        document.getElementById('report-status').value = 'all';
        document.getElementById('report-city').value = 'all';
        generateReports();
    });
    
    // DB connection settings form
    document.getElementById('db-connection-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveDBSettings();
    });
}

// Initialize modal event listeners
function initModals() {
    // Edit modal save button
    document.getElementById('save-edit-btn').addEventListener('click', function() {
        saveEditedRecord();
    });
    
    // Delete modal confirm button
    document.getElementById('confirm-delete-btn').addEventListener('click', function() {
        deleteRecord();
    });
    
    // Backup modal confirm button
    document.getElementById('confirm-backup-btn').addEventListener('click', function() {
        createBackup();
    });
    
    // Backup button
    document.getElementById('backup-btn').addEventListener('click', function() {
        const backupModal = new bootstrap.Modal(document.getElementById('backupModal'));
        backupModal.show();
    });
    
    // Edit from view button
    document.getElementById('edit-from-view-btn').addEventListener('click', function() {
        const viewModal = bootstrap.Modal.getInstance(document.getElementById('viewModal'));
        viewModal.hide();
        
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    });
}

// Insert a new record
function insertRecord() {
    const newRecord = {
        id: generateId(),
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        direccion: document.getElementById('direccion').value,
        ciudad: document.getElementById('ciudad').value,
        pais: 'DO', // República Dominicana fijo
        cedula: document.getElementById('cedula').value,
        estatus: parseInt(document.getElementById('estatus').value),
        notas: document.getElementById('notas').value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    database.records.push(newRecord);
    saveDatabase();
    
    // Reset form
    document.getElementById('insert-form').reset();
    
    // Show success message
    showToast('Éxito', 'Registro insertado correctamente', 'success');
    
    // Update dashboard and stats
    updateDashboard();
    updateStats();
    
    // If we're on the view section, refresh the table
    if (document.getElementById('view-section').style.display === 'block') {
        loadRecordsTable();
    }
}

// Generate a new ID for records
function generateId() {
    if (database.records.length === 0) return 1;
    return Math.max(...database.records.map(record => record.id)) + 1;
}

// Load records into the table
function loadRecordsTable(page = 1, recordsPerPage = 10) {
    const recordsList = document.getElementById('records-list');
    recordsList.innerHTML = '';
    
    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedRecords = database.records.slice(startIndex, endIndex);
    
    if (paginatedRecords.length === 0) {
        recordsList.innerHTML = '<tr><td colspan="7" class="text-center py-4">No hay registros para mostrar</td></tr>';
        document.getElementById('pagination').innerHTML = '';
        return;
    }
    
    paginatedRecords.forEach(record => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.nombre}</td>
            <td>${record.email}</td>
            <td>${record.telefono ? formatPhoneNumber(record.telefono) : '-'}</td>
            <td>${record.ciudad || '-'}</td>
            <td>
                <span class="status-badge ${record.estatus ? 'badge-active' : 'badge-inactive'}">
                    ${record.estatus ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary action-btn view-btn" data-id="${record.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-secondary action-btn edit-btn" data-id="${record.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger action-btn delete-btn" data-id="${record.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        recordsList.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            viewRecord(parseInt(this.getAttribute('data-id')));
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            editRecord(parseInt(this.getAttribute('data-id')));
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            confirmDelete(parseInt(this.getAttribute('data-id')));
        });
    });
    
    // Generate pagination
    generatePagination(page, recordsPerPage, 'pagination', database.records.length, loadRecordsTable);
}

// Generate pagination controls
function generatePagination(currentPage, itemsPerPage, paginationId, totalItems, callback) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById(paginationId);
    pagination.innerHTML = '';
    
    if (totalPages <= 1) return;
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
    prevLi.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) callback(currentPage - 1, itemsPerPage);
    });
    pagination.appendChild(prevLi);
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage, endPage;
    
    if (totalPages <= maxVisiblePages) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
        const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
        
        if (currentPage <= maxPagesBeforeCurrent) {
            startPage = 1;
            endPage = maxVisiblePages;
        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrent;
            endPage = currentPage + maxPagesAfterCurrent;
        }
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        firstLi.innerHTML = `<a class="page-link" href="#">1</a>`;
        firstLi.addEventListener('click', function(e) {
            e.preventDefault();
            callback(1, itemsPerPage);
        });
        pagination.appendChild(firstLi);
        
        if (startPage > 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
            pagination.appendChild(ellipsisLi);
        }
    }
    
    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pageLi.addEventListener('click', function(e) {
            e.preventDefault();
            if (i !== currentPage) callback(i, itemsPerPage);
        });
        pagination.appendChild(pageLi);
    }
    
    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            ellipsisLi.innerHTML = `<span class="page-link">...</span>`;
            pagination.appendChild(ellipsisLi);
        }
        
        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        lastLi.innerHTML = `<a class="page-link" href="#">${totalPages}</a>`;
        lastLi.addEventListener('click', function(e) {
            e.preventDefault();
            callback(totalPages, itemsPerPage);
        });
        pagination.appendChild(lastLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
    nextLi.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage < totalPages) callback(currentPage + 1, itemsPerPage);
    });
    pagination.appendChild(nextLi);
}

// View a record in detail
function viewRecord(id) {
    const record = database.records.find(r => r.id === id);
    if (!record) {
        showToast('Error', 'Registro no encontrado', 'error');
        return;
    }
    
    // Fill the view modal with record data
    document.getElementById('view-id').textContent = `ID: ${record.id}`;
    document.getElementById('view-nombre').textContent = record.nombre;
    document.getElementById('view-email').textContent = record.email;
    document.getElementById('view-telefono').textContent = record.telefono ? formatPhoneNumber(record.telefono) : '-';
    document.getElementById('view-fecha_nacimiento').textContent = record.fecha_nacimiento ? formatDate(record.fecha_nacimiento) : '-';
    document.getElementById('view-cedula').textContent = record.cedula || '-';
    document.getElementById('view-direccion').textContent = record.direccion || '-';
    document.getElementById('view-ciudad').textContent = record.ciudad || '-';
    document.getElementById('view-pais').textContent = getCountryName(record.pais);
    document.getElementById('view-notas').textContent = record.notas || '-';
    document.getElementById('view-created_at').textContent = formatDateTime(record.created_at);
    document.getElementById('view-updated_at').textContent = formatDateTime(record.updated_at);
    
    // Set status badge
    const statusBadge = document.getElementById('view-estatus-badge');
    statusBadge.textContent = record.estatus ? 'Activo' : 'Inactivo';
    statusBadge.className = `badge ${record.estatus ? 'bg-success' : 'bg-danger'}`;
    
    // Set the edit button to know which record we're viewing
    document.getElementById('edit-from-view-btn').setAttribute('data-id', record.id);
    
    // Show the modal
    const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
    viewModal.show();
}

// Edit a record
function editRecord(id) {
    const record = database.records.find(r => r.id === id);
    if (!record) {
        showToast('Error', 'Registro no encontrado', 'error');
        return;
    }
    
    // Fill the edit form with record data
    document.getElementById('edit-id').value = record.id;
    document.getElementById('edit-nombre').value = record.nombre;
    document.getElementById('edit-email').value = record.email;
    document.getElementById('edit-telefono').value = record.telefono || '';
    document.getElementById('edit-fecha_nacimiento').value = record.fecha_nacimiento || '';
    document.getElementById('edit-direccion').value = record.direccion || '';
    document.getElementById('edit-ciudad').value = record.ciudad || '';
    document.getElementById('edit-cedula').value = record.cedula || '';
    document.getElementById('edit-estatus').value = record.estatus;
    document.getElementById('edit-notas').value = record.notas || '';
    
    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

// Save edited record
function saveEditedRecord() {
    const id = parseInt(document.getElementById('edit-id').value);
    const recordIndex = database.records.findIndex(r => r.id === id);
    
    if (recordIndex === -1) {
        showToast('Error', 'Registro no encontrado', 'error');
        return;
    }
    
    // Update the record
    database.records[recordIndex] = {
        ...database.records[recordIndex],
        nombre: document.getElementById('edit-nombre').value,
        email: document.getElementById('edit-email').value,
        telefono: document.getElementById('edit-telefono').value,
        fecha_nacimiento: document.getElementById('edit-fecha_nacimiento').value,
        direccion: document.getElementById('edit-direccion').value,
        ciudad: document.getElementById('edit-ciudad').value,
        pais: 'DO', // República Dominicana fijo
        cedula: document.getElementById('edit-cedula').value,
        estatus: parseInt(document.getElementById('edit-estatus').value),
        notas: document.getElementById('edit-notas').value,
        updated_at: new Date().toISOString()
    };
    
    saveDatabase();
    
    // Hide the modal
    const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide();
    
    // Show success message
    showToast('Éxito', 'Registro actualizado correctamente', 'success');
    
    // Update dashboard and stats
    updateDashboard();
    updateStats();
    
    // Refresh the records table if we're on the view section
    if (document.getElementById('view-section').style.display === 'block') {
        loadRecordsTable();
    }
    
    // Refresh the search results if we're on the search section
    if (document.getElementById('search-section').style.display === 'block') {
        searchRecords();
    }
}

// Confirm record deletion
function confirmDelete(id) {
    const record = database.records.find(r => r.id === id);
    if (!record) {
        showToast('Error', 'Registro no encontrado', 'error');
        return;
    }
    
    // Set the record name in the modal
    document.getElementById('delete-record-name').textContent = `${record.nombre} (ID: ${record.id})`;
    
    // Set the delete button to know which record we're deleting
    document.getElementById('confirm-delete-btn').setAttribute('data-id', record.id);
    
    // Show the modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    deleteModal.show();
}

// Delete a record
function deleteRecord() {
    const id = parseInt(document.getElementById('confirm-delete-btn').getAttribute('data-id'));
    const recordIndex = database.records.findIndex(r => r.id === id);
    
    if (recordIndex === -1) {
        showToast('Error', 'Registro no encontrado', 'error');
        return;
    }
    
    // Remove the record
    database.records.splice(recordIndex, 1);
    saveDatabase();
    
    // Hide the modal
    const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
    deleteModal.hide();
    
    // Show success message
    showToast('Éxito', 'Registro eliminado correctamente', 'success');
    
    // Update dashboard and stats
    updateDashboard();
    updateStats();
    
    // Refresh the records table if we're on the view section
    if (document.getElementById('view-section').style.display === 'block') {
        loadRecordsTable();
    }
    
    // Refresh the search results if we're on the search section
    if (document.getElementById('search-section').style.display === 'block') {
        searchRecords();
    }
}

// Search records
function searchRecords(page = 1, recordsPerPage = 10) {
    const searchTerm = document.getElementById('search-term').value.toLowerCase();
    const searchField = document.getElementById('search-field').value;
    const searchStatus = document.getElementById('search-status').value;
    
    let results = [...database.records];
    
    // Filter by search term if provided
    if (searchTerm) {
        if (searchField === 'all') {
            results = results.filter(record => 
                Object.values(record).some(
                    value => value && value.toString().toLowerCase().includes(searchTerm)
                )
            );
        } else {
            results = results.filter(record => 
                record[searchField] && record[searchField].toString().toLowerCase().includes(searchTerm)
            );
        }
    }
    
    // Filter by status if not 'all'
    if (searchStatus !== 'all') {
        const status = parseInt(searchStatus);
        results = results.filter(record => record.estatus === status);
    }
    
    // Display results
    displaySearchResults(results, page, recordsPerPage);
}

// Display search results
function displaySearchResults(results, page, recordsPerPage) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    const startIndex = (page - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    if (paginatedResults.length === 0) {
        searchResults.innerHTML = '<tr><td colspan="7" class="text-center py-4">No se encontraron registros</td></tr>';
        document.getElementById('search-pagination').innerHTML = '';
        return;
    }
    
    paginatedResults.forEach(record => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.nombre}</td>
            <td>${record.email}</td>
            <td>${record.telefono ? formatPhoneNumber(record.telefono) : '-'}</td>
            <td>${record.ciudad || '-'}</td>
            <td>
                <span class="status-badge ${record.estatus ? 'badge-active' : 'badge-inactive'}">
                    ${record.estatus ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary action-btn view-btn" data-id="${record.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-secondary action-btn edit-btn" data-id="${record.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger action-btn delete-btn" data-id="${record.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        
        searchResults.appendChild(row);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('#search-results .view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            viewRecord(parseInt(this.getAttribute('data-id')));
        });
    });
    
    document.querySelectorAll('#search-results .edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            editRecord(parseInt(this.getAttribute('data-id')));
        });
    });
    
    document.querySelectorAll('#search-results .delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            confirmDelete(parseInt(this.getAttribute('data-id')));
        });
    });
    
    // Generate pagination
    generatePagination(page, recordsPerPage, 'search-pagination', results.length, searchRecords);
}

// Update dashboard with current stats
function updateDashboard() {
    const totalRecords = database.records.length;
    const activeRecords = database.records.filter(record => record.estatus === 1).length;
    const inactiveRecords = totalRecords - activeRecords;
    
    // Today's date for comparison
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = database.records.filter(record => {
        return record.created_at.split('T')[0] === today;
    }).length;
    
    // Update cards
    document.getElementById('dashboard-total').textContent = totalRecords;
    document.getElementById('dashboard-active').textContent = activeRecords;
    document.getElementById('dashboard-inactive').textContent = inactiveRecords;
    document.getElementById('dashboard-today').textContent = todayRecords;
    
    // Update recent activity table
    updateRecentActivity();
    
    // Update chart
    updateStatusChart(activeRecords, inactiveRecords);
}

// Update recent activity table
function updateRecentActivity() {
    const recentActivity = document.getElementById('recent-activity');
    recentActivity.innerHTML = '';
    
    // Get 5 most recent records
    const recentRecords = [...database.records]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    
    if (recentRecords.length === 0) {
        recentActivity.innerHTML = '<tr><td colspan="5" class="text-center py-4">No hay actividad reciente</td></tr>';
        return;
    }
    
    recentRecords.forEach(record => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${record.id}</td>
            <td>${record.nombre}</td>
            <td>${record.email}</td>
            <td>
                <span class="status-badge ${record.estatus ? 'badge-active' : 'badge-inactive'}">
                    ${record.estatus ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary action-btn view-btn" data-id="${record.id}">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        
        recentActivity.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('#recent-activity .view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            viewRecord(parseInt(this.getAttribute('data-id')));
        });
    });
}

// Update status chart
function updateStatusChart(active, inactive) {
    const ctx = document.getElementById('statusChart').getContext('2d');
    
    // Destroy previous chart if it exists
    if (window.statusChart) {
        window.statusChart.destroy();
    }
    
    window.statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Activos', 'Inactivos'],
            datasets: [{
                data: [active, inactive],
                backgroundColor: [
                    '#28a745',
                    '#dc3545'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Distribución por estatus',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Generate reports
function generateReports() {
    // Get filter values
    const startDate = document.getElementById('report-start-date').value;
    const endDate = document.getElementById('report-end-date').value;
    const status = document.getElementById('report-status').value;
    const city = document.getElementById('report-city').value;
    
    // Filter records
    let filteredRecords = [...database.records];
    
    // Filter by date range if provided
    if (startDate || endDate) {
        filteredRecords = filteredRecords.filter(record => {
            const recordDate = record.created_at.split('T')[0];
            return (!startDate || recordDate >= startDate) && (!endDate || recordDate <= endDate);
        });
    }
    
    // Filter by status if not 'all'
    if (status !== 'all') {
        const statusValue = parseInt(status);
        filteredRecords = filteredRecords.filter(record => record.estatus === statusValue);
    }
    
    // Filter by city if not 'all'
    if (city !== 'all') {
        filteredRecords = filteredRecords.filter(record => record.ciudad === city);
    }
    
    // Generate city distribution chart
    generateCityChart(filteredRecords);
    
    // Generate monthly records chart
    generateMonthlyChart(filteredRecords);
}

// Generate city distribution chart
function generateCityChart(records) {
    // Group by city
    const cityCounts = {};
    records.forEach(record => {
        const city = record.ciudad || 'Desconocida';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    // Sort by count (descending)
    const sortedCities = Object.entries(cityCounts)
        .sort((a, b) => b[1] - a[1]);
    
    // Get top 5 cities and group others
    let labels, data;
    if (sortedCities.length <= 5) {
        labels = sortedCities.map(item => item[0]);
        data = sortedCities.map(item => item[1]);
    } else {
        const top5 = sortedCities.slice(0, 5);
        const others = sortedCities.slice(5).reduce((sum, item) => sum + item[1], 0);
        
        labels = [...top5.map(item => item[0]), 'Otros'];
        data = [...top5.map(item => item[1]), others];
    }
    
    // Create or update chart
    const ctx = document.getElementById('cityChart').getContext('2d');
    
    if (window.cityChart) {
        window.cityChart.data.labels = labels;
        window.cityChart.data.datasets[0].data = data;
        window.cityChart.update();
    } else {
        window.cityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Registros por ciudad',
                    data: data,
                    backgroundColor: '#002D62',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Distribución por ciudad',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
}

// Generate monthly records chart
function generateMonthlyChart(records) {
    // Group by month
    const monthCounts = {};
    records.forEach(record => {
        const date = new Date(record.created_at);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });
    
    // Sort by date (ascending)
    const sortedMonths = Object.entries(monthCounts)
        .sort((a, b) => a[0].localeCompare(b[0]));
    
    const labels = sortedMonths.map(item => formatMonthYear(item[0]));
    const data = sortedMonths.map(item => item[1]);
    
    // Create or update chart
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    if (window.monthlyChart) {
        window.monthlyChart.data.labels = labels;
        window.monthlyChart.data.datasets[0].data = data;
        window.monthlyChart.update();
    } else {
        window.monthlyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Registros por mes',
                    data: data,
                    backgroundColor: 'rgba(0, 45, 98, 0.1)',
                    borderColor: '#002D62',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Registros por mes',
                        font: {
                            size: 16
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
}

// Load database settings
function loadDBSettings() {
    document.getElementById('db-type').value = database.settings.dbType;
    document.getElementById('db-host').value = database.settings.dbHost;
    document.getElementById('db-port').value = database.settings.dbPort;
    document.getElementById('db-name').value = database.settings.dbName;
    document.getElementById('db-user').value = database.settings.dbUser;
    document.getElementById('db-password').value = database.settings.dbPassword;
    
    // Update stats
    document.getElementById('db-size').textContent = '10.5 MB';
    document.getElementById('db-tables').textContent = '8 tablas';
    document.getElementById('db-version').textContent = 'MySQL 8.0';
    document.getElementById('last-backup').textContent = '2023-05-15 14:30';
    document.getElementById('db-status').textContent = 'Conectado';
    document.getElementById('db-status').className = 'badge bg-success';
}

// Save database settings
function saveDBSettings() {
    database.settings = {
        dbType: document.getElementById('db-type').value,
        dbHost: document.getElementById('db-host').value,
        dbPort: document.getElementById('db-port').value,
        dbName: document.getElementById('db-name').value,
        dbUser: document.getElementById('db-user').value,
        dbPassword: document.getElementById('db-password').value
    };
    
    saveDatabase();
    showToast('Éxito', 'Configuración de base de datos guardada', 'success');
}

// Create a database backup
function createBackup() {
    const backupName = document.getElementById('backup-name').value || `respaldo-${new Date().toISOString().split('T')[0]}`;
    const backupNotes = document.getElementById('backup-notes').value;
    const compress = document.getElementById('compress-backup').checked;
    
    const newBackup = {
        id: database.backups.length + 1,
        name: backupName,
        date: new Date().toISOString(),
        size: '10.5 MB',
        notes: backupNotes,
        compressed: compress
    };
    
    database.backups.push(newBackup);
    saveDatabase();
    
    // Hide the modal
    const backupModal = bootstrap.Modal.getInstance(document.getElementById('backupModal'));
    backupModal.hide();
    
    // Show success message
    showToast('Éxito', `Respaldo "${backupName}" creado correctamente`, 'success');
    
    // Update last backup info
    document.getElementById('last-backup').textContent = formatDateTime(newBackup.date);
}

// Update sidebar stats
function updateStats() {
    const totalRecords = database.records.length;
    const activeRecords = database.records.filter(record => record.estatus === 1).length;
    
    document.getElementById('total-records').textContent = totalRecords;
    document.getElementById('active-records').textContent = activeRecords;
    
    if (database.records.length > 0) {
        const lastUpdate = database.records.reduce((latest, record) => {
            const recordDate = new Date(record.updated_at);
            return recordDate > latest ? recordDate : latest;
        }, new Date(0));
        
        document.getElementById('last-update').textContent = formatDateTime(lastUpdate);
    } else {
        document.getElementById('last-update').textContent = '-';
    }
}

// Show toast notification
function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastTime = document.getElementById('toast-time');
    
    // Set content
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastTime.textContent = new Date().toLocaleTimeString();
    
    // Set style based on type
    const toastHeader = toast.querySelector('.toast-header');
    toastHeader.className = 'toast-header';
    
    switch (type) {
        case 'success':
            toastHeader.classList.add('bg-success', 'text-white');
            break;
        case 'error':
            toastHeader.classList.add('bg-danger', 'text-white');
            break;
        case 'warning':
            toastHeader.classList.add('bg-warning', 'text-dark');
            break;
        default:
            toastHeader.classList.add('bg-primary', 'text-white');
    }
    
    // Show the toast
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Helper function to format phone number (RD format)
function formatPhoneNumber(phone) {
    if (!phone) return '-';
    // Format as (809) 123-4567
    return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
}

// Helper function to format date
function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-DO', options);
}

// Helper function to format date and time
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('es-DO') + ' ' + date.toLocaleTimeString('es-DO');
}

// Helper function to format month and year
function formatMonthYear(monthYear) {
    const [year, month] = monthYear.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('es-DO', { month: 'short', year: 'numeric' });
}

// Helper function to get country name
function getCountryName(countryCode) {
    return countryCode === 'DO' ? 'República Dominicana' : '-';
}