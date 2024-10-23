<script setup lang="ts">
import { ref } from 'vue';
import {type UserLoginRequestModel, type UserRegisterRequestModel } from '../../Models/API_Requests/API_Request_Models'
import {API_URL} from '../../Models/API_Requests/API_Request_URLs'
import {APIErrorCode, CommonSuccessCode} from '../../Models/Common/ErrorCodes'
import {type UserLoginResponseModel} from '../../Models/API_Responses/API_Response_Models'
import {LStorage} from '../../configurations/localStorage_Keys'
import {CoreConfiguration} from '../../configurations/coreConfig'
import {ReqHelper} from '../../helpers/RequestsHelper'
import { useScrollLock } from '@vueuse/core'

import { useRouter } from 'vue-router';
import { RLinks } from '@/configurations/routerLinks';
let router = useRouter()

const el = ref<HTMLElement | null>(null)
const scrollingLocked = useScrollLock(el)
scrollingLocked.value = false 

const titleText = ref("Login?")
// const username_placeholder = ref("Enter username????")
const username_placeholder = ref("Enter username")
const password_placeholder = ref("Enter password")

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
        const login_response = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.UserLogin}`, req_body) as UserLoginResponseModel
        
        if (+login_response.code == CommonSuccessCode.APIRequestSuccess && login_response.authToken)
        {
            titleText.value = "Login success" 
            localStorage.setItem(LStorage.last_auth_token, login_response.authToken)
            router.push(RLinks.FindNearbyPlace)
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
            //TODO
        }
        
        
        
    }catch(e)
    {
        console.log(e)
    }
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
        }
        const register_response = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.UserRegister}`, req_body) as UserLoginResponseModel
        
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
        
        
        
    }catch(e)
    {
        console.log(e)
    }
}

const SkipBtnClicked = async () => {
    titleText.value = "Skipping..." 
    await delay(1000) // Fake loading time
    router.push(RLinks.FindNearbyPlace)
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
<body ref="el">
    <div class="background">
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    <form>
        <h3>{{ titleText }}</h3>

        <label for="username">Username</label>
        <input :class="input_username_anim_class" type="text" :placeholder="username_placeholder" id="username" v-model="input_username">

        <label for="password">Password</label>
        <input :class="input_password_anim_class" type="password" :placeholder="password_placeholder" id="password" v-model="input_password">

        <button type="button" class="transition ease-in-out delay-0 bg-white hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="LoginBtnClicked">Log In</button>
        <!-- <button type="button" class="" @click="LoginBtnClicked">Log In</button> -->
        <div class="social">
          <div class="go" type="button" @click="RegisterBtnClicked" ><i></i>Register</div>
          <div class="fb" @click="SkipBtnClicked"><i class=""></i>Skip</div>
        </div>
    </form>
</body>
</html>

</template>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;
*,
*:before,
*:after{
padding: 0;
margin: 0;
box-sizing: border-box;
}
body{
background-color: #080710;
}
.background{
width: 430px;
height: 520px;
position: absolute;
transform: translate(-50%,-50%);
left: 50%;
top: 50%;
}
.background .shape{
height: 200px;
width: 200px;
position: absolute;
border-radius: 50%;
}
.shape:first-child{
background: linear-gradient(
    #1845ad,
    #23a2f6
);
left: -80px;
top: -80px;
}
.shape:last-child{
background: linear-gradient(
    to right,
    #ff512f,
    #f09819
);
right: -30px;
bottom: -80px;
}
form{
height: 520px;
width: 400px;
background-color: rgba(255,255,255,0.13);
position: absolute;
transform: translate(-50%,-50%);
top: 50%;
left: 50%;
border-radius: 10px;
backdrop-filter: blur(10px);
border: 2px solid rgba(255,255,255,0.1);
box-shadow: 0 0 40px rgba(8,7,16,0.6);
padding: 50px 35px;
}
form *{
font-family: 'Poppins',sans-serif;
color: #ffffff;
letter-spacing: 0.5px;
outline: none;
border: none;
}
form h3{
font-size: 32px;
font-weight: 500;
line-height: 42px;
text-align: center;
}

label{
display: block;
margin-top: 30px;
font-size: 16px; 
font-weight: 500;
}
input{
display: block;
height: 50px;
width: 100%;
background-color: rgba(255,255,255,0.07);
border-radius: 3px;
padding: 0 10px;
margin-top: 8px;
font-size: 14px;
font-weight: 300;
}
::placeholder{
color: #e5e5e5;
}
button{
margin-top: 50px;
width: 100%;
background-color: #ffffff;
color: #080710;
padding: 15px 0;
font-size: 18px;
font-weight: 600;
border-radius: 5px;
cursor: pointer;
}
.social{
margin-top: 30px;
display: flex;
}
.social div{
background: red;
width: 150px;
border-radius: 3px;
padding: 5px 10px 10px 5px;
background-color: rgba(255,255,255,0.27);
color: #eaf0fb;
text-align: center;
}
.social div:hover{
background-color: rgba(255,255,255,0.47);
}
.social .fb{
margin-left: 25px;
}
.social i{
margin-right: 4px;
}


</style>