import {Component, EventEmitter, Inject, VERSION} from '@angular/core';
import {MonacoTreeElement} from "../_models/TopicTreeElement";
import {HttpClient} from '@angular/common/http';
import {JournalRaw, JournalService} from "../_services/journal.service";
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import {take} from "rxjs";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css'],
})
export class JournalComponent {
  public journals: Journal[] = [];
  public journalList: Journal[] = [];
  public topicList: Topic[] = [];
  public currentTopic: Topic = {lineNumber: 0};
  public journalRAWList: JournalRaw[] = [];
  public currentJournalRAW: JournalRaw = new JournalRaw();
  private unsavedJournal: JournalRaw | undefined;
  user?: User
  version = VERSION.full
  topicModel: MonacoTreeElement[] = [
    // {
    //   name: this.currentJournalRAW.title ?? "",
    //   content: []
    // }
  ]
  originalModel = {
    code: 'heLLo world!',
    language: 'text/plain'
  };
  dependencies: string[] = [
    '@ngstack/translate@0.2.4',
    '@ngstack/code-editor@0.1.7'
  ];
  options = {
    contextmenu: true,
    theme: 'vs-dark',
    minimap: {
      enabled: true
    },
    wordWrap: "on",
    language: 'text/plain',
    style: "width:100%; height: 100%"
  };
  private editor: any;

