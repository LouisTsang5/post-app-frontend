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

    set theme(theme: Theme) {
        this.themeSubject.next(theme);
    }

    get theme() {
        return this.themeSubject.value;
    }

    private setTheme(theme: Theme) {
        const styleLight = {
            'primary-color': 'rgb(59 130 246)', //blue-500
            'primary-color-inverse': 'white',
            'primary-text-color': 'var(--primary-color-inverse)',
            'primary-text-color-inverse': 'var(--primary-color)',
            'secondary-color': 'rgb(191 219 254)', //blue-200
            'secondary-text-color': 'black',
            'background-color': 'white',
            'background-color-light': 'rgb(243 244 246)', //gray-100
            'background-highlight-color': 'rgb(229 231 235)', //gray-200
            'background-text-color': 'black',
        };
        const styleDark = {
            'primary-color': 'rgb(79 70 229)', //indigo-600
            'primary-color-inverse': 'white',
            'primary-text-color': 'var(--primary-color-inverse)',
            'primary-text-color-inverse': 'var(--primary-color)',
            'secondary-color': 'rgb(191 219 254)', //blue-200
            'secondary-text-color': 'white',
            'background-color': 'rgb(15 23 42)', //slate-900
            'background-color-light': 'rgb(71 85 105)', //slate-600
            'background-highlight-color': 'rgb(100 116 139)', //slate-500
            'background-text-color': 'white',
        };

        const style = theme === Theme.Dark ? styleDark : styleLight;

        for (let [key, value] of Object.entries(style)) {
            document.documentElement.style.setProperty(`--${key}`, value);
        }
    }

    ngOnDestroy(): void {
        this.themeSubscription.unsubscribe();
    }
}

export enum Theme {
    Light,
    Dark
}
