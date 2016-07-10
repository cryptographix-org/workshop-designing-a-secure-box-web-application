/**
*
*/
export interface DocumentShare {
  id?: string;

  document: string; // -> Document.id
  from: string;     // -> User.id
  to: string;       // -> User.id

  dateShared: Date;

  readStatus: boolean;
}
