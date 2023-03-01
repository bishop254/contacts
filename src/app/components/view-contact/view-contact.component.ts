import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.scss'],
})
export class ViewContactComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Record<string, string>,
    private dialogRef: MatDialogRef<ViewContactComponent>
  ) {}

  ngOnInit(): void {}
}
