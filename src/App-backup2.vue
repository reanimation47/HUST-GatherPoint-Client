<script setup lang="ts">
import { ref, onMounted } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
const name = ref('Test Name')
const status = ref('inactive')
const list_test = ref(["item1", "item2", "item3"])
const toggleStatus = () => {
    status.value = status.value === "active" ? "inactive" : "active"
}

const newTask = ref('')
const addTask = ():void => {
    if (newTask.value.trim() !== "")
    {
        list_test.value.push(newTask.value)
        newTask.value = ""
    }
}

const deleteTask = (index: number) => {
    list_test.value.splice(index, 1)
}

onMounted( async () => {
    try {
        
    }catch{
        
    }
})

</script>
<template>
<header>
    <h1>Vue jobss</h1>
    <h1> User status is {{ status }}</h1>
    <br>
    <button @click="toggleStatus"> Test status btn</button>
    <ul>
        <li v-for="(task, index) in list_test" :key="task">
            <span>
                {{ task }}
                <button @click="deleteTask(+index)">Delete</button>
            </span>
        </li>
    </ul>
    
    <form @submit.prevent = "addTask">
        <label for="newTask">Add Task</label>
        <br>
        <input type="text" id="newTask" name="newTask" v-model="newTask">
        <br>
        <button type="submit">Submit</button>
    </form>
</header>
<main>
    <!-- <TheWelcome/> -->
</main>
</template>

