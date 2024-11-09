import { useRouter, type Router } from 'vue-router';
import { RLinks } from '@/configurations/routerLinks';
export class RouterHelper
{
    router: Router
    constructor()
    {
        this.router = useRouter()
    }

    RouteToPage(pageURL:string, requiresAuth: boolean = false)
    {
        this.router.push(pageURL)
    }
}