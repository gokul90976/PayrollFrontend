import { NgModule } from "@angular/core";
import { SnackbarComponent } from "./snackbar/snackbar.component";
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CreatedAtSortPipe } from './created-at.pipe';
import { ExcelMapComponent } from './excel-map/excel-map.component';
import { MaterialModule } from "../shared/material/material.module";

@NgModule({
    declarations: [
        SnackbarComponent, ConfirmDialogComponent, CreatedAtSortPipe, ExcelMapComponent
    ],
    exports: [
        SnackbarComponent,ConfirmDialogComponent,CreatedAtSortPipe,ExcelMapComponent
    ],
    imports: [
        MaterialModule,FormsModule,CommonModule
    ]
})
export class SharedModule { }