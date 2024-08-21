import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

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
    private readonly userKey = 'currentUser';
    // currentUser: {username: string; email: string} | null = null;
    private currentUserSubject = new BehaviorSubject<{ username: string; email: string } | null>(null);
    currentUser$: Observable<{ username: string; email: string } | null> = this.currentUserSubject.asObservable();

    constructor(private router: Router) { 
        this.loadUserFromLocalStorage();
    }

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
            this.currentUserSubject.next({ username: user.username, email: user.email });
            localStorage.setItem(this.tokenKey, 'basicTokenAuthenticated');
            localStorage.setItem(this.userKey, JSON.stringify({ username: user.username, email: user.email }));
            console.log('User logged in:', this.currentUserSubject.value);
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
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
        console.log('User logged out:', this.currentUserSubject.value);
        this.router.navigate(['auth']);
    }

    isLoggedIn(): boolean {
        return localStorage.getItem(this.tokenKey) !== null;
    }

    private loadUserFromLocalStorage(): void {
        const storedUser = localStorage.getItem(this.userKey);
        if (storedUser && this.isLoggedIn()) {
            this.currentUserSubject.next(JSON.parse(storedUser));
            console.log('User restored from localStorage:', this.currentUserSubject.value);
        }
    }
}