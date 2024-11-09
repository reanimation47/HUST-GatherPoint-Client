import { useRouter, type Router } from 'vue-router';
import { RLinks } from '@/configurations/routerLinks';
import { LStorage } from '@/configurations/localStorage_Keys';
export class RouterHelper
{
    router: Router
    constructor()
    {
        this.router = useRouter()
    }

    RouteToPage(pageURL:string, requiresAuth: boolean = false)
    {
        if (requiresAuth)
        {
            const authToken = localStorage.getItem(LStorage.last_auth_token)
            if (authToken == null)
            {
                //TODO: alert user they need to re-login
                this.router.push(RLinks.LoginPage)
                return
            }
        }
        this.router.push(pageURL)
    }
}