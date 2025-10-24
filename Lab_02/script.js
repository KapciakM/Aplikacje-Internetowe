document.addEventListener('DOMContentLoaded', () => {
    // Pobranie referencji do kluczowych elementów HTML
    const inputField = document.getElementById('input');
    const dateField = document.getElementById('date');
    const addButton = document.getElementById('add');
    const listContainer = document.getElementById('list');
    const searchInput = document.getElementById('searchInput');

    // Tablica, w której przechowujemy wszystkie zadania
    let todos = loadTodos(); 
    
    // Wyświetlenie zadań po załadowaniu strony
    renderTodos(todos);

    // 1. Dodawanie nowego zadania
    addButton.addEventListener('click', addTodo);
    // Umożliwienie dodawania zadania po naciśnięciu Enter w polu input
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // 2. Wyszukiwanie/Filtrowanie zadań
    searchInput.addEventListener('input', filterTodos);

    
    function addTodo() {
        const text = inputField.value.trim();
        const date = dateField.value;

        if (text.length<3){
            alert('Treść zadania musi mieć przynajmniej 3 znaki!');
            return;
        }
        if (text.length > 255){
            alert('Treść zadanie nie może być dłuższa niż 255 znaków!')
        }

        const newTodo = {
            id: Date.now(), // Unikalne ID oparte na czasie
            text: text,
            date: date,
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos(todos);

        // Czyszczenie pól po dodaniu
        inputField.value = '';
        dateField.value = '';
    }

    
    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos(todos); // Ponowne wyrenderowanie listy
    }

    

    function enableEdit(itemElement, todo) {
        // Zastąpienie treści i daty polami input
        itemElement.innerHTML = `
            <input type="text" class="edit-input" value="${todo.text}">
            <input type="date" class="edit-input-date" value="${todo.date}">
            <div class="todo-actions">
                <button class="save-btn">Zapisz</button>
                <button class="cancel-btn">Anuluj</button>
            </div>
        `;
        
        const saveBtn = itemElement.querySelector('.save-btn');
        const cancelBtn = itemElement.querySelector('.cancel-btn');
        const editInput = itemElement.querySelector('.edit-input');
        const editDate = itemElement.querySelector('.edit-input-date');

        // Ustawienie fokusu na pole tekstowe
        editInput.focus();

        saveBtn.addEventListener('click', () => saveEdit(todo.id, editInput.value, editDate.value));
        cancelBtn.addEventListener('click', () => renderTodos(todos)); // Anulowanie przywraca listę
        
        // Zapis przy naciśnięciu Enter
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit(todo.id, editInput.value, editDate.value);
            }
        });
    }

    function saveEdit(id, newText, newDate) {
        const text = newText.trim();
        if (text === '') {
            alert('Treść zadania nie może być pusta!');
            return;
        }

        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.text = text;
            todo.date = newDate;
            saveTodos();
            renderTodos(todos);
        }
    }
    
    
    function filterTodos() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if(searchTerm.length<3){
            renderTodos(todos);
            return;
        }
        if(searchTerm.length>255){
            renderTodos(todos);
            return;
        }
        const filtered = todos.filter(todo => 
            todo.text.toLowerCase().includes(searchTerm)
        );
        // Przekazujemy searchTerm do renderTodos
        renderTodos(filtered, searchTerm); 
    }

    
    function createTodoElement(todo, highlightTerm = '') {
        const item = document.createElement('div');
        item.classList.add('todo-item');
        item.dataset.id = todo.id;

        const dateDisplay = todo.date || 'Brak daty';
        let displayText = todo.text;
        
        // LOGIKA PODŚWIETLANIA:
        if (highlightTerm) {
            const regex = new RegExp(highlightTerm, 'gi');
            
            displayText = todo.text.replace(regex, (match) => `<mark>${match}</mark>`);
        }

        item.innerHTML = `
            <div class="todo-content">
                <strong>${displayText}</strong>
                <small>${dateDisplay}</small>
            </div>
            <div class="todo-actions">
                <button class="delete-btn"><img class="trash" src="trash.ico" alt="kosz_na_śmieci"></button>
            </div>
        `;
        
        const contentDiv = item.querySelector('.todo-content');
        contentDiv.addEventListener('click', () => {
             enableEdit(item, todo);
        });

        item.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTodo(todo.id);
        });

        return item;
    }

    
    function renderTodos(list, highlightTerm = '') {
        listContainer.innerHTML = ''; // Wyczyść całą listę
        
        if (list.length === 0) {
             const message = document.createElement('p');
             message.textContent = searchInput.value.trim() === '' ? 'Brak zadań. Dodaj nowe!' : 'Brak wyników wyszukiwania.';
             message.style.textAlign = 'center';
             message.style.marginTop = '20px';
             listContainer.appendChild(message);
             return;
        }

        list.forEach(todo => {
            // Przekazujemy termin do createTodoElement
            const itemElement = createTodoElement(todo, highlightTerm); 
            listContainer.appendChild(itemElement);
        });
    }

    
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    
    function loadTodos() {
        const stored = localStorage.getItem('todos');
        let loadedTodos = stored ? JSON.parse(stored) : [];
        return loadedTodos.map(todo => {
            const { completed, ...rest } = todo;
            return rest;
        });
    }
});