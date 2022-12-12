export interface Root {
  data: Data;
}

export interface Data {
  result: Result;
  next: Next;
}

export interface Result {
  casts: Cast[];
}

export interface Cast {
  hash: string;
  threadHash: string;
  parentHash?: string;
  parentAuthor?: ParentAuthor;
  author: Author;
  text: string;
  timestamp: number;
  replies: Replies;
  reactions: Reactions;
  recasts: Recasts;
  watches: Watches;
  viewerContext: ViewerContext;
  recast?: boolean;
  mentions?: Mention[];
  attachments?: Attachments;
}

export interface ParentAuthor {
  fid: number;
  username: string;
  displayName: string;
  pfp: Pfp;
  followerCount: number;
  followingCount: number;
}

export interface Pfp {
  url: string;
  verified: boolean;
}

export interface Author {
  fid: number;
  username: string;
  displayName: string;
  pfp: Pfp2;
  followerCount: number;
  followingCount: number;
}

export interface Pfp2 {
  url: string;
  verified: boolean;
}

export interface Replies {
  count: number;
}

export interface Reactions {
  count: number;
}

export interface Recasts {
  count: number;
  recasters: Recaster[];
}

export interface Recaster {
  fid: number;
  username: string;
  displayName: string;
  recastHash: string;
}

export interface Watches {
  count: number;
}

export interface ViewerContext {
  reacted: boolean;
  recast: boolean;
  watched: boolean;
}

export interface Mention {
  fid: number;
  username: string;
  displayName: string;
  pfp: Pfp3;
  followerCount: number;
  followingCount: number;
}

export interface Pfp3 {
  url: string;
  verified: boolean;
}

export interface Attachments {
  openGraph: OpenGraph[];
}

export interface OpenGraph {
  url: string;
  title?: string;
  description?: string;
  domain: string;
  image?: string;
  logo?: string;
  useLargeImage: boolean;
  strippedCastText: string;
}

export interface Next {
  cursor: string;
}
