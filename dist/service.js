var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ToDo } from "./todo.js";
export class ToDoService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.apiUrl);
            if (!response.ok)
                throw new Error('Failed to fetch');
            const data = yield response.json();
            return data.map(item => new ToDo(item.id, item.text, item.writer));
        });
    }
    add(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });
            if (!response.ok)
                throw new Error('Failed to add comment');
            const data = yield response.json();
            return new ToDo(data.id, data.text, data.writer);
        });
    }
    update(todo) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.apiUrl}/${todo.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo),
            });
            if (!response.ok)
                throw new Error('Failed to update comment');
            const data = yield response.json();
            return new ToDo(data.id, data.text, data.writer);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok)
                throw new Error('Failed to delete comment');
        });
    }
}