  constructor(http: HttpClient, private journalService: JournalService, private accountService: AccountService,) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user
      }
    })
  }

  ngOnInit() {
    this.journalService.retrieveLatestJournalRaw().subscribe(
      (val) => {
        console.log("GET call successful value returned in body", val);
        this.currentJournalRAW = val;
        this.journalRAWList.push(this.currentJournalRAW);
        if(val.topicTree) {
          this.topicModel = JSON.parse(val.topicTree);
          this.topicModel[0].journalRAWId = this.currentJournalRAW.journalRawId
        }
        this.onCodeChanged("Pull Journal Data:")
      },
      response => {
        console.log("GET call in error", response);
      },
      () => {
        console.log("The GET observable is now completed.");
      });
  }

  initEditor(editorEvents: EventEmitter<any>) {
    console.log("editorEvents:", editorEvents);
    this.editor = editorEvents;
    this.editor.onDidType((char: string) => this.onCodeChanged(char));
    
    // Add resize observer to handle container resizing
    const resizeObserver = new ResizeObserver(() => {
      if (this.editor) {
        this.editor.layout();
      }
    });
    
    // Observe the JournalContentArea
    const contentArea = document.getElementById('JournalContentArea');
    if (contentArea) {
      resizeObserver.observe(contentArea);
    }
  }

  onCodeChanged(char: string) {
    console.log("this.journalRAWList: ", this.journalRAWList)
    if (char == '/n' || ':' || "") {
      this.topicList = this.populateTopicListFromJWText(this.currentJournalRAW);
      this.parseDataListToTree();
      this.currentJournalRAW.modified = true;
    }
    localStorage.setItem("todaysJournal", JSON.stringify(this.currentJournalRAW));
    console.log("Character Typed:", {char});
  }

  translateTopicListToTree(tList: Array<Topic>): MonacoTreeElement[] {
    let tree: MonacoTreeElement[] = [];
    for (let topic in tList) {
      const name = tList[topic].Text?.replace(':', '').trim() || "";
      const node: MonacoTreeElement = {name};
    }
    return tree;
  }

  parseDataListToTree(): MonacoTreeElement[] {
    const stack: { level: number; node: MonacoTreeElement }[] = [];
    let root: MonacoTreeElement[] = [];
    let rootNodeIndex = this.topicModel.findIndex(t => t.journalRAWId == this.currentJournalRAW.journalRawId);
    if (rootNodeIndex >= 0 && this.topicModel[rootNodeIndex].content) {
      this.topicModel[rootNodeIndex].content = [];
      this.topicModel[rootNodeIndex].journalRAWId = this.currentJournalRAW.journalRawId;
      this.topicModel[rootNodeIndex].name;
    }
    for (let topic in this.topicList) {
      const name = this.topicList[topic].Text?.replace(':', '').trim() || "";
      const level = this.topicList[topic].numberOfTabs || 0;

      const node: MonacoTreeElement = {
        name,
        content: []
      };
      node.topic = this.topicList[topic];
      node.journalRAWId = this.currentJournalRAW.journalRawId;

      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        const parent = stack[stack.length - 1].node;
        if (!parent.content) {
          parent.content = [];
        }
        parent.content.push(node);
      }

      stack.push({level, node});
    }
    root[0].journalRAWId = this.currentJournalRAW.journalRawId;
    if (rootNodeIndex < 0) this.topicModel.push(root[0])
    else this.topicModel[rootNodeIndex] = root[0]
    console.log("root: ", root)
    return root;
  }

  parseDataListToTreeMinimal(topicList:Topic[]): MonacoTreeElement[] {
    const stack: { level: number; node: MonacoTreeElement }[] = [];
    const root: MonacoTreeElement[] = [];
    if (this.topicList.length < 1) this.onCodeChanged("Generate List");
    for (let topic in topicList) {
      const name = topicList[topic].Text?.replace(':', '').trim() || "";
      const level = topicList[topic].numberOfTabs || 0;
      const node: MonacoTreeElement = {
        name,
      };
      node.journalRAWId = this.currentJournalRAW.journalRawId;
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      if (stack.length === 0) {
        root.push(node);
      } else {
        const parent = stack[stack.length - 1].node;
        if (!parent.content) {
          parent.content = [];
        }
        parent.content.push(node);
      }
      stack.push({level, node});
    }
    return root;
  }

  setJournalTitleToFirstLineOfContent(jRaw: JournalRaw){
    var firstLine = jRaw.content?.split('\n', 1)[0];
    jRaw.title = firstLine ?? ""
  }
  populateTopicListFromJWText(jRaw: JournalRaw) {
    let input = jRaw.content ?? ""
    let tList : Topic[] = []
    let lines = input.split('\n')
    let topic = new Topic()
    let lineCount = 0
    this.setJournalTitleToFirstLineOfContent(jRaw)
    topic.Text = jRaw.title
    topic.numberOfTabs = -1
    topic.topicInformation = "Journal Title"
    topic.lineNumber = lineCount
    topic.JRId = jRaw.journalRawId
    for (let line in lines) {
      let text = lines[line].trimEnd();
      if (text.endsWith(':\r') || text.endsWith(':')) {
        tList.push(topic)
        topic = new Topic()
        topic.Text = text.replace(':', '').trim();
        topic.numberOfTabs = this.numberOfTabs(lines[line])
        topic.numberOfSpaces = this.numberOfSpaces(lines[line])
        topic.topicInformation = ''
        topic.lineNumber = lineCount;
      } else {
        topic.topicInformation += ' ' + lines[line].trim()
      }
      lineCount++;
    }
    tList.push(topic);
    console.log("Generated Topic List :", tList)
    console.log("Global Topic list:", this.topicList)
    return tList
  }

  numberOfTabs(text: string): number {
    var count = 0;
    count = text.length - text.trimStart().length
    return Math.floor(count / 4);
  }

  numberOfSpaces(text: string): number {
    return text.length - text.trimStart().length
  }

  saveJournal() {
    console.log("this.journalRAWList: ", this.journalRAWList)
    console.log("topic list pre save:",this.topicList)
    console.log("minimal json:",this.parseDataListToTreeMinimal(this.topicList))
    this.currentJournalRAW.topicTree = JSON.stringify(this.parseDataListToTreeMinimal(this.topicList));
    this.journalService.saveJournalRAW(this.currentJournalRAW).subscribe({
      next: (val) => {
        this.currentJournalRAW = val;
        console.log("saveJournal journalRAWList: ", this.journalRAWList)
        console.log("saveJournal currentJournalRAW: ", this.currentJournalRAW)
        console.log("POST call successful value returned in body", val);
      },
      error: (e) => console.error(e),
      complete: () => console.log("saveJournal() POST completed.")
    })
  }

  saveNewJournal(jRaw:JournalRaw){
    jRaw.topicTree = JSON.stringify(this.parseDataListToTreeMinimal(this.populateTopicListFromJWText(jRaw)));
    this.journalService.saveJournalRAW(jRaw).subscribe({
      next: (val) => {
        console.log("Save Journal With return value of:", val)
        jRaw = val;
      },
      error: (e) => console.error(e),
      complete: () => console.info('saveNewJournal(jRaw:JournalRaw) complete')
    })
  }

  // retrieveJournal() {
  //   console.log("Retrieving Journal ")
  //   this.http.get<Journal[]>(this.baseUrl + 'journalData').subscribe({
  //     next: result => {
  //       console.log("resul: ", result)
  //       this.journals = result;
  //     },
  //     error: (e) => console.error(e),
  //     complete: () => console.info('retrieveJournal() complete')
  //   })
  // }

  retrieveJournalRawList() {
    this.journalService.retrieveUserJournalList().subscribe({
      next: result => {
        this.journalRAWList = result;
        console.log("retrieveJournalRawList: ", this.journalRAWList)
        this.assembleTreeFromList();
      },
      error: (e) => console.error(e),
      complete: () => console.info('retrieveJournalRawList() complete')
    })
  }

  isThereNewUnsavedJournal(jrList: JournalRaw[]){
    let indexofJournal = jrList.findIndex((element) => element.journalRawId === (0 || undefined))
    if(indexofJournal >= 0){
      this.unsavedJournal = jrList[indexofJournal]
      return true;
    }else{
      return false;
    }
  }

  retrieveUnsavedJournal(){
    return this.unsavedJournal;
  }

  retrieveJournalFromList(jr: JournalRaw, jrList: JournalRaw[]){
    let indexofJournal = jrList.findIndex((element) => element.journalRawId === jr.journalRawId)
    if(indexofJournal >= 0) return jrList[indexofJournal];
    return null;
  }

  retainJournalInList(cj:JournalRaw){
    let existingJournal = this.retrieveJournalFromList(cj,this.journalRAWList);
    console.log("retainJournalInList existingJournal: ",existingJournal)
    if(existingJournal) existingJournal = cj;
    else this.journalRAWList.push(cj);
  }

  newJournal() {
    console.log("Checking for existing new journal")
    this.retainJournalInList(this.currentJournalRAW);
    //Check for unsave new journals and Prompt for save
    if(this.isThereNewUnsavedJournal(this.journalRAWList)){
      console.log("New Unsaved journal exists")
      //this._popupService.openPopup();
      window.confirm("You Have a new unsaved journal with title: " + this.unsavedJournal?.title + "you must save or discard this journal to proceed");
      this.saveNewJournal(<JournalRaw>this.unsavedJournal)
    }
    this.currentJournalRAW = {};
    this.currentJournalRAW = {
      title: "Untitled Journal",
      journalRawId: undefined,
      content: "Untitled Journal",
      modified: true
    }
    let treeElement: MonacoTreeElement = {
      name: this.currentJournalRAW.title ?? "No Title",
      content: [],
      journalRAWId: this.currentJournalRAW.journalRawId,
    };
    this.topicModel.push(treeElement)
    this.journalRAWList.push(this.currentJournalRAW);
    console.log("newJournal journalRAWList: ", this.journalRAWList)
  }

  openJournal(journal: Topic) {
    console.log("opening journal", journal, "journal.JRId:", journal.JRId)
    let indexofJournal = this.journalRAWList.findIndex((element) => element.journalRawId === journal.JRId)
    console.log("openJournal journalRAWList", this.journalRAWList)
    if (indexofJournal >= 0) {
      this.currentJournalRAW = this.journalRAWList[indexofJournal];
      console.log("opening journal", this.currentJournalRAW)
    } else {
      //throw Error;
    }
  }

  private assembleTreeFromList() {
    console.log("assembleTreeFromList journalRAWList: ", this.journalRAWList)
    this.journalRAWList.forEach(jrw => {
      console.log("Assembling Journal: ", jrw);
      let treeElement: MonacoTreeElement = {
        name: "Untitled Journal",
        content: [],
        journalRAWId: jrw.journalRawId
      };
      if (jrw.topicTree) treeElement = JSON.parse(jrw.topicTree)[0]
      treeElement.journalRAWId = jrw.journalRawId;
      treeElement.userId = jrw.userId
      if (this.topicModel.findIndex(t => t.journalRAWId == treeElement.journalRAWId) < 0) {
        this.topicModel.push(treeElement);
      }
    })
    console.log("Assembled Tree: ", this.topicModel)
  }
}
export class Topic {
  Text?: string;
  JRId?: number;
  numberOfTabs?: number;
  numberOfSpaces?: number;
  topicInformation?: string;
  lineNumber: number = -1;
}

interface Journal {
  Id: string;
  UserID: string;
  Title: string;
  DateCreated: Date;
  DateModified: Date;
  Content: string;

}
