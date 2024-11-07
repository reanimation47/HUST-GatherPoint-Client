import { LStorage } from "@/configurations/localStorage_Keys";
import { NetworkErrorCode } from "@/Models/Common/ErrorCodes";
import { Capacitor } from "@capacitor/core";
import axios from 'axios'

export class ReqHelper
{
    static SendPostRequest = async (request_url:string ,body:any) => {
        console.log(`VUE GP SEND ${request_url}`)
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin':'*', 
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS',
                'AuthToken' : localStorage.getItem(LStorage.last_auth_token) ?? ""
            },
            body: JSON.stringify(body)
        };
        try{
            const response = await fetch(request_url, requestOptions)
            const data = response.json()
            return data
        }catch
        {
            throw {
                message: "Cannot reach server",
                code: NetworkErrorCode.CannotReachBackendServer
            }
        }
    }

    static GGMAP_GetAutoComplete_Predictions = async (input:string) => {
        const maps_api_secret = import.meta.env.VITE_APP_MAPS_API_SECRET
        const cors_everywhere_url = "https://cors-anywhere.herokuapp.com/"
        let url_prefix = Capacitor.isNativePlatform() ? "" : cors_everywhere_url
        const URL = `${url_prefix }https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${maps_api_secret}`;
        try{
            let response = await axios.get(URL)
            let list_suggestions = response.data.predictions as Array<GGMAP_AutoComplete_Prediction_Model>
            console.log(list_suggestions)
            return Promise.resolve(list_suggestions)
        }catch(error:any)
        {
            console.log(`VUE error: ${error}`);
            console.log(`VUE error: ${error.message}`);
            return Promise.reject(error)
        }
    }
}

interface GGMAP_AutoComplete_Prediction_Model
{
    description: string
    structured_formatting: {
        main_text: string
    }
    place_id: string
}