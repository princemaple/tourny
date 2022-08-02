import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TournamentFormComponent} from './tournament-form/tournament-form.component';
import {TournamentSetupComponent} from './tournament-setup/tournament-setup.component';

import {ApplyPipe} from './utils/apply.pipe';
import {SortPipe} from './utils/sort.pipe';
import {KeyValueFieldModule} from './key-value-field/key-value-field.module';
import {ModelArrayModule} from './model-array/model-array.module';

@NgModule({
  declarations: [
    AppComponent,
    ApplyPipe,
    SortPipe,
    DashboardComponent,
    TournamentFormComponent,
    TournamentSetupComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule,

    KeyValueFieldModule,
    ModelArrayModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
