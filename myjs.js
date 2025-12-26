const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const stats = document.getElementById('stats');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// ---------- helpers ----------
const save = () => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const getFilteredTodos = () => {
  if (currentFilter === 'active') return todos.filter(t => !t.completed);
  if (currentFilter === 'completed') return todos.filter(t => t.completed);
  return todos;
};

const updateStats = () => {
  const done = todos.filter(t => t.completed).length;
  stats.textContent = `${done} / ${todos.length} completed`;
};

// ---------- render ----------
const render = () => {
  list.innerHTML = '';

  getFilteredTodos().forEach(todo => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    if (todo.completed) li.classList.add('completed');

    li.dataset.id = todo.id;

    li.innerHTML = `
      <span>${todo.text}</span>
      <div>
        <button class="btn btn-sm btn-success" data-action="toggle">✓</button>
        <button class="btn btn-sm btn-danger" data-action="delete">✕</button>
      </div>
    `;

    list.appendChild(li);
  });

  updateStats();
};

// ---------- events ----------
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (!text) return;

  todos.push({
    id: Date.now(),
    text,
    completed: false
  });

  input.value = '';
  save();
  render();
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addBtn.click();
});

// 🔥 event delegation
list.addEventListener('click', e => {
  const btn = e.target;
  const li = btn.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (btn.dataset.action === 'toggle') {
    const todo = todos.find(t => t.id === id);
    todo.completed = !todo.completed;
  }

  if (btn.dataset.action === 'delete') {
    todos = todos.filter(t => t.id !== id);
  }

  save();
  render();
});

// filters
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
