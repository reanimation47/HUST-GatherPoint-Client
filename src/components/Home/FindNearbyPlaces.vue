<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import axios from 'axios'
import { GoogleMap, AdvancedMarker, MarkerCluster } from 'vue3-google-map'

//Native API for mobile
// import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const delay = async (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface LocationResponseModel
{
    place_id: string
    business_status: string
    geometry: {
        location: {
            lat: number,
            lng: number
        }
    }
    icon: string
    name: string
    opening_hours: {
        open_now: boolean
    }
    user_ratings_total: number
    vicinity: string
}
enum mapState 
{
    NotReady = 0,
    Processing = 1,
    Ready = 2
}

//States
let mapStateMachine = ref(mapState.NotReady)
let mapDataIsReady = computed(() => mapStateMachine.value == mapState.Ready) 

const btn_text = ref("Find nearby locations")


//input
const type = ref("")
const radius = ref(0)

//locations info
const lat = ref(0)
const lng = ref(0)
const places = ref([])  as Ref<LocationResponseModel[], LocationResponseModel[]>
const maps_api_secret = import.meta.env.VITE_APP_MAPS_API_SECRET
if( !maps_api_secret)
{
    throw new Error("No GoogleMaps API key provided")//TODO: catch this
}

let center = { lat: -31.56391, lng: 147.154312 } 
const coordinates = ref("") 
let markerOptions = { position: center, title: 'AAAAAAAAAAA' }
const pinOptions = { background: '#92140C', borderColor: "#5B3000", scale:2 }

let coordinates_map: any[] = []

function findNearbyButtonPressed() {
    if (mapStateMachine.value == mapState.Processing)
    {
        btn_text.value = "Just wait mate.."
        return
    }
    
    if (!type.value || radius.value == 0)
    {
        btn_text.value = "Please choose Location Type and Search Range first."
        delay(2000).then(() => {
            btn_text.value = "Find nearby locations"
        })
        return
    }
    
    console.log("mapState.Processing")
    mapStateMachine.value = mapState.Processing
    btn_text.value = "Processing.. please wait"
    processCurrentLocation()
}

function processCurrentLocation() {
    console.log("processCurrentLocation")
    console.log(`Is native?: ${Capacitor.isNativePlatform()}`)


    navigator.geolocation.getCurrentPosition(
      position => {
        lat.value = position.coords.latitude;
        lng.value = position.coords.longitude;
        console.log(`${lat.value}, ${lng.value}`)
        coordinates.value = `${lat.value}, ${lng.value}` 

        getLocationsInfo()
      },
      error => {
        console.log("Error getting location");
      }
    );
  }


function getLocationsInfo()
{
    console.log("getLocationsInfo")
	const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        lat.value
      },${lng.value}&type=${type.value}&radius=${radius.value *
        1000}&key=${maps_api_secret}`;
	axios.get(URL).then(response => {
        console.log(response.data.results)
		places.value = response.data.results;
        buildLocationMappings(response.data.results)
		// addLocationsToGoogleMaps();

        console.log("mapState.Ready")
        // mapDataIsReady.value = true
        mapStateMachine.value = mapState.Ready
        btn_text.value = "Find nearby locations (again?)"
	}).catch(error => {
		console.log(error.message);
	});

}

function buildLocationMappings(results:any)
{
    results.forEach((r: any) => {
        const data = r as LocationResponseModel
        coordinates_map.push({
            location: {
                lat: data.geometry.location.lat,
                lng: data.geometry.location.lng,
            },
            name: data.name

        })

    })
    center = coordinates_map[0].location
    markerOptions = {
        position: center,
        title: "TEST"
    }
    console.log("buildLocationMappings finish")


}

function addLocationsToGoogleMaps() 
{
	var map:any = new GoogleMap.maps.Map(map, {
		zoom: 15,
		center: new GoogleMap.maps.LatLng(lat.value, lng.value),
		mapTypeId: GoogleMap.maps.MapTypeId.ROADMAP
	});
	places.value.forEach((place) => {
		const lat = place.geometry.location.lat;
		const lng = place.geometry.location.lng;
		let marker = new GoogleMap.maps.Marker({
			position: new GoogleMap.maps.LatLng(lat, lng),
			map: map
		});
	});
}
</script>

<template>
    <div class="flex flex-col">
        <div class="">
            <form class="ui segment large form">
            <div class="ui segment">
                <div class="field">
                <!-- <div class="ui right icon input large">
                    <input type="text" :placeholder="coordinates" v-model="coordinates" />
                    <i class="dot circle link icon" @click="locatorButtonPressed"></i>
                </div> -->
                </div>
                <div class="field">
                <div class="two fields">
                    <div class="field">
                    <select v-model="type">
                        <option value="" disabled selected >Location Type</option>
                        <option value="restaurant">restaurant</option>
                        <option value="cafe">cafe</option>
                    </select>
                    </div>
                    <div class="field">
                    <select v-model="radius">
                        <option value="0" disabled selected >Search Range</option>
                        <option value="5">5 KM</option>
                        <option value="10">10 KM</option>
                        <option value="15">15 KM</option>
                        <option value="20">20 KM</option>
                    </select>
                    </div>
                </div>
                </div>
                <button type="button" class="ui button" @click="findNearbyButtonPressed"> {{ btn_text }}</button>
            </div>
            </form>
            


        </div>



        <div  class="" ref="map">

            <GoogleMap
                v-if="mapDataIsReady"
                mapId = "test-id"
                :api-key= "maps_api_secret"
                style="width: 100%; height: 500px"
                :center="center"
                :zoom="13"
            >
            <AdvancedMarker 
                v-if="mapDataIsReady" 
                v-for="(data, i) in coordinates_map"
                :options="{
                    position: data.location,
                    title: data.name
                }" 

                :pin-options="pinOptions"
            />
            </GoogleMap>
            <!-- <Marker
                v-if="mapDataIsReady"
                v-for="(location, i) in coordinates_map"
                :key="i"
                :options="{ position: location, label: location_label, title: location_title }"
            /> -->


        </div>

        <div v-if="mapDataIsReady" class="ui segment"  style="max-height:500px;overflow:scroll">
            <div class="ui divided items">
                <div class="item" v-for="place in places" :key="place.place_id">
                    <div class="content">
                        <div class="header">{{place.name}}</div>
                        <div class="meta">{{place.vicinity}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>