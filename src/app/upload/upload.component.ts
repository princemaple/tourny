import {Component, Input} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {CVA} from '../cva';

export type Upload = {
  contentType: string;
  filename: string;
  path: string;
};

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: UploadComponent, multi: true}],
  host: {
    '[class.deletable]': 'delete',
  },
})
export class UploadComponent extends CVA {
  #control: boolean = false;
  @Input()
  get control(): boolean {
    return this.#control;
  }
  set control(v: boolean | string) {
    this.#control = coerceBooleanProperty(v);
  }

  #paste: boolean = false;
  @Input()
  get paste(): boolean {
    return this.#paste;
  }
  set paste(v: boolean | string) {
    this.#paste = coerceBooleanProperty(v);
  }

  #delete: boolean = false;
  @Input()
  get delete(): boolean {
    return this.#delete;
  }
  set delete(v: boolean | string) {
    this.#delete = coerceBooleanProperty(v);
  }

  #rename: boolean = false;
  @Input()
  get rename(): boolean {
    return this.#rename;
  }
  set rename(v: boolean | string) {
    this.#rename = coerceBooleanProperty(v);
  }

  @Input() value: (File | Upload)[] = [];

  get files() {
    return this.value;
  }

  override writeValue(value: (File | Upload)[]) {
    if (value) {
      this.value = value;
    } else {
      this.handleChange([]);
    }
  }

  dragging = false;

  commit(files: (File | Upload)[]) {
    this.writeValue(files);
    this.handleChange(files);
  }

  dropFiles(event: DragEvent) {
    this.cancel(event);
    this.dragging = false;
    this.commit([...Array.from(event.dataTransfer!.files), ...this.value]);
  }

  async pasteImage(event: ClipboardEvent) {
    if (!event.clipboardData?.files.length) {
      return;
    }

    if (!event.clipboardData.files[0].type.startsWith('image')) {
      return;
    }

    const file = event.clipboardData?.files[0]!;
    const name = prompt('Filename');

    if (!name) {
      return;
    }

    const renamedFile = new File(
      [await file.arrayBuffer()],
      name + file.name.slice(file.name.lastIndexOf('.')),
      {type: file.type},
    );
    this.commit([renamedFile, ...this.value]);
  }

  handleFileChange(event: Event) {
    this.commit([...Array.from((event.target as HTMLInputElement).files!), ...this.value]);
  }

  handleUploaded([file, upload]: [File, Upload]) {
    this.value.splice(this.value.indexOf(file), 1, upload);
    this.handleChange(this.value);
  }

  removeFile(file: File | Upload) {
    this.commit(this.value.filter(f => f !== file));
  }

  cancel(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
