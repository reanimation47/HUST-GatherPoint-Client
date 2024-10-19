<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';
import axios from 'axios'
import { GoogleMap, AdvancedMarker, MarkerCluster } from 'vue3-google-map'

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

const type = ref("")
const radius = ref(1)
const lat = ref(0)
const lng = ref(0)
const places = ref([])  as Ref<LocationResponseModel[], LocationResponseModel[]>
// let map: google.maps.Map = ref()
// const coordinates = computed(() => {
//     return `${lat}, ${lng}`
// })
let mapDataIsReady = ref(false) 
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
function locatorButtonPressed() {
    console.log("locatorButtonPressed")
    navigator.geolocation.getCurrentPosition(
      position => {
        lat.value = position.coords.latitude;
        lng.value = position.coords.longitude;
        console.log(`${lat.value}, ${lng.value}`)
        coordinates.value = `${lat.value}, ${lng.value}` 
      },
      error => {
        console.log("Error getting location");
      }
    );
  }

function findCloseBuyButtonPressed() {
	const URL = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        lat.value
      },${lng.value}&type=${type.value}&radius=${radius.value *
        1000}&key=${maps_api_secret}`;
	axios.get(URL).then(response => {
        console.log(response.data.results)
		places.value = response.data.results;
        buildLocationMappings(response.data.results)
		// addLocationsToGoogleMaps();
    console.log(coordinates_map)

        mapDataIsReady.value = true
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

    console.log(coordinates_map)

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
    <div class="ui grid">
        <div class="six wide column">
            <form class="ui segment large form">
            <div class="ui segment">
                <div class="field">
                <div class="ui right icon input large">
                    <input type="text" :placeholder="coordinates" v-model="coordinates" />
                    <i class="dot circle link icon" @click="locatorButtonPressed"></i>
                </div>
                </div>
                <div class="field">
                <div class="two fields">
                    <div class="field">
                    <select v-model="type">
                        <option value="restaurant">restaurant</option>
                        <option value="cafe">cafe</option>
                    </select>
                    </div>
                    <div class="field">
                    <select v-model="radius">
                        <option value="5">5 KM</option>
                        <option value="10">10 KM</option>
                        <option value="15">15 KM</option>
                        <option value="20">20 KM</option>
                    </select>
                    </div>
                </div>
                </div>
                <button type="button" class="ui button" @click="findCloseBuyButtonPressed">Find CloseBuy</button>
            </div>
            </form>
            
            <div class="ui segment"  style="max-height:500px;overflow:scroll">
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



        <div  class="ten wide column segment ui" ref="map">

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
    </div>
</template>