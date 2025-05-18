var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const loginArea = document.getElementById("login-area");
const loginNameInput = document.getElementById("login-name");
const loginBtn = document.getElementById("login-btn");
// Try to load writer from localStorage
let writer = localStorage.getItem("writer");
// If not logged in, show login area
if (!writer) {
    loginArea.style.display = "block";
}
else {
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
const topicEl = document.getElementById("blog-topic");
function loadTopic() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://682646d1397e48c9131598ef.mockapi.io/api/v1/blogTopic/1");
            if (!response.ok)
                throw new Error("Topic not found");
            const data = yield response.json();
            topicEl.textContent = data.content;
            console.log("Fetched topic:", data.content);
        }
        catch (err) {
            topicEl.textContent = "📝 My Simple Blog";
            console.warn("Topic fetch failed, using default.");
        }
    });
}
loadTopic();
topicEl.addEventListener("blur", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const newContent = ((_a = topicEl.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "📝 My Simple Blog";
    yield fetch("https://682646d1397e48c9131598ef.mockapi.io/api/v1/blogTopic/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
    });
}));
const writerInput = document.getElementById("writer-input");
// In main.ts
function renderTodos(todos) {
    const ul = document.getElementById("todo-list");
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
        updateBtn.textContent = "Update";
        updateBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            const newText = prompt("Update comment text:", todo.text);
            const newWriter = prompt("Update writer:", todo.writer);
            if (newText !== null &&
                newText.trim() !== "" &&
                newWriter !== null &&
                newWriter.trim() !== "") {
                todo.text = newText.trim();
                todo.writer = newWriter.trim();
                yield todoService.update(todo);
                const updatedTodos = yield todoService.getAll();
                renderTodos(updatedTodos);
            }
        });
        btnContainer.appendChild(updateBtn);
        // Delete Button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            yield todoService.delete(todo.id);
            const updatedTodos = yield todoService.getAll();
            renderTodos(updatedTodos);
        });
        btnContainer.appendChild(deleteBtn);
        li.appendChild(btnContainer);
        ul.appendChild(li);
    });
}
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
// When adding a comment, use the stored writer
function addTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        if (input.value.trim() && writer) {
            yield todoService.add(new ToDo("", input.value, writer));
            const todos = yield todoService.getAll();
            renderTodos(todos);
            input.value = "";
        }
    });
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
