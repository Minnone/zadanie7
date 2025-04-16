// DOM элементы
const noteInput = document.getElementById('note-input');
const addNoteBtn = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');
const offlineStatus = document.getElementById('offline-status');

// Проверка онлайн статуса
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  if (navigator.onLine) {
    offlineStatus.style.display = 'none';
  } else {
    offlineStatus.style.display = 'block';
  }
}

// Инициализация
updateOnlineStatus();
loadNotes();

// Добавление заметки
addNoteBtn.addEventListener('click', () => {
  const noteText = noteInput.value.trim();
  if (noteText) {
    addNote(noteText);
    noteInput.value = '';
  }
});

// Загрузка заметок из localStorage
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.forEach(note => {
    displayNote(note.id, note.text);
  });
}

// Добавление новой заметки
function addNote(text) {
  const note = {
    id: Date.now(),
    text: text
  };
  
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.push(note);
  localStorage.setItem('notes', JSON.stringify(notes));
  
  displayNote(note.id, note.text);
}

// Отображение заметки
function displayNote(id, text) {
  const noteElement = document.createElement('div');
  noteElement.className = 'note';
  noteElement.dataset.id = id;
  noteElement.innerHTML = `
    <div class="note-content">${text}</div>
    <div class="note-actions">
      <button class="edit-note" data-id="${id}">Редактировать</button>
      <button class="delete-note" data-id="${id}">Удалить</button>
    </div>
  `;
  
  notesList.appendChild(noteElement);
  
  // Обработчик удаления
  noteElement.querySelector('.delete-note').addEventListener('click', () => {
    deleteNote(id);
    noteElement.remove();
  });
  
  // Обработчик редактирования
  noteElement.querySelector('.edit-note').addEventListener('click', () => {
    editNote(id, noteElement);
  });
}

// Редактирование заметки
function editNote(id, noteElement) {
  const contentElement = noteElement.querySelector('.note-content');
  const currentText = contentElement.textContent;
  
  // Заменяем содержимое на textarea для редактирования
  const textarea = document.createElement('textarea');
  textarea.className = 'edit-textarea';
  textarea.value = currentText;
  
  const saveButton = document.createElement('button');
  saveButton.className = 'save-note';
  saveButton.textContent = 'Сохранить';
  
  const cancelButton = document.createElement('button');
  cancelButton.className = 'cancel-edit';
  cancelButton.textContent = 'Отмена';
  
  const editControls = document.createElement('div');
  editControls.className = 'edit-controls';
  editControls.appendChild(saveButton);
  editControls.appendChild(cancelButton);
  
  noteElement.innerHTML = '';
  noteElement.appendChild(textarea);
  noteElement.appendChild(editControls);
  
  // Обработчик сохранения
  saveButton.addEventListener('click', () => {
    const newText = textarea.value.trim();
    if (newText) {
      updateNote(id, newText);
      noteElement.innerHTML = `
        <div class="note-content">${newText}</div>
        <div class="note-actions">
          <button class="edit-note" data-id="${id}">Редактировать</button>
          <button class="delete-note" data-id="${id}">Удалить</button>
        </div>
      `;
      
      // Повторно добавляем обработчики
      noteElement.querySelector('.delete-note').addEventListener('click', () => {
        deleteNote(id);
        noteElement.remove();
      });
      
      noteElement.querySelector('.edit-note').addEventListener('click', () => {
        editNote(id, noteElement);
      });
    }
  });
  
  // Обработчик отмены
  cancelButton.addEventListener('click', () => {
    noteElement.innerHTML = `
      <div class="note-content">${currentText}</div>
      <div class="note-actions">
        <button class="edit-note" data-id="${id}">Редактировать</button>
        <button class="delete-note" data-id="${id}">Удалить</button>
      </div>
    `;
    
    // Повторно добавляем обработчики
    noteElement.querySelector('.delete-note').addEventListener('click', () => {
      deleteNote(id);
      noteElement.remove();
    });
    
    noteElement.querySelector('.edit-note').addEventListener('click', () => {
      editNote(id, noteElement);
    });
  });
}

// Обновление заметки в хранилище
function updateNote(id, newText) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes = notes.map(note => {
    if (note.id === id) {
      return { ...note, text: newText };
    }
    return note;
  });
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Удаление заметки
function deleteNote(id) {
  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes = notes.filter(note => note.id !== id);
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}