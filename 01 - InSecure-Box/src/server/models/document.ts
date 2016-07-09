/**
*
*/
export interface Document {
  id?: string;

  owner: string;   // -> User.id

  title: string;

  contents: string;

  dateCreated: Date;
}
