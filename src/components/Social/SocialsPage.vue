<script setup lang="ts">
import { ref, type Ref } from 'vue';
import {type UserLoginRequestModel, type UserRegisterRequestModel } from '../../Models/API_Requests/API_Request_Models'
import {API_URL} from '../../Models/API_Requests/API_Request_URLs'
import {APIErrorCode, CommonSuccessCode, NetworkErrorCode} from '../../Models/Common/ErrorCodes'
import {type UserLoginResponseModel} from '../../Models/API_Responses/API_Response_Models'
import {LStorage} from '../../configurations/localStorage_Keys'
import {CoreConfiguration} from '../../configurations/coreConfig'
import {ReqHelper} from '../../helpers/RequestsHelper'
import axios from 'axios'
import { useScrollLock } from '@vueuse/core'

import AutoComplete from 'primevue/autocomplete';


import { RLinks } from '@/configurations/routerLinks';
import { Capacitor } from '@capacitor/core';
import { RouterHelper } from '@/helpers/RouterHelper';
let router = new RouterHelper() 


const titleText = ref("Logged in as")
const user_id = ref(sessionStorage.getItem(LStorage.last_entered_username) ?? "unknown")
// const username_placeholder = ref("Enter username????")




const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const GoToAddFriendsPage = () => {
    router.RouteToPage(RLinks.AddFriends)
}
const GoToFriendsListPage = () => {
    router.RouteToPage(RLinks.FriendsList)
}

const Logout= () => {
    //TODO: clear credentials before going back to login back
    router.RouteToPage(RLinks.Home)
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


        <div class="m-12 rounded-lg grid grid-rows-4 gap-2 pt-5 pb-7 bg-ui-box-color">

            <div class="min-h-10 rounded-lg shadow">
                <h3 class="text-center text-xl text-ui-default-text-color">{{ titleText }}</h3>
                <h3 class="text-center text-2xl text-green-900">{{ user_id }}</h3>
            </div>




            <div class="grid mx-7">
                <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="GoToAddFriendsPage" ><i></i>Add Friends</button>
            </div>

            <div class="grid mx-7">
                <button type="button" class="text-ui-default-text-color2 rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="GoToFriendsListPage" ><i></i>Friends list</button>
            </div>

            <div class="grid grid-cols-1 gap-5 mx-7 rounded-lg shadow">
                <div class="grid bg-slate-600">
                    <button type="button" class="text-ui-default-text-color2 rounded-lg transition ease-in-out delay-0 bg-ui-default-secondary-button hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="Logout">Go back</button>
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

</style>