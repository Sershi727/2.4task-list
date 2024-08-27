const fs = require('fs');
const readline = require('readline');

// Определение класса задачи
class Task {
  constructor(description) {
    this.description = description;
    this.completed = false;
  }

  markCompleted() {
    this.completed = true;
  }

  toString() {
    return `${this.description} [${this.completed ? 'Выполнена' : 'Не выполнена'}]`;
  }
}

// Определение класса списка задач
class TaskList {
  constructor() {
    this.tasks = [];
  }

  addTask(description) {
    this.tasks.push(new Task(description));
  }

  removeTask(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks.splice(index, 1);
    }
  }

  markTaskAsCompleted(index) {
    if (index >= 0 && index < this.tasks.length) {
      this.tasks[index].markCompleted();
    }
  }

  listTasks(showCompleted = true) {
    return this.tasks
      .filter(task => showCompleted || !task.completed)
      .map((task, index) => `${index}. ${task.toString()}`)
      .join('\n');
  }

  saveToFile(filename) {
    fs.writeFileSync(filename, JSON.stringify(this.tasks, null, 2));
  }

  loadFromFile(filename) {
    if (fs.existsSync(filename)) {
      const data = fs.readFileSync(filename);
      const tasksData = JSON.parse(data);
      this.tasks = tasksData.map(task => Object.assign(new Task(), task));
    }
  }
}

// Взаимодействие с пользователем
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const taskList = new TaskList();
const FILENAME = 'tasks.json';

// Загрузка задач из файла при запуске
taskList.loadFromFile(FILENAME);

function displayMenu() {
  console.log('\nМеню задач:');
  console.log('1. Добавить задачу');
  console.log('2. Удалить задачу');
  console.log('3. Пометить задачу как выполненную');
  console.log('4. Показать все задачи');
  console.log('5. Показать невыполненные задачи');
  console.log('6. Сохранить и выйти');
}

function handleInput(answer) {
  switch (answer.trim()) {
    case '1':
      rl.question('Введите описание задачи: ', (description) => {
        taskList.addTask(description);
        console.log('Задача добавлена.');
        displayMenu();
      });
      break;
    case '2':
      rl.question('Введите индекс задачи для удаления: ', (index) => {
        taskList.removeTask(parseInt(index, 10));
        console.log('Задача удалена.');
        displayMenu();
      });
      break;
    case '3':
      rl.question('Введите индекс задачи для пометки как выполненной: ', (index) => {
        taskList.markTaskAsCompleted(parseInt(index, 10));
        console.log('Задача помечена как выполненная.');
        displayMenu();
      });
      break;
    case '4':
      console.log('\nВсе задачи:\n' + taskList.listTasks());
      displayMenu();
      break;
    case '5':
      console.log('\nНевыполненные задачи:\n' + taskList.listTasks(false));
      displayMenu();
      break;
    case '6':
      taskList.saveToFile(FILENAME);
      console.log('Задачи сохранены. Выход...');
      rl.close();
      break;
    default:
      console.log('Неверный выбор. Пожалуйста, попробуйте снова.');
      displayMenu();
      break;
  }
}

displayMenu();
rl.on('line', handleInput);
