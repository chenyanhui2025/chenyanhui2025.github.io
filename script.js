class TaskManager {
  constructor() {
    this.leftContainer = document.getElementById('left-tasks');
    this.rightContainers = {
      'assigned-to-me': document.getElementById('assigned-to-me'),
      'assigned-by-me': document.getElementById('assigned-by-me'),
      'peer-tasks': document.getElementById('peer-tasks'),
      'self-tasks': document.getElementById('self-tasks'),
      'external-tasks': document.getElementById('external-tasks'),
      'external-feedback': document.getElementById('external-feedback'),
      'irrelevant-tasks': document.getElementById('irrelevant-tasks'),
      'manual-tasks': document.getElementById('manual-tasks')
    };
    this.init();
  }

  init() {
    this.bindDragEvents();
    this.bindAddTask();
  }

  bindDragEvents() {
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
      task.addEventListener('dragstart', this.handleDragStart.bind(this));
      task.addEventListener('dragend', this.handleDragEnd.bind(this));
    });

    const allRightContainers = Object.values(this.rightContainers);
    allRightContainers.forEach(container => {
      container.addEventListener('dragover', this.handleDragOver.bind(this));
      container.addEventListener('drop', this.handleDrop.bind(this));
    });

    this.leftContainer.addEventListener('dragover', this.handleDragOver.bind(this));
    this.leftContainer.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragStart(e) {
    const taskData = {
      id: e.target.id,
      text: e.target.textContent,
      color: e.target.dataset.color,
      source: e.target.closest('.task-container')?.id || 'left'
    };
    e.dataTransfer.setData('text/json', JSON.stringify(taskData));
    e.target.classList.add('dragging');
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging');
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const targetContainer = e.target.closest('.task-container') || e.target.closest('#left-tasks');
    targetContainer?.classList.add('dragover');
  }

  handleDrop(e) {
    e.preventDefault();
    const targetContainer = e.target.closest('.task-container') || e.target.closest('#left-tasks');
    if (!targetContainer) return;

    targetContainer.classList.remove('dragover');
    const taskData = JSON.parse(e.dataTransfer.getData('text/json'));

    if (targetContainer.id === taskData.source) return;

    // 修改拖放后的任务颜色为浅红色
    const newTask = this.createTaskElement(taskData.text, 'lightcoral', taskData.id);

    const sourceContainer = document.getElementById(taskData.source === 'left' ? 'left-tasks' : taskData.source);
    if (sourceContainer) {
      const oldTask = sourceContainer.querySelector(`#${taskData.id}`);
      oldTask?.remove();
    }

    targetContainer.appendChild(newTask);
  }

  createTaskElement(text, color, id) {
    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    task.textContent = text;
    task.dataset.color = color;
    task.id = id;
    task.addEventListener('dragstart', this.handleDragStart.bind(this));
    task.addEventListener('dragend', this.handleDragEnd.bind(this));
    return task;
  }

  bindAddTask() {
    document.getElementById('add-task-btn').addEventListener('click', () => {
      const input = document.getElementById('new-task-input');
      const text = input.value.trim();
      if (!text) return;
      const newTask = this.createTaskElement(text, 'lightblue', `task-${Date.now()}`);
      document.getElementById('manual-tasks').appendChild(newTask);
      input.value = '';
    });
  }
}

new TaskManager();