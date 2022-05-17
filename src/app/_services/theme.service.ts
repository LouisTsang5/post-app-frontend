import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

const themeKey = 'theme';

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
        this.theme = this.theme;
    }

    set theme(theme: Theme) {
        this.themeSubject.next(theme);
        localStorage.setItem(themeKey, theme.toString());
    }

    get theme() {
        const themeStr = localStorage.getItem(themeKey);
        const theme = themeStr === Theme.Dark.toString() ? Theme.Dark : Theme.Light;
        return theme;
    }

    private setTheme(theme: Theme) {
        const styleLight = {
            'primary-color': 'rgb(59 130 246)', //blue-500
            'primary-color-inverse': 'white',
            'primary-color-highlight': 'rgb(147 197 253)', //blue-300
            'primary-text-color': 'var(--primary-color-inverse)',
            'primary-text-color-inverse': 'var(--primary-color)',
            'secondary-color': 'rgb(191 219 254)', //blue-200
            'secondary-text-color': 'black',
            'background-color': 'white',
            'background-color-light': 'rgb(243 244 246)', //gray-100
            'background-highlight-color': 'rgb(229 231 235)', //gray-200
            'background-opaque-color': 'rgb(255 255 255 / 0.7)', //slate-700-70
            'background-text-color': 'black',
        };
        const styleDark = {
            'primary-color': 'rgb(79 70 229)', //indigo-600
            'primary-color-inverse': 'white',
            'primary-color-highlight': 'rgb(165 180 252)', //indigo-300
            'primary-text-color': 'var(--primary-color-inverse)',
            'primary-text-color-inverse': 'var(--primary-color)',
            'secondary-color': 'rgb(55 48 163)', //indigo-800
            'secondary-text-color': 'rgb(203 213 225)', //slate-300
            'background-color': 'rgb(15 23 42)', //slate-900
            'background-color-light': 'rgb(30 41 59)', //slate-800
            'background-highlight-color': 'rgb(51 65 85)', //slate-700
            'background-opaque-color': 'rgb(51 65 85 / 0.7)', //slate-700-70
            'background-text-color': 'rgb(148 163 184)', //slate-400
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
