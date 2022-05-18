import { Component, OnInit } from '@angular/core';
import { Theme, ThemeService } from 'src/app/_services/theme.service';

@Component({
    selector: 'app-day-night-toggle',
    templateUrl: './day-night-toggle.component.html',
    styleUrls: ['./day-night-toggle.component.scss']
})
export class DayNightToggleComponent implements OnInit {

    constructor(
        private themeService: ThemeService,
    ) { }

    ngOnInit(): void {
        return;
    }

    get isLightMode() {
        return this.themeService.theme === Theme.Light;
    }

    onToggle() {
        this.themeService.theme = this.themeService.theme === Theme.Light ? Theme.Dark : Theme.Light;
    }
}
