import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { SharedModule } from './_modules/shared.module';
import { TestErrorComponent } from './error/test-error/test-error.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { MemberCardComponent } from './member/member-card/member-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';
import { MemberEditComponent } from './member/member-edit/member-edit.component';
import {GalleryComponent} from "ng-gallery";
import {LoadingInterceptor} from "./_interceptors/loading.interceptor";
import { PhotoEditorComponent } from './member/photo-editor/photo-editor.component';
import { TextInputComponent } from './_forms/text-input/text-input.component';
import { DatePickerComponent } from './_forms/date-picker/date-picker.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './_directives/has-role.directive';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { PhotoManagementComponent } from './admin/photo-management/photo-management.component';
import { RolesModalComponent } from './modals/roles-modal/roles-modal.component';
import {RouteReuseStrategy} from "@angular/router";
import {CustomRouteReuseStrategy} from "./_services/customRouteReuseStrategy";
import { ConfirmDialogComponent } from './modals/confirm-dialog/confirm-dialog.component';
import { JournalComponent } from './journal/journal.component';
import { TopicTreeComponent } from './topic-tree/topic-tree.component';
import {NgxMonacoTreeModule, NgxMonacoTreeComponent} from 'ngx-monaco-tree';
import {AngularSplitModule} from "angular-split";
import {MonacoEditorModule} from "ngx-monaco-editor-v2";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    TestErrorComponent,
    NotFoundComponent,
    ServerErrorComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TextInputComponent,
    DatePickerComponent,
    AdminPanelComponent,
    HasRoleDirective,
    UserManagementComponent,
    PhotoManagementComponent,
    RolesModalComponent,
    ConfirmDialogComponent,
    JournalComponent,
    TopicTreeComponent,
  ],
  imports: [
    MonacoEditorModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    SharedModule,
    GalleryComponent,
    ReactiveFormsModule,
    NgxMonacoTreeModule,
    AngularSplitModule
  ],
  providers: [
    provideClientHydration(),
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy}

  ],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
