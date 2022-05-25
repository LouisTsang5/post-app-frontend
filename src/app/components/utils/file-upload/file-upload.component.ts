import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FileUploadComponent,
            multi: true,
        }
    ]
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {

    onChange: Function;

    private setFiles(fileList: FileList) {
        const files: File[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i);
            if (file) files.push(file);
        }
        this.onChange(files);
    }

    @HostListener('change', ['$event.target.files']) emitFiles(fileList: FileList) {
        this.setFiles(fileList);
    }

    @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer) this.setFiles(event.dataTransfer.files);
    }

    constructor(
        private host: ElementRef<HTMLInputElement>
    ) { }

    ngOnInit(): void {
        return;
    }

    writeValue(obj: any): void {
        this.host.nativeElement.value = '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {

    }
}
