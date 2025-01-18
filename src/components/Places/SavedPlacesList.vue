<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import {LStorage} from '../../configurations/localStorage_Keys'

import { RLinks } from '@/configurations/routerLinks';
import { RouterHelper } from '@/helpers/RouterHelper';
let router = new RouterHelper() 


const titleText = ref("Logged in as") //TODO: reminder to maybe unify this tittle into 1 module. As so many screens use this.
const user_id = ref(sessionStorage.getItem(LStorage.last_entered_username) ?? "unknown") //TODO: should we even display unknown? Or just force user to log in again..
// const username_placeholder = ref("Enter username????")

const eOptions = {
    FavoritePlaces: "Favorite Places",
    SharedWithMe: "Shared With Me",
}

const options_saved_places = ref([
    eOptions.FavoritePlaces,
    eOptions.SharedWithMe,
])

onBeforeMount( async () => {
    // console.log("before?")
    // // Get the friend list from server
    // const get_friends_list_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Socials_GetFriendsList}`, {}, router)
    // console.log(get_friends_list_result.code)
    // console.log(get_friends_list_result.result)
    // console.log(Array.isArray(get_friends_list_result.result))
    // if (Array.isArray(get_friends_list_result.result))
    // {
    //     options_saved_places.value = get_friends_list_result.result
    //     console.log(get_friends_list_result.result)
    // }
})



const GoBack = () => {
    router.RouteToPage(RLinks.PlacesPage)
}

//Friend Items 

const ItemClicked = async (option: string) => {
    if (option == eOptions.FavoritePlaces)
    {
        router.RouteToPage(RLinks.FavoritePlaces)
    }
    else if (option == eOptions.SharedWithMe)
    {
        router.RouteToPage(RLinks.ShareWithMePlaces)
    }

}


</script>

<template>
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Design by foolishdeveloper.com -->
    <title>Glassmorphism login Form Tutorial in html css</title>
 
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap" rel="stylesheet">
    <!--Stylesheet-->
</head>
<body class="bg-ui-default-bg-color grid grid-cols-1 h-screen w-screen place-content-center" >


        <div class="m-12 rounded-lg gap-2 pt-5 pb-7 bg-ui-box-color">

            <div class="min-h-10 rounded-lg shadow">
                <h3 class="text-center text-xl text-ui-default-text-color">{{ titleText }}</h3>
                <h3 class="text-center text-2xl text-green-900">{{ user_id }}</h3>
            </div>






            <div>
                <ul class="grid grid-flow-row grid-cols-1 gap-2 mt-4 mx-7">
                    <li class="" v-for="option in options_saved_places" >
                        <button type="button" class="text-ui-default-text-color2 rounded-lg min-h-10 w-full transition ease-in-out delay-0 bg-friend-list-item hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="ItemClicked(option)">{{ option }}</button>
                    </li>
                </ul>
            </div>

            <div class="grid h-12 grid-cols-1 mt-3 mx-7 rounded-lg shadow">
                <div class="grid bg-slate-600">
                    <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-login-button-main-color hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="GoBack">Go back</button>
                </div>
            </div>
        </div>







</body>
</html>

</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
body {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-0 -0 10 10'%3E%3Cpath d='M 0 1 L 10 1 M 1 0 L 1 10' stroke='%23404040' stroke-dasharray='1' stroke-width='0.1' /%3E%3C/svg%3E"); 
    background-size: 30px 30px;
}

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

 .modal{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
 }

</style>