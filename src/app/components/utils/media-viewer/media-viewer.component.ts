import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-media-viewer',
	templateUrl: './media-viewer.component.html',
	styleUrls: ['./media-viewer.component.css']
})
export class MediaViewerComponent implements OnInit {

	@Input() srcs?: string[];
    safeUrls: SafeUrl[];
    index: number;
    hovered: boolean = false;

	constructor(
        private sanitization: DomSanitizer,
    ) { }

	ngOnInit(): void {
        this.index = 0;
		if(this.srcs) this.safeUrls = this.srcs.map((url) => this.sanitization.bypassSecurityTrustResourceUrl(url));
	}

    onClickNext() {
        if (this.index < this.safeUrls.length - 1) this.index++;
        console.log(this.index);
    }

    onClickPrev() {
        if (this.index > 0) this.index--;
        console.log(this.index);
    }
}
