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


const loginArea = document.getElementById("login-area") as HTMLDivElement;
const loginNameInput = document.getElementById("login-name") as HTMLInputElement;
const loginBtn = document.getElementById("login-btn") as HTMLButtonElement;

// Try to load writer from localStorage
let writer = localStorage.getItem("writer");

// If not logged in, show login area
if (!writer) {
  loginArea.style.display = "block";
} else {
  loginArea.style.display = "none";
}

// Login button logic
loginBtn.onclick = () => {
  const name = loginNameInput.value.trim();
  if (name) {
    localStorage.setItem("writer", name);
    writer = name;
    loginArea.style.display = "none";
  }
};


const topicEl = document.getElementById("blog-topic") as HTMLElement;

async function loadTopic() {
  try {
    const response = await fetch(
      "https://682646d1397e48c9131598ef.mockapi.io/api/v1/blogTopic/1"
    );
    if (!response.ok) throw new Error("Topic not found");
    const data = await response.json();
    topicEl.textContent = data.content;
    console.log("Fetched topic:", data.content);
  } catch (err) {
    topicEl.textContent = "📝 My Simple Blog";
    console.warn("Topic fetch failed, using default.");
  }
}

loadTopic();

topicEl.addEventListener("blur", async () => {
  const newContent = topicEl.textContent?.trim() || "📝 My Simple Blog";
  await fetch(
    "https://682646d1397e48c9131598ef.mockapi.io/api/v1/blogTopic/1",
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    }
  );
});

const writerInput = document.getElementById("writer-input") as HTMLInputElement;




// In main.ts
function renderTodos(todos: ToDo[]) {
  const ul = document.getElementById("todo-list") as HTMLUListElement;
  ul.innerHTML = "";

  todos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    // Writer
    const writerSpan = document.createElement("span");
    writerSpan.className = "writer";
    writerSpan.textContent = todo.writer + ": ";
    writerSpan.style.fontWeight = "bold";
    writerSpan.style.color = "#4caf50";
    li.appendChild(writerSpan);

    // Comment text
    const textSpan = document.createElement("span");
    textSpan.className = "todo-text";
    textSpan.textContent = todo.text;
    li.appendChild(textSpan);

    // Button container (Update/Delete only)
    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    // Update Button
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "✏️";
    updateBtn.className = "action-btn update-btn";
    updateBtn.onclick = async () => {
      const newText = prompt("Update comment text:", todo.text);
      const newWriter = prompt("Update writer:", todo.writer);
      if (
        newText !== null &&
        newText.trim() !== "" &&
        newWriter !== null &&
        newWriter.trim() !== ""
      ) {
        todo.text = newText.trim();
        todo.writer = newWriter.trim();
        await todoService.update(todo);
        const updatedTodos = await todoService.getAll();
        renderTodos(updatedTodos);
      }
    };
    btnContainer.appendChild(updateBtn);

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.className = "action-btn delete-btn";
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

// When adding a comment, use the stored writer
async function addTodo() {
  if (input.value.trim() && writer) {
    await todoService.add(new ToDo("", input.value, writer));
    const todos = await todoService.getAll();
    renderTodos(todos);
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

function startPolling() {
  setInterval(async () => {
    const todos = await todoService.getAll();
    renderTodos(todos);
  }, 4000); // Fetch every 3 seconds
}

// Start polling after initial load
todoService.getAll().then(renderTodos);
startPolling();
