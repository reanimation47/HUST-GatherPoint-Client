import { CoreConfiguration } from "@/configurations/coreConfig";
import { LStorage } from "@/configurations/localStorage_Keys";
import type { Get_AutoComplete_Predictions_Model } from "@/Models/API_Requests/API_Request_Models";
import { API_URL } from "@/Models/API_Requests/API_Request_URLs";
import type { Get_AutoComplete_Predictions_Response_Model } from "@/Models/API_Responses/API_Response_Models";
import { CommonErrorCode, NetworkErrorCode } from "@/Models/Common/ErrorCodes";
import { Capacitor } from "@capacitor/core";
import axios from 'axios'
import { RouterHelper } from "./RouterHelper";
import { RLinks } from "@/configurations/routerLinks";

export class ReqHelper
{
    static SendPostRequest = async (request_url:string ,body:any, router: RouterHelper) => {
        console.log(`VUE GP SEND ${request_url}`)
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Access-Control-Allow-Origin':'*', 
                'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS',
                'AuthToken' : localStorage.getItem(LStorage.last_auth_token) ?? "",
                'RequestFromUser' : localStorage.getItem(LStorage.last_entered_username) ?? "",
            },
            body: JSON.stringify(body)
        };
        try{
            const response = await fetch(request_url, requestOptions)
            const data = await response.json()
            if (data.code == CommonErrorCode.UserIsNotAuthenticated)
            {
                localStorage.removeItem(LStorage.last_auth_token)
                router.RouteToPage(RLinks.LoginPage)
            }
            return Promise.resolve(data) 
        }catch
        {
            throw {
                message: "Cannot reach server",
                code: NetworkErrorCode.CannotReachBackendServer
            }
        }
    }

    static get URL_Cors_Prefix (){
        const cors_everywhere_url = "https://cors-anywhere.herokuapp.com/"
        let url_prefix = Capacitor.isNativePlatform() ? "" : cors_everywhere_url
        return url_prefix
    }
    static get maps_api_key()
    {
        return import.meta.env.VITE_APP_MAPS_API_SECRET as string
    }

    static GGMAP_GetAutoComplete_Predictions_FromServer = async (input:string, router: RouterHelper): Promise<string[]> => {
        let req_body: Get_AutoComplete_Predictions_Model = {input: input}
        try{
            let response = await ReqHelper.SendPostRequest(`${CoreConfiguration.backend_url}${API_URL.Maps_GetAutoComplete_Predictions}`, req_body, router) as Get_AutoComplete_Predictions_Response_Model
            return Promise.resolve(response.results) 
        }catch{
            console.error("Can't get autocomplete prediction from server, returning an empty array")
            return Promise.resolve([])
        }

    }
    static GGMAP_GetAutoComplete_Predictions = async (input:string) => {
        const URL = `${ReqHelper.URL_Cors_Prefix}https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${ReqHelper.maps_api_key}`;
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
    static GGMAP_Get_GeoLocation_By_Address = async (addr:string) => {
        addr = addr.replace(/ /g, "+");
        console.log(addr)
        const URL =`https://maps.googleapis.com/maps/api/geocode/json?address=${addr}&key=${ReqHelper.maps_api_key}`
        try{
            let response = await axios.get(URL)
            console.log(response)
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