import {Topic} from "../../../src/app/journal/journal.component";

export declare type MonacoTreeElement = {
  name: string;
  content?: MonacoTreeElement[];
  topic?:Topic;
  journalRAWId?: number;
  userId?:string;
};
