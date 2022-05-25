import { Component, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements ControlValueAccessor {

    @Input() allowedExtensions: string[];
    onChange: Function;

    private setFiles(fileList: FileList) {
        const newFiles: File[] = [];
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList.item(i);
            if (file) newFiles.push(file);
        }
        const currentFiles = this.ngControl.value as File[];
        const allFiles = [...currentFiles, ...newFiles];
        this.onChange(allFiles);
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
        public ngControl: NgControl
    ) {
        ngControl.valueAccessor = this;
    }

    writeValue(obj: any): void {
        return;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {

    }
}
