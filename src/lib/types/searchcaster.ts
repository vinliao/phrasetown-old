export interface Root {
  casts: Cast[];
  meta: Meta2;
}

export interface Cast {
  body: Body;
  meta: Meta;
  merkleRoot: string;
  uri: string;
}

export interface Body {
  publishedAt: number;
  username: string;
  data: Data;
}

export interface Data {
  text: string;
  image?: string;
  replyParentMerkleRoot?: string;
  threadMerkleRoot: any;
}

export interface Meta {
  displayName: string;
  avatar: string;
  isVerifiedAvatar: boolean;
  numReplyChildren: number;
  reactions: Reactions;
  recasts: Recasts;
  watches: Watches;
  replyParentUsername: ReplyParentUsername;
  mentions: Mention[];
}

export interface Reactions {
  count: number;
  type: string;
}

export interface Recasts {
  count: number;
}

export interface Watches {
  count: number;
}

export interface ReplyParentUsername {
  username?: string;
}

export interface Mention {
  address: string;
  username: string;
}

export interface Meta2 {
  count: number;
  responseTime: number;
}