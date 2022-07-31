import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {Upload} from '../upload.component';
import {SupaService} from 'src/app/supa.service';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  @Input() file!: File | Upload;

  #hideFileName = false;
  @Input()
  get hideFileName(): boolean {
    return this.#hideFileName;
  }
  set hideFileName(v: boolean | string) {
    this.#hideFileName = coerceBooleanProperty(v);
  }

  #downloadable = true;
  @Input()
  get downloadable(): boolean {
    return this.#downloadable;
  }
  set downloadable(v: boolean | string) {
    this.#downloadable = coerceBooleanProperty(v);
  }

  @Output('delete') delete = new EventEmitter<File | Upload>();

  #deletable: boolean = false;
  @Input()
  get deletable(): boolean {
    return this.#deletable;
  }
  set deletable(v: boolean | string) {
    this.#deletable = coerceBooleanProperty(v);
  }

  #renameable: boolean = false;
  @Input()
  get renameable(): boolean {
    return this.#renameable;
  }
  set renameable(v: boolean | string) {
    this.#renameable = coerceBooleanProperty(v);
  }

  @Output('uploaded') uploaded = new EventEmitter<[File, Upload]>();

  uploading = false;
  signedUrl = '#';

  constructor(private supa: SupaService) {}

  async ngOnInit() {
    if (this.file instanceof File) {
      this.uploading = true;

      const today = new Date();
      const {data, error} = await this.supa.base.storage
        .from('items')
        .upload(
          `${today.getFullYear()}/${today.getMonth() + 1}/${today.valueOf()}-${this.file.name}`,
          this.file,
        );

      if (error) {
        alert('Failed to upload the file, please try again!');
      } else {
        const upload = {filename: this.file.name, contentType: this.file.type, path: data!.Key};
        this.uploaded.emit([this.file as File, upload]);
        this.file = upload;
      }

      this.uploading = false;
    } else {
      const [_bucket, ...path] = this.file.path.split('/');
      const {data} = await this.supa.base.storage.from('items').createSignedUrl(path.join('/'), 60);
      this.signedUrl = data!.signedURL;
    }
  }

  isFile(f: File | Upload): f is File {
    return f instanceof File;
  }

  isUpload(f: File | Upload): f is Upload {
    return !this.isFile(f);
  }

  rename(f: Upload) {
    const oldName = f.filename.split('.');
    const ext = oldName.pop();
    const newName = prompt('新文件名：', oldName.join('.'));

    if (newName) {
      // this.uploadClient
      //   .update(this.file as Upload, {upload: {filename: `${newName}.${ext}`}})
      //   .subscribe(({data}) => {
      //     this.file = data;
      //   });
    }
  }

  get fileName() {
    if (this.isFile(this.file)) {
      return this.file.name;
    }
    return this.file.filename;
  }

  get fileMimeType() {
    if (this.isFile(this.file)) {
      return this.file.type;
    }
    return this.file.contentType;
  }

  get fileType() {
    if (this.isUpload(this.file)) {
      const mimeType = this.fileMimeType;

      if (mimeType.startsWith('image')) {
        return 'image';
      }

      if (mimeType == 'application/pdf') {
        return 'pdf';
      }

      return 'upload';
    }

    return 'file';
  }

  get filePath() {
    return this.signedUrl;
  }

  get fileExt() {
    const parts = this.fileName.split('.');
    return parts[parts.length - 1];
  }
}
