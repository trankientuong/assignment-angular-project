import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  public data: {message: string} = inject(MAT_DIALOG_DATA);
  public dialogRef: MatDialogRef<DialogComponent> = inject(MatDialogRef<DialogComponent>);

  onClose(): void {
    this.dialogRef.close();
  }
}
