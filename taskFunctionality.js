/** Replaces date with today's date */
const customElements = window.customElements
const localStorage = window.localStorage

window.onload = function () {
  // today
  const today = new Date()

  // format the date as MM/DD/YYYY
  const formattedDate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()

  // update the content of the div with id headerDate
  document.getElementById('headerDate').innerText = formattedDate

  customElements.define('task-elem', TaskElement)

  if (localStorage.getItem('tasks') == null) {
    localStorage.setItem('tasks', '{}')
  }

  for (const id in JSON.parse(localStorage.getItem('tasks'))) {
    addTaskElement(id)
  }

  document.getElementsByTagName('html')[0].style.visibility = 'visible'

  document.querySelector('#clear-tasks').addEventListener('click', clearTasks)
  document.querySelector('#read_json').addEventListener('click', readTextFile('tasks.json'))
  document.querySelector('#create-button').addEventListener('click', addTask(this))
}

function addTaskElement (id) {
  const el = document.createElement('task-elem')
  el.setAttribute('id', id)
  document.getElementById('task-container').append(el)
}

function addTask () {
  const title = document.getElementById('create-title').value
  const desc = document.getElementById('create-desc').value
  const deadline = document.getElementById('create-deadline').value
  // console.log("adding " + title + " " + desc)
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  const data = {}
  data.title = title
  data.content = desc
  data.started = false
  data.checkbox = false
  data.deadline = deadline || 'No deadline'
  const id = Date.now().toString()
  tasks[id] = data
  localStorage.setItem('tasks', JSON.stringify(tasks))

  addTaskElement(id)
}
class TaskElement extends window.HTMLElement {
  connectedCallback () {
    const id = this.getAttribute('id')
    const data = JSON.parse(localStorage.getItem('tasks'))[id]
    // console.log(data);
    // console.log("at " + id);
    this.innerHTML = `
        <div class="task">
            
                <div class="container">
                    <span class="deadline">Deadline: ${data.deadline} </span>
                    <div class="title-container">
                    <!-- TASK TITLE -->

                    <span class="task-title">${data.title}</span> 
                    <br>
                    <label>
                        <input type="checkbox" class="task-checkbox-wip" onclick="checkboxSwitch(this)"/>
                        <span class="arrow">&rarr;</span>
                        <input type="checkbox" class="task-checkbox-done" onclick="checkboxSwitch(this)"/>
                            <span class="go-left checkTitle">START</span>
                                
                            <span class="go-right checkTitle">DONE</span>
                    </label>
                    </div>

                    <!-- OPEN DESCRIPTION BUTTON -->
                    <button type="click" class="task-open" onclick="viewTask(this)">
                        View Task Description
                    </button>

            <!-- HIDDEN CONTENT (SHOW THIS ON BUTTON CLICK)-->
            <p class="task-description">
            ${data.content}
            </p> 
          </div>
        </div>`
    this.querySelector('.task-checkbox-wip').checked = data.started
    this.querySelector('.task-checkbox-done').checked = data.checkbox
  }
}

function checkboxSwitch (checkBox) { // eslint-disable-line no-unused-vars
  // console.log(checkBox.parentElement);
  // initially checks if the calling element is the start checkbox
  if (checkBox.getAttribute('class') === 'task-checkbox-wip') {
    const finishCheck = checkBox.parentElement.querySelector('.task-checkbox-done')
    const checkStatus = finishCheck.checked

    if (checkBox.checked && checkStatus) {
      finishCheck.checked = false
    }
  } else {
    const startCheck = checkBox.parentElement.querySelector('.task-checkbox-wip')
    const checkStatus = startCheck.checked

    if (checkBox.checked && checkStatus) {
      startCheck.checked = false
    }
  }

  // directly update bools from new state
  // the above logic can be simplified though
  const id = checkBox.closest('task-elem').getAttribute('id')
  const tasks = JSON.parse(localStorage.getItem('tasks'))
  // console.log("bruh ", tasks, id);
  const data = tasks[id]
  data.started = checkBox.parentElement.querySelector('.task-checkbox-wip').checked
  data.checkbox = checkBox.parentElement.querySelector('.task-checkbox-done').checked
  tasks[id] = data
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

/** Function that open/close task description */
function viewTask (button) { // eslint-disable-line no-unused-vars
  const description = button.parentElement.querySelector('.task-description')
  if (button.innerText === 'View Task Description') {
    description.style.display = 'block'
    button.innerText = 'Close Task Description'
  } else {
    button.innerText = 'View Task Description'
    description.style.display = 'none'
  }
}

/** Reads from JSON file and populate task container */
function readTextFile (file) {
  const jsonInput = new window.XMLHttpRequest()
  jsonInput.overrideMimeType('application/json')
  jsonInput.open('GET', file, true)
  jsonInput.onreadystatechange = function () {
    if (jsonInput.readyState === 4 && jsonInput.status === '200') {
      let data = JSON.parse(jsonInput.responseText)
      data = data.tasks

      // task_container.innerHTML = ``;

      for (let i = 0; i < data.length; i++) {
        const tasks = JSON.parse(localStorage.getItem('tasks'))
        const taskdata = {}
        taskdata.title = data[i].title
        taskdata.content = data[i].content
        taskdata.started = data[i].started
        taskdata.checkbox = data[i].checkbox
        taskdata.deadline = data[i].deadline
        const id = Date.now().toString() + i
        tasks[id] = taskdata
        localStorage.setItem('tasks', JSON.stringify(tasks))

        const el = document.createElement('task-elem')
        el.setAttribute('id', id)
        document.getElementById('task-container').append(el)
      }
    }
  }
  jsonInput.send(null)
}

function clearTasks () {
  localStorage.setItem('tasks', '{}')
  const taskContainer = document.getElementById('task-container')
  taskContainer.innerHTML = ''
}
