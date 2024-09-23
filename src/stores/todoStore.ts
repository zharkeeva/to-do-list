import { defineStore } from "pinia";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [] as Todo[],
  }),
  actions: {
    addTodo(text: string) {
      const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false,
      };
      this.todos.push(newTodo);
      this.saveToLocalStorage();
    },
    toggleTodoCompletion(id: number) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.completed = !todo.completed; // Меняем значение на противоположное
        this.saveToLocalStorage();
      }
    },
    removeTodo(id: number) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
      this.saveToLocalStorage();
    },
    editTodo(id: number, newText: string) {
      const todo = this.todos.find((todo) => todo.id === id);
      if (todo) {
        todo.text = newText;
        this.saveToLocalStorage();
      }
    },
    saveToLocalStorage() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
    },
    loadFromLocalStorage() {
      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos);
      }
    },
  },
});
