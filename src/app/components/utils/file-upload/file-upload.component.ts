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
    files: File[];

    private setFiles(fileList: FileList) {
        const files: File[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i);
            if (file) files.push(file);
        }
        this.onChange(files);
        this.files = files;
    }

    @HostListener('change', ['$event.target.files']) emitFiles(fileList: FileList) {
        this.setFiles(fileList);
    }

    // @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    //     console.log(`Dragover: ${event}`);
    // }

    // @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    //     console.log(`Dragleave: ${event}`);
    // }

    @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer) this.setFiles(event.dataTransfer.files);
    }

    constructor(
        private host: ElementRef<HTMLInputElement>
    ) { }

    ngOnInit(): void {
        this.files = [];
    }

    writeValue(obj: any): void {
        this.host.nativeElement.value = '';
        this.files = [];
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {

    }
}
