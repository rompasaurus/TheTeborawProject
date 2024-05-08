import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  private apiEndpoint = "journalData";
  constructor(private http: HttpClient) {
  }
  baseUrl = environment.apiUrl

  addJournal(journal:JournalRaw){
    console.log(" addJournal api endpoint: ", this.apiEndpoint);
    console.log("baseUrl: ", this.baseUrl);
    console.log("Adding journal: ",journal.journalRawId, " userId: ", journal.userId, " Content: ",journal.content);
    let journalRawPost = this.http.post(this.baseUrl + this.apiEndpoint + '/SaveJournalRAW', journal).subscribe(
      (val) => {
        console.log("POST call successful value returned in body",
          val);
      },
      response => {
        console.log("POST call in error", response);
      },
      () => {
        console.log("The POST observable is now completed.");
      });
    console.log("addJournal Response: ", journalRawPost);
    return journalRawPost;
  }

  addJournalContent(content: String) {
    console.log("addJournalContent api endpoint: ", this.apiEndpoint);
    console.log("baseUrl: ", this.baseUrl);
    console.log("Saving Content: ", content, "Endpoint: ", (this.baseUrl + this.apiEndpoint + '/SaveJournalRaw'));
    let journalRawPost = this.http.post(this.baseUrl + this.apiEndpoint + 'SaveJournalRAW', content).subscribe(
      (val) => {
        console.log("POST call successful value returned in body",
          val);
      },
      response => {
        console.log("POST call in error", response);
      },
      () => {
        console.log("The POST observable is now completed.");
      });;
    console.log("addJournalContent Response: ", journalRawPost);
    return journalRawPost;
  }

  retrieveLatestJournalRaw() {
    console.log("addJournalContent api endpoint: ", this.apiEndpoint);
    console.log("baseUrl: ", this.baseUrl);
    console.log("Retrieving Content from Endpoint: ", (this.baseUrl + this.apiEndpoint + '/RetrieveJournalLatestRaw'));
    return this.http.get<JournalRaw>(this.baseUrl + this.apiEndpoint + '/RetrieveJournalLatestRaw')
  }

  retrieveUserJournalList(){
    return this.http.get<Array<JournalRaw>>(this.baseUrl + this.apiEndpoint + '/RetrieveUserJournalListRaw');
    //.pipe(map(results => {return results}));
        //results.sort((x,y) =>(x.dateCreated ?? Date.now()) > (y.dateCreated ?? Date.now()) ? -1 : 1)));
  }


  saveJournalRAW(currentJournalRAW: JournalRaw) {
    console.log("addJournalContent api endpoint: ", this.apiEndpoint);
    console.log("baseUrl: ", this.baseUrl);
    console.log("Saving Content: ", currentJournalRAW, "Endpoint: ", (this.baseUrl + this.apiEndpoint + '/SaveJournalRaw'));
    let journalRawPost = this.http.post<JournalRaw>(this.baseUrl + this.apiEndpoint + '/SaveJournalRAW', currentJournalRAW);
    return journalRawPost;
  }

}
export class JournalRaw {
  journalRawId?: number;
  userId?:string;
  userName?:string;
  dateCreated?:Date;
  lastUpdated?:Date;
  title?:string;
  content?:string;
  topicTree?:string;
  modified?: boolean = false;
}
