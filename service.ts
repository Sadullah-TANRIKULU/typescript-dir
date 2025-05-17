import { ToDo } from "./todo.js";
import { ToDoItem } from "./i-todo.js";

export class ToDoService {
  constructor(private apiUrl: string) {}

  async getAll(): Promise<ToDo[]> {
    const response = await fetch(this.apiUrl);
    if (!response.ok) throw new Error('Failed to fetch');
    const data: ToDoItem[] = await response.json();
    return data.map(item => new ToDo(item.id, item.text, item.writer));
  }

  async add(todo: ToDoItem): Promise<ToDo> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    const data = await response.json();
    return new ToDo(data.id, data.text, data.writer);
  }

  async update(todo: ToDoItem): Promise<ToDo> {
    const response = await fetch(`${this.apiUrl}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('Failed to update comment');
    const data = await response.json();
    return new ToDo(data.id, data.text, data.writer);
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  }
}
