<template>
    <div class="popup bg-popup-input/90 box-border pb-4 h-fit w-3/4 border-4 text-center pt-0">
        <h2 class="text-2xl"> {{ title }}</h2>
        <ul class="grid grid-flow-row grid-cols-1 gap-2 mt-4 mx-7">
            <li class="" v-for="option in options" >
                <button @click="$emit('confirm', {option:option})" type="button" class="text-ui-default-text-color2 rounded-lg min-h-10 w-full transition ease-in-out delay-0 bg-friend-list-item hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" >{{ option }}</button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import AutoComplete from 'primevue/autocomplete';
defineProps({
    title: String,
    options: Array
})
const user_input = ref("")
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