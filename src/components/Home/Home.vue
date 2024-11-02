
<script setup lang="ts" >
import { GoogleMap, Marker } from 'vue3-google-map'
const center = { lat: 40.689247, lng: -74.044502 }
const markerOptions = { position: center, label: 'L', title: 'HALLO?' }
const pinOptions = { background: '#FBBC04' }

const maps_api_key = import.meta.env.VITE_APP_MAPS_API_SECRET

navigator.geolocation.getCurrentPosition(
    success => {
        center.lat = success.coords.latitude
        center.lng = success.coords.longitude
    },
    error => {
        console.error("Error getting location")
    }
)
</script>


<template>

    <!-- <gmp-map center="37.4220656,-122.0840897" zoom="10" map-id="DEMO_MAP_ID" style="height: 400px"></gmp-map> -->
    <!-- <GoogleMap
        api-key="AIzaSyDd1BR8txQRDsUhLH-H3dpx6V5m2wfABnM"
        style="width: 100%; height: 500px"
        :center="center"
        :zoom="15"
    >
    <Marker :options="{ position: center }" />
  </GoogleMap> -->
  <GoogleMap
    :api-key="maps_api_key"
    mapId="DEMO_MAP_ID"
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="15"
  >
    <AdvancedMarker :options="markerOptions" :pin-options="pinOptions"/>
  </GoogleMap>
<h1>Welcome!</h1>
</template>

