
<script setup lang="ts">
import { ref, type Ref } from 'vue';
import {type Get_Best_Locations_Request_Model, type UserLoginRequestModel, type UserRegisterRequestModel } from '../../Models/API_Requests/API_Request_Models'
import {API_URL} from '../../Models/API_Requests/API_Request_URLs'
import {APIErrorCode, CommonSuccessCode, NetworkErrorCode} from '../../Models/Common/ErrorCodes'
import {type Get_Best_Locations_Response_Model, type Get_Friend_Address_Response_Model, type UserLoginResponseModel} from '../../Models/API_Responses/API_Response_Models'
import {LStorage} from '../../configurations/localStorage_Keys'
import {CoreConfiguration} from '../../configurations/coreConfig'
import {ReqHelper} from '../../helpers/RequestsHelper'
import axios from 'axios'
import { useScrollLock } from '@vueuse/core'

import AutoComplete from 'primevue/autocomplete';
import { GoogleMap, AdvancedMarker, InfoWindow } from 'vue3-google-map'


import { RLinks } from '@/configurations/routerLinks';
import { Capacitor } from '@capacitor/core';
import { RouterHelper } from '@/helpers/RouterHelper';
import Dropdown from 'primevue/dropdown';
import InputPopup from '../Modals/InputPopup.vue';
import OptionsPopup from '../Modals/OptionsPopup.vue';
import { eAddOption } from '@/core/clientEnums';
import type { LocationInfo } from '@/Models/Database/DB_UserModel';
import { AuthenticationHelper } from '@/helpers/AuthenticationHelper';

//##### Add Addresses & Options screen here

AuthenticationHelper.CheckIfUserIsAuthenticated()

interface DATA_PLACE_INFO
{
    name: string
    vicinity: string
    position: {lat:number,lng:number}
    rating:number 
    place_id:string
    is_favorite: boolean
}

let router = new RouterHelper() 


const titleText = ref("Logged in as")
const user_id = ref(sessionStorage.getItem(LStorage.last_entered_username) ?? "unknown")
// const username_placeholder = ref("Enter username????")

const selectedPlaceType = ref()
const placeTypes = ref([
    {type: "cafe", code: 1},
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


const showAddOption = ref(false)
const showUserInputBox = ref(false)
const readyToGo = ref(false)
const showBestLocations = ref(false)

//Add options
const addOptions = ref([
    eAddOption.AddFriend.toString(),
    eAddOption.AddAddress.toString(),
])
const pickedAddOption = ref()



const GoBackButtonClicked = () => {
    router.RouteToPage(RLinks.PlacesPage)
}

const AddButtonClicked = () => {
    showAddOption.value = true
}


const reactive_fav_place_mapping = ref<Map<string,boolean>>()
reactive_fav_place_mapping.value = new Map<string,boolean>()
const StartSearchingForPlaces = async () => {
    const final_list_of_place_ids = Array.from(confirmedAddresses_placeId_Map.keys())
    console.log(final_list_of_place_ids)
    const request:Get_Best_Locations_Request_Model = {
        place_ids:final_list_of_place_ids,
        options:{
            radius: 5000,
            type: selectedPlaceType.value.type
        }
    }
    console.log(request.options)

    try{
        const get_best_locations_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Maps_Get_BestLocations_By_Adddresses}`, {request}, router) as Get_Best_Locations_Response_Model
        // console.log("results:")
        // console.log(get_best_locations_result)
        if (!Array.isArray(get_best_locations_result.result)) {throw Error("Bad data format from BE response")}
        unparsedDATA_best_locations = get_best_locations_result.result //store the data for future use
        maps_centerpoint = get_best_locations_result.centerpoint
        get_best_locations_result.result.forEach(result => {
            if(result?.geometry?.location?.lat && result?.geometry?.location?.lng && result?.name && result?.vicinity && result?.rating && result?.place_id)
            {

                let target_place_fav_status = get_best_locations_result.map_favorite_places.find(place => place.place_id == result.place_id)?.is_favorite
                if (target_place_fav_status == undefined)
                {
                    target_place_fav_status = false
                }

                reactive_fav_place_mapping.value?.set(result.place_id, target_place_fav_status)

                maps_suggested_locations.push(result.geometry.location)
                DATA_best_locations.push({
                    name: result.name,
                    vicinity: result.vicinity,
                    rating: +result.rating,
                    position: {lat:result.geometry.location.lat, lng:result.geometry.location.lng},
                    place_id: result.place_id,
                    is_favorite: target_place_fav_status
                })
            }

        })
        MapUpdated()

        showBestLocations.value = true
    }catch(e)
    {
        console.log("TODO: LETS GO ERROR")
    }
}

const UserPickedAddOption = async (option: {option:string}) =>
{
    showAddOption.value = false 
    showUserInputBox.value = true
    if (option.option == eAddOption.AddFriend)
    {
        pickedAddOption.value = eAddOption.AddFriend
    }

    if (option.option == eAddOption.AddAddress)
    {
        pickedAddOption.value = eAddOption.AddAddress
    }
}

const confirmedAddresses: Ref<string[], string[]> = ref([])
const confirmedAddresses_placeId_Map = new Map<string,string>() //<place_id,address>
const UserConfirmInput = async (option: {input:string, found_suggestions_full_data:any}) => {
    // console.log(option.input)
    showUserInputBox.value = false 

    if (pickedAddOption.value == eAddOption.AddFriend)
    {
        //TODO: handle error for this
        try{
            const get_friends_address_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Socials_GetFriendAddress}`, {username: option.input}, router) as Get_Friend_Address_Response_Model
            if (get_friends_address_result.code == CommonSuccessCode.APIRequestSuccess && get_friends_address_result.address && get_friends_address_result.address_place_id)
            {
                if (!confirmedAddresses.value.includes(get_friends_address_result.address))
                {
                    confirmedAddresses.value.push(get_friends_address_result.address)
                    confirmedAddresses_placeId_Map.set(get_friends_address_result.address_place_id, get_friends_address_result.address)
                }
        }else
        {
            return
        }
        }catch(e:any)
        {

        }
    }

    if (pickedAddOption.value == eAddOption.AddAddress)
    {

        if (!confirmedAddresses.value.includes(option.input))
        {
            const target_address_data = option.found_suggestions_full_data.find((data:any) => data.description == option.input)
            confirmedAddresses_placeId_Map.set(target_address_data.place_id, option.input)
            confirmedAddresses.value.push(option.input)
        }
    }

    readyToGo.value = confirmedAddresses.value.length > 1 ? true : false

    console.log(confirmedAddresses_placeId_Map)
}


















