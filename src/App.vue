<template>
  <div class="todo-app">
    <h1>To-Do List</h1>
    <div class="input-group">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new task"
      />
      <button @click="addTodo" :disabled="!newTodo.trim()">Add</button>
    </div>

    <ul v-if="todos.length > 0">
      <li v-for="todo in todos" :key="todo.id" class="todo-item">
        <input
          type="checkbox"
          :checked="todo.completed"
          @change="toggleCompletion(todo.id)"
        />
        <span
          :class="{ completed: todo.completed }"
          @dblclick="startEditing(todo)"
        >
          {{ editingTodo === todo.id ? "" : todo.text }}
        </span>
        <input
          v-if="editingTodo === todo.id"
          v-model="editedText"
          @blur="finishEditing(todo.id)"
          @keyup.enter="finishEditing(todo.id)"
        />
        <button @click="removeTodo(todo.id)">Remove</button>
      </li>
    </ul>

    <p v-else>No tasks yet. Add one above!</p>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTodoStore } from "./stores/todoStore";

export default {
  setup() {
    const todoStore = useTodoStore();
    const newTodo = ref("");
    const editingTodo = ref<number | null>(null);
    const editedText = ref("");

    const addTodo = () => {
      if (!newTodo.value.trim()) {
        return; // Если инпут пустой, ничего не делаем
      }
      todoStore.addTodo(newTodo.value.trim());
      newTodo.value = ""; // Очищаем поле ввода
    };

    const toggleCompletion = (id: number) => {
      todoStore.toggleTodoCompletion(id);
    };

    const removeTodo = (id: number) => {
      todoStore.removeTodo(id);
    };

    const startEditing = (todo: { id: number; text: string }) => {
      editingTodo.value = todo.id;
      editedText.value = todo.text;
    };

    const finishEditing = (id: number) => {
      if (editedText.value.trim()) {
        todoStore.editTodo(id, editedText.value.trim());
      }
      editingTodo.value = null;
      editedText.value = "";
    };

    onMounted(() => {
      todoStore.loadFromLocalStorage();
    });

    const todos = computed(() => todoStore.todos);

    return {
      newTodo,
      todos,
      addTodo,
      toggleCompletion,
      removeTodo,
      editingTodo,
      editedText,
      startEditing,
      finishEditing,
    };
  },
};
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-group input {
  flex: 1;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 12px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #4cae4c;
}

ul {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-item input[type="checkbox"] {
  margin-right: 10px;
}

.todo-item .completed {
  text-decoration: line-through;
  color: #aaa;
}
</style>
