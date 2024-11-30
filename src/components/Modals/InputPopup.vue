<template>
    <div class="bg-popup-input/90 box-border h-40 w-3/4 border-4 text-center pt-0">
        <h2 class="text-2xl"> {{ title }}</h2>
            <div class="w-full mx-3 mt-2 mb-2">
                <!-- <input class="'min-h-12 min-w-full p-2 text-xl bg-gray-700 rounded-lg text-start'" type="text" :placeholder="placeholder" id="username" v-model="user_input"> -->
                <AutoComplete  class="min-h-12 w-full p-2 text-xl  rounded-lg text-start" forceSelection v-model="user_input" id="register_addr" variant="filled" :delay='200' size="large" :suggestions="found_suggestions" @complete="trigger_autocomplete" />
            </div>
        <button @click="$emit('confirm', {input:user_input})" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 p-1 w-1/3">{{ buttonText }}</button>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import AutoComplete from 'primevue/autocomplete';
import { eAddOption } from '@/core/clientEnums';
import { ReqHelper } from '@/helpers/RequestsHelper';
import { CoreConfiguration } from '@/configurations/coreConfig';
import { API_URL } from '@/Models/API_Requests/API_Request_URLs';
import { RouterHelper } from '@/helpers/RouterHelper';
const props = defineProps({
    title: String,
    placeholder: String,
    buttonText: String
})


console.log(props.title == eAddOption.AddFriend.toString())

const user_input = ref("")
const found_suggestions = ref([""])
const trigger_autocomplete = async () => {
    let router = new RouterHelper() 
    found_suggestions.value = ["placeholder"]
    if(props.title == eAddOption.AddFriend.toString())
    {

        const get_friends_list_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Socials_GetFriendsList}`, {}, router)
        if (Array.isArray(get_friends_list_result.result))
        {
            if (Array.isArray(get_friends_list_result.result))
            {
                found_suggestions.value = (get_friends_list_result.result as Array<string>).filter(r => r.startsWith(user_input.value))
            }
        }
    }

    if(props.title == eAddOption.AddAddress.toString())
    {

        let suggestions_result: {description: string, place_id: string}[] = []
        suggestions_result = await ReqHelper.GGMAP_GetAutoComplete_Predictions_FromServer(user_input.value, router)
        const suggestions = (suggestions_result).map((result => result.description))
        console.log(suggestions)
        found_suggestions.value = suggestions
    }
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