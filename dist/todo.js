export class ToDo {
    constructor(id, text, completed = false) {
        this.id = id;
        this.text = text;
        this.completed = completed;
    }
    toggle() {
        this.completed = !this.completed;
    }
}
