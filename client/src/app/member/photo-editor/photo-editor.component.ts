import {Component, Input, OnInit} from '@angular/core';
import {Photo} from "../../_models/photo";
import {Member} from "../../_models/member";
import {FileUploader, FileUploadModule} from "ng2-file-upload";
import {environment} from "../../../environments/environment";
import {AccountService} from "../../_services/account.service";
import {take} from "rxjs";
import {User} from "../../_models/user";
import {MembersService} from "../../_services/members.service";

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent implements OnInit{
  @Input() member: Member | undefined
  uploader : FileUploader | undefined
  hasBaseDropZoneOver = false
  baseUrl = environment.apiUrl
  user: User |undefined
  constructor(private accountService: AccountService, private memberService: MembersService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user=>{
        if(user) this.user = user
      }
    })
  }

  ngOnInit() {
    this.initializeUploader()
  }

  fileOverBase(e: any){
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if(this.user && this.member){
          this.user.photoUrl = photo.url
          // this will broadcast the phot update to all the subscribers ie the nave bar n such
          this.accountService.setCurrentUser(this.user)
          this.member.photoUrl = photo.url
          this.member.photos.forEach(p => {
            if(p.isMain) p.isMain = false
            if(p.id === photo.id) p.isMain = true;
          })
        }
      }
    })
  }

  deletePhoto(photoId:number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: _ => {
        if(this.member){
          //this createed the member photo list with all photos but the one being deleted
          this.member.photos = this.member.photos.filter(x => x.id != photoId)
        }
      }
    })

  }

  initializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 *1024
    })
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response){
        const photo = JSON.parse(response)
        this.member?.photos.push(photo)
        if(photo.isMain && this.user && this.member){
          this.user.photoUrl = photo.url
          this.member.photoUrl = photo.url
          this.accountService.setCurrentUser(this.user)
        }
      }
    }
  }
}
