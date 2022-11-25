import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TournamentFormComponent} from './tournament-form/tournament-form.component';
import {TournamentSetupComponent} from './tournament-setup/tournament-setup.component';
import {MatchNodeComponent} from './match-node/match-node.component';
import {MatchTreeComponent} from './match-tree/match-tree.component';
import {StageEditorComponent} from './stage-editor/stage-editor.component';

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
    MatchNodeComponent,
    MatchTreeComponent,
    StageEditorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    DragDropModule,
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
    MatMenuModule,
    MatTooltipModule,

    KeyValueFieldModule,
    ModelArrayModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
