export interface UserLoginResponseModel
{
    message: string,
    authToken: string
    authToken_epiretime: string
    code: number
}

export interface Get_AutoComplete_Predictions_Response_Model 
{
    message: string,
    code: number,
    isFromCachedResults: string
    results: {description: string, place_id:string}[] 
}