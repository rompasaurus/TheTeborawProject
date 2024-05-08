import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {ContextMenuAction, NgxMonacoTreeModule, NgxMonacoTreeComponent} from 'ngx-monaco-tree';
import { MonacoTreeElement } from "../_models/TopicTreeElement";
import { JournalComponent, Topic } from "../journal/journal.component";
import { JournalRaw } from "../_services/journal.service"

@Component({
  selector: 'app-topic-tree',
  templateUrl: './topic-tree.component.html',
  styleUrls: ['./topic-tree.component.css'],
})
export class TopicTreeComponent {
  private _parent: JournalComponent;
  private _ngxMonacoTreeComponent;
  constructor(@Inject(JournalComponent) private parent: JournalComponent, @Inject(NgxMonacoTreeModule) private ngxMonacoTreeComponent:NgxMonacoTreeModule) {
    this._parent = parent;
    this._ngxMonacoTreeComponent = ngxMonacoTreeComponent;
  }

  @Input() journalRaw: JournalRaw = {
    content: 'Empty',
    modified: false
  };
  @Input() journalTopics: MonacoTreeElement[] = [];
  @Input() currentTopic: Topic = {
    lineNumber: 0
  }
  dark = true;
  currentFile = '';
  tree = this.journalTopics
  currentJournalId: number = 0;

  ngOnInit() {
    this.tree = this.journalTopics
    console.log(this._ngxMonacoTreeComponent)
  }

  ngOnChanges() {
    this.tree = this.journalTopics
  }

  handleContextMenu(action: ContextMenuAction) {
    if (action[0] === 'new_directory') {
      this.create('directory', action[1], this.tree);
    } else if (action[0] === 'new_file') {
      this.create('file', action[1], this.tree);
    } else if (action[0] === 'delete_file') {
      this.remove(action[1], this.tree);
    } else if (action[0] === 'rename_file') {
      this.rename(action[1], this.tree);
    }
  }
  rename(path: string, localTree: MonacoTreeElement[]) {
    console.log("Path: ", path)
    const spited = path.split('/');
    if (spited.length === 1) {
      const file = localTree.find((el) => el.name == path);
      const filename = window.prompt('rename', file?.name);
      if (filename && file) {
        file.name = filename;
        if (file.topic) file.topic.Text = filename;
        this.updateJornalRawWithChange(file, filename);
      }
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      this.rename(spited.slice(1).join('/'), file?.content);
    }
  }
  getTreeElement(path: string, localTree: MonacoTreeElement[]): any {
    console.log("Path: ", path)
    const spited = path.split('/');
    if (spited.length === 1) {
      const file = localTree.find((el) => el.name == path);
      if (file) {
        return file;
      }
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      if (file.journalRAWId) this.currentJournalId = file.journalRAWId;
      return this.getTreeElement(spited.slice(1).join('/'), file?.content);
    }
  }
  updateJornalRawWithChange(file: MonacoTreeElement, fileName: string) {
    if (file.topic) {
      let lines: string[] = [];
      if (this.journalRaw.content) lines = this.journalRaw.content.split('\n')
      if (file.topic.lineNumber >= 0) lines[file.topic.lineNumber] = fileName.padStart(file.topic.numberOfSpaces ?? 0, ' ');
      this.journalRaw.content = lines.join('\n');
      console.log("joined line with new topic name: ", fileName, "file: ", file)
    }
  }

  remove(path: string, localTree: MonacoTreeElement[]) {
    const spited = path.split('/');
    if (spited.length === 1) {
      const index = localTree.findIndex((el) => el.name == path);
      localTree.splice(index, 1);
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      this.remove(spited.slice(1).join('/'), file?.content);
    }
  }

  create(
    type: 'directory' | 'file',
    path: string,
    localTree: MonacoTreeElement[]
  ) {
    const spited = path.split('/');
    const filename = window.prompt('name');
    if (!filename) return;
    if (spited.length === 1) {
      const file = localTree.find((el) => el.name == path);
      if (!file) return;
      else if (file.content === undefined) {
        localTree.push({
          name: filename,
          content: type === 'directory' ? [] : undefined,
        });
      } else {
        file.content.push({
          name: filename,
          content: type === 'directory' ? [] : undefined,
        });
      }
    } else {
      const file = localTree.find((el) => el.name == spited[0]);
      if (!file || !file.content) return;
      this.create(type, spited.slice(1).join('/'), file?.content);
    }
  }



  openJournal($event: string) {
    this.currentFile = $event;
    let file = this.getTreeElement($event, this.tree);
    let topic = file.topic ?? { lineNumber: 0, JRId: file.journalRAWId }
    console.log("topic: ", topic, "file:", file, " Event: ", $event, "  JournalId: ", file.journalRAWId);
    console.log($event);
    this.currentTopic = topic;
    this._parent.openJournal(this.currentTopic)
  }
}


