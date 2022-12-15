export type Root = Root2[];

export interface Root2 {
  id: number;
  type: string;
  payload: Payload;
  num_saves: string;
  timestamp: string;
}

export interface Payload {
  hash?: string;
  text?: string;
  author?: Author;
  recasts?: Recasts;
  replies?: Replies;
  watches?: Watches;
  mentions?: Mention[];
  reactions?: Reactions;
  timestamp?: number;
  threadHash?: string;
  attachments?: Attachments;
  body?: Body;
  meta?: Meta;
  signature?: string;
  merkleRoot?: string;
  threadMerkleRoot?: string;
  parentHash?: string;
  parentAuthor?: ParentAuthor;
}

export interface Author {
  fid: number;
  pfp: Pfp;
  profile: Profile;
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
}

export interface Pfp {
  url: string;
  verified: boolean;
}

export interface Profile {
  bio: Bio;
}

export interface Bio {
  text: string;
  mentions: string[];
}

export interface Recasts {
  count: number;
  recasters: Recaster[];
}

export interface Recaster {
  fid: number;
  username: string;
  recastHash: string;
  displayName: string;
}

export interface Replies {
  count: number;
}

export interface Watches {
  count: number;
}

export interface Mention {
  fid: number;
  pfp: Pfp2;
  profile: Profile2;
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
}

export interface Pfp2 {
  url: string;
  verified: boolean;
}

export interface Profile2 {
  bio: Bio2;
}

export interface Bio2 {
  text: string;
  mentions: string[];
}

export interface Reactions {
  count: number;
}

export interface Attachments {
  openGraph?: OpenGraph[];
}

export interface OpenGraph {
  url: string;
  logo?: string;
  domain: string;
  useLargeImage: boolean;
  strippedCastText: string;
  image?: string;
  title?: string;
  description?: string;
}

export interface Body {
  fid: number;
  data: Data;
  type: string;
  address: string;
  sequence: number;
  username: string;
  publishedAt: number;
  prevMerkleRoot: string;
}

export interface Data {
  text: string;
  replyParentMerkleRoot?: string;
}

export interface Meta {
  avatar: string;
  parents: any[];
  recasts: Recasts2;
  replies: any[];
  watches: Watches2;
  reactions: Reactions2;
  recasters: any[];
  displayName: string;
  followerCount: number;
  followingCount: number;
  isVerifiedAvatar: boolean;
  numReplyChildren: number;
  replyParentUsername?: ReplyParentUsername;
  mentions?: Mention2[];
}

export interface Recasts2 {
  self: boolean;
  count: number;
}

export interface Watches2 {
  self: boolean;
  count: number;
}

export interface Reactions2 {
  self: boolean;
  type: string;
  count: number;
}

export interface ReplyParentUsername {
  address: string;
  displayName: string;
}

export interface Mention2 {
  address: string;
  username: string;
}

export interface ParentAuthor {
  fid: number;
  pfp: Pfp3;
  profile: Profile3;
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
}

export interface Pfp3 {
  url: string;
  verified: boolean;
}

export interface Profile3 {
  bio: Bio3;
}

export interface Bio3 {
  text: string;
  mentions: any[];
}