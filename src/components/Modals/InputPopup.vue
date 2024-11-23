<template>
    <div class="bg-stone-500">
        <h2> {{ title }}</h2>
        <p>{{ msg }}</p>
        <button class="bg-slate-800 rounded-lg">Button</button>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
defineProps({
    title: String,
    msg: String
})
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