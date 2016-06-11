/**
*
*/
export interface Message {
  id?: string;

  from: string;  // -> User
  to: string;    // -> User

  title: string;

  dateSent: Date;

  contents: string;

  readStatus: boolean;
}
