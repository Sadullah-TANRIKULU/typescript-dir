// main.ts
import { ToDoService } from "./service";
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
