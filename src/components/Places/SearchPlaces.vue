
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
import Dropdown from 'primevue/dropdown';
import InputPopup from '../Modals/InputPopup.vue';
import OptionsPopup from '../Modals/OptionsPopup.vue';

let router = new RouterHelper() 


const titleText = ref("Logged in as")
const user_id = ref(sessionStorage.getItem(LStorage.last_entered_username) ?? "unknown")
// const username_placeholder = ref("Enter username????")

const selectedPlaceType = ref()
const placeTypes = ref([
    {type: "coffee", code: 1},
    {type: "restaurant", code: 2},
])

const selectedPreference= ref()
const preferences = ref([
    {type: "Prefer optimized distances", code: 1},
    {type: "Prefer higher rated places", code: 2},
])

const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


//Add options
const showAddOption = ref(false)
const pickedAddOption = ref()
const showUserInputBox = ref(false)

enum eAddOption{
    AddFriend = "Add a friend",
    AddAddress = "Add an address"
}
const addOptions = ref([
    eAddOption.AddFriend.toString(),
    eAddOption.AddAddress.toString(),
])



const AddButtonClicked = () => {
    showAddOption.value = true
}

const UserPickedAddOption = (option: {option:string}) =>
{
    showAddOption.value = false 
    showUserInputBox.value = true
    if (option.option == eAddOption.AddFriend)
    {
        pickedAddOption.value = eAddOption.AddFriend
        console.log("add fr")
    }

    if (option.option == eAddOption.AddAddress)
    {
        pickedAddOption.value = eAddOption.AddAddress
        console.log("add addr")
    }
}

const confirmedAddresses: Ref<any,any> = ref([])
const UserConfirmInput = (option: {input:string}) => {
    console.log(option.input)
    showUserInputBox.value = false 
    confirmedAddresses.value.push(option.input)
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
        <Teleport to="body" v-if="showAddOption">
            <div class="modal">
                <options-popup
                    title="What do you want to add?"
                    placeholder="input here pls"
                    buttonText="Confirm"
                    :options="addOptions"
                    @confirm="UserPickedAddOption"
                />
                
            </div>
        </Teleport>

        <Teleport to="body" v-if="showUserInputBox">
            <div class="modal">
                <input-popup
                    :title="pickedAddOption"
                    placeholder="input here pls"
                    buttonText="Confirm"
                    @confirm="UserConfirmInput"
                />
                
            </div>
        </Teleport>


        <div class="m-12 rounded-lg grid gap-2 pt-5 pb-7 bg-ui-box-color">

            <div class="min-h-10 rounded-lg shadow">
                <h3 class="text-center text-xl text-ui-default-text-color">{{ titleText }}</h3>
                <h3 class="text-center text-2xl text-green-900">{{ user_id }}</h3>
            </div>

            <div class="min-h-10 grid mx-7 gap-2 rounded-lg shadow">
                <h3 class="text-center text-xl text-ui-default-text-color">Options</h3>
                <Dropdown v-model="selectedPlaceType" :options="placeTypes" optionLabel="type" placeholder="Select places type" checkmark :highlightOnSelect="false" class="w-full"  />
                <Dropdown v-model="selectedPreference" :options="preferences" optionLabel="type" placeholder="Select preference" checkmark :highlightOnSelect="false" class="w-full"  />
            </div>


            <div class="min-h-10 grid mx-7 gap-2 rounded-lg shadow">
                <h3 class="text-center text-xl text-ui-default-text-color">Input addresses</h3>
            </div>


            <div class="grid mx-20 h-11">
                <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="AddButtonClicked" ><i></i>Add</button>
            </div>

            <ul class="grid grid-flow-row grid-cols-1 gap-2 mt-4 mx-7">
                <li class="" v-for="address in confirmedAddresses" >
                    <button @click="" type="button" class="bg-ui-default-main-button text-ui-default-text-color rounded-lg min-h-10 w-full transition ease-in-out delay-0  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" >{{ address }}</button>
                </li>
            </ul>


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