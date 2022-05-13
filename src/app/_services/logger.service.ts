import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    private isDevMode = !environment.production;

    constructor() { }

    log(object: Object) {
        if (this.isDevMode) console.log(object);
    }
}
