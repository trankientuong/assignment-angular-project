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
    private readonly usersKey = 'users';
    private readonly tokenKey = 'token';
    currentUser: {username: string; email: string} | null = null;

    constructor(private router: Router) { }

    register(username: string, email: string, password: string): void {
        const usersRegistered = this.getRegisteredUsers();
        const newUser: User = { username, email, password };

        usersRegistered.push(newUser);
        this.saveUsers(usersRegistered);
    }

    login(email: string, password: string): boolean {
        const users = this.getRegisteredUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = { username: user.username, email: user.email };
            localStorage.setItem(this.tokenKey, 'basicTokenAuthenticated');
            return true;
        }

        return false;
    }

    private getRegisteredUsers(): User[] {
        const usersJSON = localStorage.getItem(this.usersKey);
        return usersJSON ? JSON.parse(usersJSON) : [];
    }

    private saveUsers(users: User[]): void {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        this.currentUser = null;
        this.router.navigate(['auth']);
    }

    isLoggedIn(): boolean {
        return localStorage.getItem(this.tokenKey) !== null;
    }
}