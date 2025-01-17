import { LStorage } from "@/configurations/localStorage_Keys";
import { RouterHelper } from "./RouterHelper";
import { RLinks } from "@/configurations/routerLinks";

export class AuthenticationHelper
{
    static CheckIfUserIsAuthenticated() // Put this at the start of a page to run a manual auth check
    {
        const router = new RouterHelper()
        if (!sessionStorage.getItem(LStorage.last_auth_token))
        {
            router.RouteToPage(RLinks.LoginPage)
        }
    }
}