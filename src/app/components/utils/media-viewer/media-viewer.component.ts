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

	constructor(
        private sanitization: DomSanitizer,
    ) { }

	ngOnInit(): void {
        console.log(this.srcs);
		if(this.srcs) this.safeUrls = this.srcs.map((url) => this.sanitization.bypassSecurityTrustResourceUrl(url));
        console.log(this.srcs);
	}
}
