export interface Root {
  data: Data
}

export interface Data {
  result: Result
  next: Next
}

export interface Result {
  notifications: Notification[]
}

export interface Notification {
  type: string
  id: string
  timestamp: number
  actor: Actor
  content: Content
}

export interface Actor {
  fid: number
  username: string
  displayName: string
  pfp: Pfp
  followerCount: number
  followingCount: number
}

export interface Pfp {
  url: string
  verified: boolean
}

export interface Content {
  cast: Cast
}

export interface Cast {
  hash: string
  threadHash: string
  author: Author
  text: string
  timestamp: number
  mentions?: Mention[]
  replies: Replies
  reactions: Reactions
  recasts: Recasts
  watches: Watches
  viewerContext: ViewerContext
  parentHash?: string
  parentAuthor?: ParentAuthor
  attachments?: Attachments
}

export interface Author {
  fid: number
  username: string
  displayName: string
  pfp: Pfp2
  followerCount: number
  followingCount: number
}

export interface Pfp2 {
  url: string
  verified: boolean
}

export interface Mention {
  fid: number
  username: string
  displayName: string
  pfp: Pfp3
  followerCount: number
  followingCount: number
}

export interface Pfp3 {
  url: string
  verified: boolean
}

export interface Replies {
  count: number
}

export interface Reactions {
  count: number
}

export interface Recasts {
  count: number
  recasters: Recaster[]
}

export interface Recaster {
  fid: number
  username: string
  displayName: string
  recastHash: string
}

export interface Watches {
  count: number
}

export interface ViewerContext {
  reacted: boolean
  recast: boolean
  watched: boolean
}

export interface ParentAuthor {
  fid: number
  username: string
  displayName: string
  pfp: Pfp4
  followerCount: number
  followingCount: number
}

export interface Pfp4 {
  url: string
  verified: boolean
}

export interface Attachments {
  openGraph: OpenGraph[]
}

export interface OpenGraph {
  url: string
  title?: string
  description?: string
  domain: string
  image?: string
  logo?: string
  useLargeImage: boolean
  strippedCastText: string
}

export interface Next {
  cursor: string
}
