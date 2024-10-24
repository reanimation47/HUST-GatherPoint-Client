import { LStorage } from "@/configurations/localStorage_Keys";

export class ReqHelper
{
    static SendPostRequest = async (request_url:string ,body:any) => {
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
        const response = await fetch(request_url, requestOptions)
        const data = response.json()
        return data
    }
}