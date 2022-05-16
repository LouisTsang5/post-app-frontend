import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { LoggerService } from 'src/app/_services/logger.service';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html',
    styleUrls: ['./media-viewer.component.css']
})
export class MediaViewerComponent implements OnInit {

    @Input() srcs?: string[];
    @Input() height: string;
    @Input() width: string;
    @Input() autoPlay?: boolean | { interval?: number };
    safeUrls: SafeUrl[];
    index: number;

    constructor(
        private sanitization: DomSanitizer,
        private logger: LoggerService,
    ) { }

    ngOnInit(): void {
        this.index = 0;
        if (this.srcs) this.safeUrls = this.srcs.map((url) => this.sanitization.bypassSecurityTrustResourceUrl(url));

        const defaultInterval = 3000;
        const interval = this.autoPlay && hasInterval(this.autoPlay) ? this.autoPlay.interval : defaultInterval;
        if (this.autoPlay) setInterval(() => {
            this.index < this.safeUrls.length - 1 ? this.index++ : this.index = 0;
        }, interval);
    }

    onClickNext() {
        if (this.index < this.safeUrls.length - 1) this.index++;
        this.logger.log(`Image index: ${this.index}`);
    }
    onClickPrev() {
        if (this.index > 0) this.index--;
        this.logger.log(`Image index: ${this.index}`);
    }
}

function hasInterval(value: boolean | {interval?: number}): value is {interval: number} {
    return value.hasOwnProperty('interval');
}