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

const maps_api_secret = import.meta.env.VITE_APP_MAPS_API_SECRET

let addr_autocomplete_minlength = 4

const el = ref<HTMLElement | null>(null)
const scrollingLocked = useScrollLock(el)
scrollingLocked.value = false 

const titleText = ref("Register")
// const username_placeholder = ref("Enter username????")
const username_placeholder = ref("username")
const password_placeholder = ref("password")
const address_placeholder = ref("address")

const input_username =  ref(sessionStorage.getItem(LStorage.last_entered_username) ?? "")
const input_password = ref("")
const input_address = ref("")

const input_username_anim_class = ref("")
const input_password_anim_class = ref("")
const input_address_anim_class = ref("")

const input_anim_class = "animate-shake animate-once"

const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let addresses_suggest_Items: Ref<string[], string[]> = ref([])
let suggestions_result: {description: string, place_id: string}[] = []
const addressAutoComplete = async (event:any) => {
    console.log("1")
    // if (true) {return}
    if (input_address.value == "") {return}
    console.log("2")
    if (event.query.length < addr_autocomplete_minlength) {return}
    console.log("3")

    suggestions_result = await ReqHelper.GGMAP_GetAutoComplete_Predictions_FromServer(event.query, router)
    const suggestions = (suggestions_result).map((result => result.description))
    console.log(suggestions)
    addresses_suggest_Items.value = suggestions
    // addresses_suggest_Items.value = (await ReqHelper.GGMAP_GetAutoComplete_Predictions_FromServer(event.query, router))
}


const RegisterBtnClicked = async () => {
    if (!InputsAreValid()) {return}
    try{
        // localStorage.setItem(LStorage.last_entered_username, input_username.value)
        titleText.value = "Trying to register..." 
        
        await delay(1000) //Fake loading time
        
        const req_body: UserRegisterRequestModel = {
            username: input_username.value,
            password: input_password.value,
            address: input_address.value,
            address_place_id: suggestions_result.find(result => result.description == input_address.value)?.place_id ?? "Empty"
        }
        //test
        // await ReqHelper.GGMAP_Get_GeoLocation_By_Address(req_body.address)

        const register_response = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.UserRegister}`, req_body, router) as UserLoginResponseModel
        
        if (+register_response.code == CommonSuccessCode.APIRequestSuccess)
        {
            titleText.value = "Register success, please login" 
            input_password.value = ""
        }
        else if (+register_response.code == APIErrorCode.UserRegisterRequest_UserAlreadyExist)
        {
            titleText.value = "Register failed" 
            password_placeholder.value = ""
            username_placeholder.value = "Username already exists"
            input_password.value = ""
            input_username.value = ""
            input_username_anim_class.value = input_anim_class
            input_password_anim_class.value = input_anim_class
            delay(1500).then(() => {
                input_username_anim_class.value = ""
                input_password_anim_class.value = ""
            })
        }
        else
        {
            titleText.value = "Register failed, please try again" 
            password_placeholder.value = ""
            // username_placeholder.value = "Username already exists"
            input_password.value = ""
            input_username_anim_class.value = input_anim_class
            input_password_anim_class.value = input_anim_class
            delay(1500).then(() => {
                input_username_anim_class.value = ""
                input_password_anim_class.value = ""
            })
            //TODO
        }
        
        
        
    }catch(e:any)
    {
        if (e.code){
            if (e.code = NetworkErrorCode.CannotReachBackendServer)
            {
                titleText.value = "Server is not reachable" 
            }
        }
    }
}


const GoToLoginPage = async () => {
    router.RouteToPage(RLinks.LoginPage)
}

// const SendPostRequest = async (request_url:string ,body:any) => {
//     const requestOptions = {
//         method: 'POST',
//         headers: { 
//             'Content-Type': 'application/json', 
//             'Access-Control-Allow-Origin':'*', 
//             'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS',
//             'AuthToken' : localStorage.getItem(LStorage.last_auth_token) ?? ""
//         },
//         body: JSON.stringify(body)
//     };
//     const response = await fetch(request_url, requestOptions)
//     const data = response.json()
//     return data
//         // .then(response => response.json())
//         // .then(data => console.log(data));
// }

const InputsAreValid = (): boolean => {
    if (input_username.value === '')
    {
        username_placeholder.value = "Username CANNOT be empty!"
        input_username_anim_class.value = input_anim_class
        delay(1500).then(() => {
            input_username_anim_class.value = ""
        })
        return false
    }
    if (input_password.value === '')
    {
        password_placeholder.value = "Password CANNOT be empty!"
        input_password_anim_class.value = input_anim_class
        delay(1500).then(() => {
            input_password_anim_class.value = ""
        })
        return false
    }
    if (input_address.value === '')
    {
        address_placeholder.value = "address CANNOT be empty!"
        input_address_anim_class.value = input_anim_class
        delay(1500).then(() => {
            input_address_anim_class.value = ""
        })
        return false
    }

    return true
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


        <div class="m-12 rounded-lg grid grid-rows-6 gap-2 pt-5 pb-7 bg-ui-box-color">

            <div class="min-h-10 rounded-lg shadow">
                <h3 class="text-stone-900 text-center text-3xl">{{ titleText }}</h3>
            </div>

            <div class="grid place-items-center mx-7 rounded-lg shadow">
                <!-- <input :class="input_username_anim_class" type="text" :placeholder="username_placeholder" id="username" v-model="input_username"> -->
                <input :class="input_username_anim_class + 'min-h-12 min-w-full p-2 text-xl bg-ui-default-input-color text-stone-900 rounded-lg text-start'" type="text" :placeholder="username_placeholder" id="username" v-model="input_username">
            </div>

            <div class="grid place-items-center mx-7 rounded-lg shadow">
                <!-- <input :class="input_password_anim_class" type="password" :placeholder="password_placeholder" id="password" v-model="input_password"> -->
                <input :class="input_password_anim_class+'min-h-12 min-w-full p-2 text-xl bg-ui-default-input-color text-stone-900 rounded-lg text-start'" type="password" :placeholder="password_placeholder" id="password" v-model="input_password">
            </div>

            <div class="grid place-items-center mx-7 rounded-lg shadow">
                <!-- <input :class="input_address_anim_class + 'min-h-12 min-w-full p-2 text-xl bg-gray-700 rounded-lg text-start'" type="text" :placeholder="address_placeholder" id="address" v-model="input_address"> -->
                <AutoComplete class="min-h-12 min-w-full p-2 text-xl bg-ui-default-input-color text-stone-900 rounded-lg text-start" inputClass="bg-slate-100" panelClass="bg-slate-100" v-model="input_address" forceSelection id="register_addr" variant="filled" :delay='1500' size="large" :suggestions="addresses_suggest_Items" @complete="addressAutoComplete" />
            </div>

            <div class="grid mx-7">
                <button type="button" class="text-stone-950 rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="RegisterBtnClicked" ><i></i>Register</button>
            </div>

            <div class="grid grid-cols-1 gap-5 mx-7 rounded-lg shadow">
                <div class="grid bg-slate-600">
                    <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-secondary-button hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="GoToLoginPage">Go To Login Page</button>
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