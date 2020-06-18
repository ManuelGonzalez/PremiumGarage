import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {Upload} from '../../models/upload';
import {UploadService} from '../../services/upload.service';
import {ConfirmationDialogComponent} from '../confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  @Input() path: any;
  @Input() id: any;
  @ViewChild('myInput') myInputVariable: ElementRef;
  address: any = {};
  loadFiles = false;
  file: any = {};
  files: any[] = [];
  selectedFiles: FileList;
  currentUpload: Upload;
  numberFiles = 0;

  constructor(private uploadServices: UploadService,
              private snackbar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.getFiles();
  }

  setFile(file) {
    this.file = file;
  }

  getFiles() {
    this.uploadServices.getFiles(`${this.path}/${this.id}`).valueChanges().subscribe(files => {
      this.files = files;
    });
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
    this.numberFiles = event.target.files.length;
  }

  blanckInputfiles() {
    this.myInputVariable.nativeElement.value = '';
    this.numberFiles = 0;
    const that = this;
    setTimeout(function(this) {
      that.loadFiles = false;
    }, 5000);
  }

  uploadMulti() {
    if (this.selectedFiles) {
      this.loadFiles = true;
      const files = this.selectedFiles;
      const filesIndex = _.range(files.length);
      _.each(filesIndex, (idx) => {
        this.currentUpload = new Upload(files[idx]);
        this.uploadServices.pushUpload(this.currentUpload, `${this.path}/${this.id}`);
      });
    }
  }

  openDialogDeleteFile(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: 'Deseas eliminar el archivo?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteFile();
      }
    });
  }

  deleteFile() {
    Promise.all([
      this.uploadServices.deleteUpload(`${this.path}/${this.id}/files/${this.file.name}`),
      this.uploadServices.deleteFileData(`${this.path}/${this.id}/files/${this.file.id}`),
    ]).then(resp => {
      this.snackbar.open('El archivo: a sido eliminado', 'Delete', {
        duration: 5000
      });
    }).catch(err => {
      this.snackbar.open(err.toLocaleString(), 'Error', {
        duration: 5000
      });
    });
  }

}
