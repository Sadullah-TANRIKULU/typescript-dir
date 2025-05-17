// todo.ts
import { ToDoItem } from "./i-todo.js"; // adjust the path as needed

export class ToDo implements ToDoItem {
  constructor(
    public id: string,
    public text: string,
    public completed: boolean = false
  ) {}

  toggle(): void {
    this.completed = !this.completed;
  }






  
}
