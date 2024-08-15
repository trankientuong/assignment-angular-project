import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

interface User {
    username: string;
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticated: boolean = false;

    constructor(private router: Router) {}

    register(username: string, email: string, password: string): void {
        const user: User = { username: username, email: email, password: password};
        localStorage.setItem('user', JSON.stringify(user));
    }

    login(email: string, password: string): boolean {
        const user: User = JSON.parse(localStorage.getItem('user')!);
        if (user && user.email === email && user.password === password) {
            this.isAuthenticated = true;
            localStorage.setItem('token', 'basicTokenAuthenticated');
            return true;
        }
        return false;
    }

    logout(): void {
        this.isAuthenticated = false;
        localStorage.removeItem('token');
        this.router.navigate(['auth']);
      }
    
      isLoggedIn(): boolean {
        return localStorage.getItem('token') !== null;
      }
}