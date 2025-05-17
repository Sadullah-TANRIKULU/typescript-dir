// main.ts
import { ToDoService } from "./service.js";
import { ToDo } from "./todo.js";

const apiUrl = "https://682646d1397e48c9131598ef.mockapi.io/api/v1/todos";
const todoService = new ToDoService(apiUrl);

todoService
  .getAll()
  .then((todos) => {
    console.log("Fetched todos:", todos);
  })
  .catch((error) => {
    console.error("Error fetching todos:", error);
  });

const topicEl = document.getElementById("blog-topic") as HTMLElement;

async function loadTopic() {
  const response = await fetch(
    "https://682646d1397e48c9131598ef.mockapi.io/api/v1/blogTopic/1"
  );
  const data = await response.json();
  topicEl.textContent = data.content;
}

loadTopic();

topicEl.addEventListener("blur", async () => {
  const newContent = topicEl.textContent?.trim();
  if (newContent) {
    await fetch(
      "https://682646d1397e48c9131598ef.mockapi.io/api/v1/blogTopic/1",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      }
    );
  }
});

// In main.ts
function renderTodos(todos: ToDo[]) {
  const ul = document.getElementById("todo-list") as HTMLUListElement;
  ul.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    // Text container
    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;
    li.appendChild(textSpan);
    // "done" badge if completed
    if (todo.completed) {
      const doneSpan = document.createElement("span");
      doneSpan.className = "done-badge";
      doneSpan.textContent = " (done)";
      li.appendChild(doneSpan);
    }

    // Button container
    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    // Toggle Button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Toggle";
    toggleBtn.onclick = async () => {
      await todoService.toggleTodo(todo);
      const updatedTodos = await todoService.getAll();
      renderTodos(updatedTodos);
    };
    btnContainer.appendChild(toggleBtn);

    // Update Button
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "Update";
    updateBtn.onclick = async () => {
      const newText = prompt("Update todo text:", todo.text);
      if (newText !== null && newText.trim() !== "") {
        todo.text = newText.trim();
        await todoService.update(todo);
        const updatedTodos = await todoService.getAll();
        renderTodos(updatedTodos);
      }
    };
    btnContainer.appendChild(updateBtn);

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = async () => {
      await todoService.delete(todo.id);
      const updatedTodos = await todoService.getAll();
      renderTodos(updatedTodos);
    };
    btnContainer.appendChild(deleteBtn);

    li.appendChild(btnContainer);
    ul.appendChild(li);
  });
}

const input = document.getElementById("todo-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

async function addTodo() {
  if (input.value.trim()) {
    await todoService.add(new ToDo("", input.value, false));
    const todos = await todoService.getAll();
    renderTodos(todos);
    console.log("Todo added:", input.value);
    input.value = "";
  }
}

// Add button click
addBtn.onclick = addTodo;

// Enter key in input
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
});

document.querySelectorAll("#emoji-bar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    input.value += btn.textContent;
    input.focus();
  });
});

todoService.getAll().then(renderTodos);
