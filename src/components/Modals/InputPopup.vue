<template>
    <div class="bg-popup-input/90 box-border h-40 w-3/4 border-4 text-center pt-0">
        <h2 class="text-2xl"> {{ title }}</h2>
            <div class="w-full mx-3 mt-2 mb-2">
                <!-- <input class="'min-h-12 min-w-full p-2 text-xl bg-gray-700 rounded-lg text-start'" type="text" :placeholder="placeholder" id="username" v-model="user_input"> -->
                <AutoComplete  class="min-h-12 w-full p-2 text-xl  rounded-lg text-start" forceSelection v-model="user_input" id="register_addr" variant="filled" :delay='200' size="large" :suggestions="test_suggestions" @complete="trigger_autocomplete" />
            </div>
        <button @click="$emit('confirm', {input:user_input})" class="bg-slate-800 rounded-lg p-1 w-1/3">{{ buttonText }}</button>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import AutoComplete from 'primevue/autocomplete';
defineProps({
    title: String,
    placeholder: String,
    buttonText: String
})
const user_input = ref("")
const test_suggestions = ref([
    "hello",
    "abc"
])
const trigger_autocomplete = () => {
    test_suggestions.value = ["hellooooooooo", "whattttttttttttt"]
}
</script>
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;


/* .p-autocomplete
{
    width: 100%;
    height: 3rem;
    border-radius: 0.5rem;
} */
 /* #register_addr
 {
    width: 100%;
    height: 3rem;
    border-radius: 0.5rem;
 } */

</style>