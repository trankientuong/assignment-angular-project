import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { inject } from "@angular/core";

// export class AuthGuard implements CanActivate {
//     constructor(private authService: AuthService, private router: Router) {}

//     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
//         const isAuthenticated = this.authService.isLoggedIn();
//         if (isAuthenticated) {
//             return true;
//         } else {
//             return this.router.createUrlTree(['/auth']);
//         }
//     }
// }

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const isAuthenticated = authService.isLoggedIn();
    if (isAuthenticated) {
        return true;
    } else {
        return router.createUrlTree(['/auth']);
    }
}