export interface Root {
  result: Result
}

export interface Result {
  cast: Cast
}

export interface Cast {
  hash: string
  threadHash: string
  author: Author
  text: string
  timestamp: number
  attachments: Attachments
  replies: Replies
  reactions: Reactions
  recasts: Recasts
  watches: Watches
  parentHash?: string;
  parentAuthor?: ParentAuthor;
}

export interface ParentAuthor {
  fid: number;
  username: string;
  displayName: string;
  pfp: Pfp;
  followerCount: number;
  followingCount: number;
}

export interface Author {
  fid: number
  username: string
  displayName: string
  pfp: Pfp
  profile: Profile
  followerCount: number
  followingCount: number
}

export interface Pfp {
  url: string
  verified: boolean
}

export interface Profile {
  bio: Bio
}

export interface Bio {
  text: string
  mentions: any[]
}

export interface Attachments {
  openGraph: OpenGraph[]
}

export interface OpenGraph {
  url: string
  domain: string
  logo: string
  useLargeImage: boolean
  strippedCastText: string
}

export interface Replies {
  count: number
}

export interface Reactions {
  count: number
}

export interface Recasts {
  count: number
  recasters: any[]
}

export interface Watches {
  count: number
}
