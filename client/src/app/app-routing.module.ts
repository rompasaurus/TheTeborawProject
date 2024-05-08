import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { MemberDetailComponent } from './member/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { authGuard } from './_guards/auth.guard';
import {TestErrorComponent} from "./error/test-error/test-error.component";
import {NotFoundComponent} from "./errors/not-found/not-found.component";
import {ServerErrorComponent} from "./errors/server-error/server-error.component";
import {MemberEditComponent} from "./member/member-edit/member-edit.component";
import {preventUnsavedChangesGuard} from "./_guards/prevent-unsaved-changes.guard";
import {memberDetailResolver} from "./_resolvers/member-detail.resolver";
import {AdminPanelComponent} from "./admin/admin-panel/admin-panel.component";
import {adminGuard} from "./_guards/admin.guard";
import { JournalComponent } from './journal/journal.component';
 
const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      {path: 'members', component: MemberListComponent},
      {path: 'journal', component: JournalComponent},
      {path: 'jnrl', component: JournalComponent},
      {path: 'members/:username', component: MemberDetailComponent, resolve: {member: memberDetailResolver}},
      {path: 'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard]},
      {path: 'lists', component: ListsComponent},
      {path: 'messages', component: MessagesComponent},
      {path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard]}
    ]
  },
  {path: 'errors', component: TestErrorComponent},
  {path: 'not-found', component: NotFoundComponent},
  {path: 'server-error', component: ServerErrorComponent},
  //wildcards are implictly not found so ajust route to go to that comp as well
  {path: '**', component: NotFoundComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
