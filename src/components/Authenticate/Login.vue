<script setup lang="ts">
import { ref } from 'vue';
import {type UserLoginRequestModel, type UserRegisterRequestModel } from '../../Models/API_Requests/API_Request_Models'
import {API_URL} from '../../Models/API_Requests/API_Request_URLs'
import {APIErrorCode, CommonSuccessCode, NetworkErrorCode} from '../../Models/Common/ErrorCodes'
import {type UserLoginResponseModel} from '../../Models/API_Responses/API_Response_Models'
import {LStorage} from '../../configurations/localStorage_Keys'
import {CoreConfiguration} from '../../configurations/coreConfig'
import {ReqHelper} from '../../helpers/RequestsHelper'
import { useScrollLock } from '@vueuse/core'

import { RLinks } from '@/configurations/routerLinks';
import { RouterHelper } from '@/helpers/RouterHelper';
let router = new RouterHelper()

const el = ref<HTMLElement | null>(null)
const scrollingLocked = useScrollLock(el)
scrollingLocked.value = false 

const titleText = ref("Login?")
// const username_placeholder = ref("Enter username????")
const username_placeholder = ref("Enter username")
const password_placeholder = ref("password")

const input_username =  ref(localStorage.getItem(LStorage.last_entered_username) ?? "")

const input_password = ref("")

const input_username_anim_class = ref("")
const input_password_anim_class = ref("")

const input_anim_class = "animate-shake animate-once"

const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const LoginBtnClicked = async() => {
    if (!InputsAreValid()) {return}
    try{
        localStorage.setItem(LStorage.last_entered_username, input_username.value)
        titleText.value = "Trying to Login..." 
        
        await delay(1000) //Fake loading time
        
        const req_body: UserLoginRequestModel = {
            username: input_username.value,
            password: input_password.value,
        }
        const login_response = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.UserLogin}`, req_body, router) as UserLoginResponseModel
        
        if (+login_response.code == CommonSuccessCode.APIRequestSuccess && login_response.authToken)
        {
            titleText.value = "Login success" 
            localStorage.setItem(LStorage.last_auth_token, login_response.authToken)
            router.RouteToPage(RLinks.Home)
            //Move to main screen
        }else if (+login_response.code == APIErrorCode.UserLoginRequest_UsernameOrPasswordIsIncorrect)
        {
            titleText.value = "Login failed" 
            password_placeholder.value = "Username or Password is incorrect"
            input_password.value = ""
            input_username_anim_class.value = input_anim_class
            input_password_anim_class.value = input_anim_class
            delay(1500).then(() => {
                input_username_anim_class.value = ""
                input_password_anim_class.value = ""
            })
        }else
        {
            console.log("Hmm?")
            console.log(login_response.message)
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

const GoToRegisterPage = async () => {
    router.RouteToPage(RLinks.RegisterPage)
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
<body class="bg-stone-950 grid grid-cols-1 h-screen w-screen place-content-center" >


        <div class="m-12 rounded-lg grid grid-rows-5 gap-2 pt-5 pb-7 bg-stone-900">

            <div class="min-h-10 rounded-lg shadow">
                <h3 class="text-center text-3xl">{{ titleText }}</h3>
            </div>

            <div class="grid place-items-center mx-7 rounded-lg shadow">
                <!-- <input :class="input_username_anim_class" type="text" :placeholder="username_placeholder" id="username" v-model="input_username"> -->
                <input :class="input_username_anim_class + 'min-h-12 min-w-full p-2 text-xl bg-gray-700 rounded-lg text-start'" type="text" :placeholder="username_placeholder" id="username" v-model="input_username">
            </div>

            <div class="grid place-items-center mx-7 rounded-lg shadow">
                <!-- <input :class="input_password_anim_class" type="password" :placeholder="password_placeholder" id="password" v-model="input_password"> -->
                <input :class="input_password_anim_class+'min-h-12 min-w-full p-2 text-xl bg-gray-700 rounded-lg text-start'" type="password" :placeholder="password_placeholder" id="password" v-model="input_password">
            </div>

            <div class="grid mx-7">
                <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-cyan-600 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="LoginBtnClicked" ><i></i>Login</button>
            </div>
            <div class="grid grid-cols-1 gap-5 mx-7 rounded-lg shadow">
                <div class="grid bg-slate-600">
                    <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-login-button-main-color hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="GoToRegisterPage">Go to Register Page</button>
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

</style>