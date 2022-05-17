import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService implements OnDestroy {
    private themeSubject: BehaviorSubject<Theme>;
    private themeSubscription: Subscription;

    constructor() {
        this.themeSubject = new BehaviorSubject<Theme>(Theme.Light);
        this.themeSubscription = this.themeSubject.asObservable().subscribe({
            next: (theme) => {
                console.log('Theming');
                this.setTheme(theme);
            }
        });
    }

    set Theme(theme: Theme) {
        this.themeSubject.next(theme);
    }

    setTheme(theme: Theme) {
        const styles: { name: string, value: string }[] = [
            { name: 'primary-color', value: 'rgb(59 130 246)' }, //blue-500
            { name: 'secondary-color', value: 'rgb(191 219 254' }, //blue-200
            { name: 'background-color', value: 'white' },
        ];
        styles.forEach(({ name, value }) => {
            document.documentElement.style.setProperty(`--${name}`, value);
        });
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}

export enum Theme {
    Light,
    Dark
}
