// i-todo.ts
export interface ToDoItem {
id: string;
text: string;
completed: boolean;

toggle(): void;
}