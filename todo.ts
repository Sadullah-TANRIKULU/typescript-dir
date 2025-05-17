// todo.ts
import { ToDoItem } from "./i-todo.js"; // adjust the path as needed

export class ToDo implements ToDoItem {
  constructor(
    public id: string,
    public text: string,
    public writer: string,
  ) {}






  
}
