import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
})
export class ConfirmModalComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<ConfirmModalComponent>) {}

  ngOnInit(): void {}

  closeModal(flag: number) {
    this.dialogRef.close(flag);
  }
}
