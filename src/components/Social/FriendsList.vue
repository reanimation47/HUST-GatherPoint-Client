<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';
import {type UserLoginRequestModel, type UserRegisterRequestModel } from '../../Models/API_Requests/API_Request_Models'
import {API_URL} from '../../Models/API_Requests/API_Request_URLs'
import {APIErrorCode, CommonSuccessCode, NetworkErrorCode} from '../../Models/Common/ErrorCodes'
import {type Get_Friend_Address_Response_Model, type UserLoginResponseModel} from '../../Models/API_Responses/API_Response_Models'
import {LStorage} from '../../configurations/localStorage_Keys'
import {CoreConfiguration} from '../../configurations/coreConfig'
import {ReqHelper} from '../../helpers/RequestsHelper'
import axios from 'axios'
import { useScrollLock } from '@vueuse/core'

import AutoComplete from 'primevue/autocomplete';

import OptionsPopup from '../Modals/OptionsPopup.vue';

import { RLinks } from '@/configurations/routerLinks';
import { Capacitor } from '@capacitor/core';
import { RouterHelper } from '@/helpers/RouterHelper';
let router = new RouterHelper() 


const titleText = ref("Logged in as") //TODO: reminder to maybe unify this tittle into 1 module. As so many screens use this.
const user_id = ref(sessionStorage.getItem(LStorage.last_entered_username) ?? "unknown") //TODO: should we even display unknown? Or just force user to log in again..
// const username_placeholder = ref("Enter username????")

const list_friends = ref([
    "Friend 1",
    "Friend 2",
    "Friend 3",
    "Friend 4",
])

onBeforeMount( async () => {
    console.log("before?")
    // Get the friend list from server
    const get_friends_list_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Socials_GetFriendsList}`, {}, router)
    console.log(get_friends_list_result.code)
    console.log(get_friends_list_result.result)
    console.log(Array.isArray(get_friends_list_result.result))
    if (Array.isArray(get_friends_list_result.result))
    {
        list_friends.value = get_friends_list_result.result
        console.log(get_friends_list_result.result)
    }
})




const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}



const GoBack = () => {
    router.RouteToPage(RLinks.SocialPage)
}

//Friend Items 

const FRIEND_ITEM_OPTIONS = {
    ADDRESS: "Address: $user_address$",
    REMOVE_FRIEND: "Remove Friend",
    CLOSE: "Close"
}
const arr_info:string[] = []
const show_friend_info = ref(false)
const friend_info_options = ref(arr_info)

const target_friend_username = ref("")
let target_friend_address_place_id = "" //Store most recently selected friend's address's place_id
const FriendItemClicked = async (friend_username: string) => {

    try {
        const get_friends_address_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Socials_GetFriendAddress}`, {username: friend_username}, router) as Get_Friend_Address_Response_Model
        if (get_friends_address_result.code == CommonSuccessCode.APIRequestSuccess && get_friends_address_result.address && get_friends_address_result.address_place_id)
        {
            arr_info.push(FRIEND_ITEM_OPTIONS.ADDRESS.replace("$user_address$", get_friends_address_result.address))
            target_friend_address_place_id = get_friends_address_result.address_place_id
        }else
        {
            arr_info.push("Error trying to retrieve this user's address")
        }
    }catch
    {
        arr_info.push("Error trying to retrieve this user's address")
    }

    arr_info.push(FRIEND_ITEM_OPTIONS.REMOVE_FRIEND)
    arr_info.push(FRIEND_ITEM_OPTIONS.CLOSE)
    target_friend_username.value = friend_username
    show_friend_info.value = true
    //TODO
}

const FriendItemPopupItemClicked = (option:{option:string}) => {
    arr_info.length = 0 //Clear array?

    if (option.option == FRIEND_ITEM_OPTIONS.CLOSE)
    {
        show_friend_info.value = false
    }
    else if (option.option == FRIEND_ITEM_OPTIONS.REMOVE_FRIEND)
    {
        show_friend_info.value = false
        //TODO
    }else if (option.option.startsWith(FRIEND_ITEM_OPTIONS.ADDRESS.replace("$user_address$", "")))
    {
        router.RedirectToGoogleMap(target_friend_address_place_id)
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

        <Teleport to="body" v-if="show_friend_info">
            <div class="modal">
                <options-popup
                    :title=target_friend_username
                    placeholder="input here pls"
                    buttonText="Confirm"
                    :options="friend_info_options"
                    @confirm="FriendItemPopupItemClicked"
                />
                
            </div>
        </Teleport>

        <div class="m-12 rounded-lg gap-2 pt-5 pb-7 bg-ui-box-color">

            <div class="min-h-10 rounded-lg shadow">
                <h3 class="text-center text-xl text-ui-default-text-color">{{ titleText }}</h3>
                <h3 class="text-center text-2xl text-green-900">{{ user_id }}</h3>
            </div>






            <div>
                <ul class="grid grid-flow-row grid-cols-1 gap-2 mt-4 mx-7">
                    <li class="" v-for="friend in list_friends" >
                        <button type="button" class="text-ui-default-text-color2 rounded-lg min-h-10 w-full transition ease-in-out delay-0 bg-friend-list-item hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="FriendItemClicked(friend)">{{ friend }}</button>
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