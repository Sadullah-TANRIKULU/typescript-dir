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
// In main.ts
function renderTodos(todos) {
    const ul = document.getElementById("todo-list");
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
        toggleBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            yield todoService.toggleTodo(todo);
            const updatedTodos = yield todoService.getAll();
            renderTodos(updatedTodos);
        });
        btnContainer.appendChild(toggleBtn);
        // Update Button
        const updateBtn = document.createElement("button");
        updateBtn.textContent = "Update";
        updateBtn.onclick = () => __awaiter(this, void 0, void 0, function* () {
            const newText = prompt("Update todo text:", todo.text);
            if (newText !== null && newText.trim() !== "") {
                todo.text = newText.trim();
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
function addTodo() {
    return __awaiter(this, void 0, void 0, function* () {
        if (input.value.trim()) {
            yield todoService.add(new ToDo("", input.value, false));
            const todos = yield todoService.getAll();
            renderTodos(todos);
            console.log("Todo added:", input.value);
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
const clearAllBtn = document.getElementById("clear-all-btn");
clearAllBtn.onclick = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!confirm("Are you sure you want to delete all todos?"))
        return;
    const todos = yield todoService.getAll();
    yield Promise.all(todos.map((todo) => todoService.delete(todo.id)));
    renderTodos([]);
});
todoService.getAll().then(renderTodos);
