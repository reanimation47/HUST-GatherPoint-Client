<script setup lang="ts">
import { ref, type Ref } from 'vue';
import {type Social_AddFriend_Request_Model, type UserLoginRequestModel, type UserRegisterRequestModel } from '../../Models/API_Requests/API_Request_Models'
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

const input_username =  ref("")
const username_placeholder = ref("Enter friend's username")

const input_username_anim_class = ref("")
const input_anim_class = "animate-shake animate-once"
// const username_placeholder = ref("Enter username????")




const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const ProcessAddFriend = async () => {
    if (await InputsAreValid() == false) {return}
    const friend_username = input_username.value
    const request_body: Social_AddFriend_Request_Model = {
        username: friend_username
    }
    const add_friend_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Socials_AddFriend}`, request_body, router)
    if (add_friend_result.code == CommonSuccessCode.APIRequestSuccess)
    {
        input_username.value = ""
        username_placeholder.value = add_friend_result.message
    }else
    {
        console.warn(add_friend_result.message)
        input_username.value = ""
        username_placeholder.value = add_friend_result.message
        wiggleTextBox()
    }
    //TODO
}
const GoToFriendsListPage = () => {
    //TODO
}

const GoBack= () => {
    //TODO: clear credentials before going back to login back
    router.RouteToPage(RLinks.SocialPage)
}

const InputsAreValid = async() => {
    if (input_username.value === '')
    {
        await wiggleTextBox()
        return false
    }
    return true
}

const wiggleTextBox = async () => {
        input_username_anim_class.value = input_anim_class
        await delay(1500)
        input_username_anim_class.value = ""
        return Promise.resolve()
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


        <div class="bg-ui-box-color m-12 rounded-lg grid grid-rows-4 gap-2 pt-5 pb-7 ">

            <div class="min-h-10 rounded-lg shadow">
                <h3 class="text-ui-default-text-color text-center text-xl">{{ titleText }}</h3>
                <h3 class="text-center text-2xl text-green-900">{{ user_id }}</h3>
            </div>


            <div class="grid mx-7">
                <input :class="input_username_anim_class + 'min-h-12 min-w-full p-2 text-xl bg-gray-700 rounded-lg text-start'" type="text" :placeholder="username_placeholder" id="username" v-model="input_username">
            </div>


            <div class="grid mx-7">
                <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="ProcessAddFriend" ><i></i>Add Friends</button>
            </div>


            <div class="grid grid-cols-1 gap-5 mx-7 rounded-lg shadow">
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

</style>