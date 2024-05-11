class Task extends HTMLElement {
  constructor () {
    super()
  }

  connectedCallback () {
    const title = this.getAttribute('title')
    const content = this.getAttribute('content')
    const start_id = this.getAttribute('start_id')
    const finish_id = this.getAttribute('finish_id')
    const description_id = this.getAttribute('description_id')

    this.innerHTML = `
      <div class="task">
            
        <div class="container">
          <div class="title-container">
            <!-- TASK TITLE -->

            <span class="task-title"> ${title} </span> 
            <br>
            <label>
                <input type="checkbox" id="${start_id}" class="task-checkbox-wip" value=true onclick="checkboxSwitch(this, '${start_id}', '${finish_id}')"/>
                <span class="arrow">&rarr;</span>
                <input type="checkbox" id="${finish_id}" class="task-checkbox-done" onclick="checkboxSwitch(this, '${start_id}', '${finish_id}')"/>
                  <span class="go-left checkTitle">START</span>
                      Bye Bye
                  <span class="go-right checkTitle">DONE</span>
            </label>
          </div>

          <!-- OPEN DESCRIPTION BUTTON -->
          <button type="click" class="task-open" onclick="viewTask(this, '${description_id}')">
            View Task Description
          </button>

          <!-- HIDDEN CONTENT (SHOW THIS ON BUTTON CLICK)-->
          <p class="${description_id}">
            ${content}
          </p> 
        </div>
      </div>
    `
  }
}

customElements.define('task-component', Task)
