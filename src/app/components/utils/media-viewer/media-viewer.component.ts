import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoggerService } from 'src/app/_services/logger.service';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html',
    styleUrls: ['./media-viewer.component.scss']
})
export class MediaViewerComponent implements OnInit, OnDestroy {

    @Input() srcs?: string[];
    @Input() height: string;
    @Input() width: string;
    @Input() autoPlay?: boolean | { interval?: number };
    isAutoPlaySubject: BehaviorSubject<boolean>;
    private isAutoPlaySubscription: Subscription;

    private autoPlayIntervalId?: number;
    safeUrls: SafeUrl[];
    index: number;

    constructor(
        private sanitization: DomSanitizer,
        private logger: LoggerService,
    ) { }

    ngOnInit(): void {
        this.index = 0;
        if (this.srcs) this.safeUrls = this.srcs.map((url) => this.sanitization.bypassSecurityTrustResourceUrl(url));

        this.isAutoPlaySubject = new BehaviorSubject<boolean>(!!this.autoPlay);
        this.isAutoPlaySubscription = this.isAutoPlaySubject.asObservable().subscribe({
            next: (isAutoPlay) => {
                this.logger.log(`Auto play is ${isAutoPlay}`);
                if (isAutoPlay) this.setAutoPlayInterval();
                else if(this.autoPlayIntervalId) window.clearInterval(this.autoPlayIntervalId);
            }
        });
    }

    ngOnDestroy(): void {
        this.isAutoPlaySubscription.unsubscribe();
    }

    setAutoPlayInterval() {
        const defaultInterval = 3000;
        const interval = this.autoPlay && hasInterval(this.autoPlay) ? this.autoPlay.interval : defaultInterval;
        this.autoPlayIntervalId = window.setInterval(() => {
            this.index < this.safeUrls.length - 1 ? this.index++ : this.index = 0;
        }, interval);
    }

    onClickAutoPlay(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        this.isAutoPlaySubject.next(!this.isAutoPlaySubject.value);
    }

    onClickNext(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.index < this.safeUrls.length - 1) this.index++;
        else this.index = 0;
        this.isAutoPlaySubject.next(false);
        this.logger.log(`Image index: ${this.index}`);
    }
    onClickPrev(event: Event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.index > 0) this.index--;
        else this.index = this.safeUrls.length - 1;
        this.isAutoPlaySubject.next(false);
        this.logger.log(`Image index: ${this.index}`);
    }
}

function hasInterval(value: boolean | {interval?: number}): value is {interval: number} {
    return value.hasOwnProperty('interval');
}