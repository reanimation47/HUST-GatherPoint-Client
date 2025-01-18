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
import type { LocationInfo } from '@/Models/Database/DB_UserModel';
let router = new RouterHelper() 


const titleText = ref("Logged in as") //TODO: reminder to maybe unify this tittle into 1 module. As so many screens use this.
const user_id = ref(sessionStorage.getItem(LStorage.last_entered_username) ?? "unknown") //TODO: should we even display unknown? Or just force user to log in again..
// const username_placeholder = ref("Enter username????")


const list_saved_places = ref()

onBeforeMount( async () => {
    try{
        const get_fav_places_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.UserGetPlacesFromFavorites}`, {}, router) 
        if (get_fav_places_result.code == CommonSuccessCode.APIRequestSuccess) 
        {
            list_saved_places.value = (get_fav_places_result.result as LocationInfo[])
        }
    }catch(e)
    {
        //TODO
    }
})




const GoBack = () => {
    router.RouteToPage(RLinks.SavedPlaces)
}

//Place Items 

const eItemPopupOptions = {
    CLOSE: "Close",
    REMOVE: "Remove from favorites",
    ADDRESS: "Address: $place_address$",
    RATING: "Rating: $rating$*",
    REDIRECT_TO_GGMAP: "See place on Google Map",
}

const ItemPopup_ButtonOptions: string[] = []
const ItemPopup_Descriptions: string[] = []

const show_place_info_popup = ref(false)
const target_clicked_place = ref()

const ItemClicked = async (item: any) => {
    //reset 
    ItemPopup_ButtonOptions.length = 0
    ItemPopup_Descriptions.length = 0

    let place_info = item as LocationInfo
    target_clicked_place.value = place_info
    try {
        show_place_info_popup.value = true
        const str_address = eItemPopupOptions.ADDRESS.replace("$place_address$", place_info.vicinity)
        const rating = eItemPopupOptions.RATING.replace("$rating$", place_info.rating)

        ItemPopup_Descriptions.push(str_address)
        ItemPopup_Descriptions.push(rating)
        ItemPopup_ButtonOptions.push(eItemPopupOptions.REDIRECT_TO_GGMAP)
        ItemPopup_ButtonOptions.push(eItemPopupOptions.REMOVE)
        ItemPopup_ButtonOptions.push(eItemPopupOptions.CLOSE)
        //TODO
    }catch
    {
    }
}

const PopupItemButtonClicked = async (option: any) => {
    option = option.option
    if (option == eItemPopupOptions.CLOSE)
    {
        show_place_info_popup.value = false
    }
    else if(option == eItemPopupOptions.REMOVE)
    {

    }
    else if(option == eItemPopupOptions.REDIRECT_TO_GGMAP)
    {
        router.RedirectToGoogleMap(target_clicked_place.value.place_id)
        //TODO: redirect to GG maps
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

        <Teleport to="body" v-if="show_place_info_popup">
            <div class="modal">
                <options-popup
                    :title=target_clicked_place.name
                    placeholder="input here pls"
                    buttonText="Confirm"
                    :options="ItemPopup_ButtonOptions"
                    :descriptions="ItemPopup_Descriptions"
                    @confirm="PopupItemButtonClicked"
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
                    <li class="" v-for="place in list_saved_places" >
                        <button type="button" class="text-ui-default-text-color2 rounded-lg min-h-10 w-full transition ease-in-out delay-0 bg-friend-list-item hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300" @click="ItemClicked(place)">{{ place.name }}</button>
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