//############## Show Best Locations Screen
const maps_api_key = import.meta.env.VITE_APP_MAPS_API_SECRET

//Map values //DEFAULT
let maps_centerpoint = { lat: 40.689247, lng: -74.044502 }
let maps_suggested_locations: {lat:number,lng:number}[] = []
let center_markerOptions = { position: maps_centerpoint, title: 'CENTER POINT' }
const center_pinOptions = { background: '#074F57' }
const suggested_pinOptions = { background: '#74A57F' }

let unparsedDATA_best_locations:any
let DATA_best_locations:DATA_PLACE_INFO[] = []
const MapUpdated = () =>{
    // maps_centerpoint = { lat: 40.689247, lng: -74.044502 }
    // maps_suggested_locations = []
    center_markerOptions = { position: maps_centerpoint, title: 'CENTER POINT' }
}

const RedirectToGoogleMap = (place_id:string) => {
    // const query_url = `https://www.google.com/maps/place/?q=place_id:${place_id}`
    // window.open(query_url, '_blank')?.focus();
    router.RedirectToGoogleMap(place_id)


}

const SavePlaceToFavorites = async (place: DATA_PLACE_INFO) => {
    reactive_fav_place_mapping.value?.set(place.place_id, true)
    let location_info: LocationInfo = {
        name: place.name,
        lat: place.position.lat,
        lng: place.position.lng,
        place_id: place.place_id,
        rating: place.rating.toString(),
        vicinity: place.vicinity,
        added_date: new Date().toISOString(),
    }

    try{
        const save_place_result = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.UserSavePlaceToFavorites}`, {data:location_info}, router) as Get_Friend_Address_Response_Model
    }catch(e:any)
    {

    }

}

const GoBackToInputScreen = async () => {
    showBestLocations.value = false
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


        <div v-if="!showBestLocations"  class="m-12 rounded-lg grid gap-2 pt-5 pb-7 bg-ui-box-color">
            <div class="grid mx-20 h-11">
                <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="GoBackButtonClicked" ><i></i>Go Back</button>
            </div>

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

            <div class="grid mx-20 h-11" v-if="readyToGo">
                <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="StartSearchingForPlaces" ><i></i>Lets Go</button>
            </div>




        </div>

        <div v-if="showBestLocations" class="m-12 rounded-lg grid gap-2 pt-5 pb-7 bg-ui-box-color">
            <div class="grid mx-20 h-11" v-if="readyToGo">
                <button type="button" class="rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="GoBackToInputScreen" ><i></i>Go Back</button>
            </div>
            <GoogleMap
                :api-key="maps_api_key"
                mapId="DEMO_MAP_ID"
                style="width: 100%; height: 500px"
                :center="maps_centerpoint"
                :zoom="15"
            >
                <!-- <AdvancedMarker :options="center_markerOptions" :pin-options="center_pinOptions"/> -->
                <li v-for="location in DATA_best_locations">
                    <AdvancedMarker :options="{position: location.position, title:location.name}" :pin-options="{ background: reactive_fav_place_mapping?.get(location.place_id) ? '#f43f5e':'#74A57F' }">
                        <InfoWindow>
                            <div class="grid gap-1">
                                <h1 class="text-ui-default-text-color">{{ location.name }}</h1>
                                <h2 class="text-ui-default-text-color">{{ location.vicinity}}</h2>
                                <h3 class="text-ui-default-text-color">Rating: {{ location.rating }}*</h3>
                                <button type="button" class="w-full h-7 rounded-lg transition ease-in-out delay-0 bg-ui-default-main-button2 text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="RedirectToGoogleMap(location.place_id)" ><i></i>Go!!!</button>
                                <button v-if="!reactive_fav_place_mapping?.get(location.place_id)" type="button" class="w-full h-7 rounded-lg transition ease-in-out delay-0 bg-ui-default-love-color text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="SavePlaceToFavorites(location)" ><i></i>Save to favorites</button>
                                <button v-if="reactive_fav_place_mapping?.get(location.place_id)" type="button" class="w-full h-7 rounded-lg transition ease-in-out delay-0 bg-ui-default-love-color text-ui-default-text-color2 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300"  @click="" ><i></i>Remove from favorites</button>
                            </div>
                        </InfoWindow>
                    </AdvancedMarker>>    
                </li>
            </GoogleMap>

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