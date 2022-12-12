export interface Root {
  result: Result
}

export interface Result {
  casts: Cast[]
}

export interface Cast {
  hash: string
  threadHash: string
  author: Author
  text: string
  timestamp: number
  attachments?: Attachments
  replies: Replies
  reactions: Reactions
  recasts: Recasts
  watches: Watches
  parentHash?: string
  parentAuthor?: ParentAuthor
  mentions?: Mention[]
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
  mentions: string[]
}

export interface Attachments {
  openGraph: OpenGraph[]
}

export interface OpenGraph {
  url: string
  domain: string
  logo?: string
  useLargeImage: boolean
  strippedCastText: string
  title?: string
  description?: string
  image?: string
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

export interface ParentAuthor {
  fid: number
  username: string
  displayName: string
  pfp: Pfp2
  profile: Profile2
  followerCount: number
  followingCount: number
}

export interface Pfp2 {
  url: string
  verified: boolean
}

export interface Profile2 {
  bio: Bio2
}

export interface Bio2 {
  text: string
  mentions: string[]
}

export interface Mention {
  fid: number
  username: string
  displayName: string
  pfp: Pfp3
  profile: Profile3
  followerCount: number
  followingCount: number
}

export interface Pfp3 {
  url: string
  verified: boolean
}

export interface Profile3 {
  bio: Bio3
}

export interface Bio3 {
  text: string
  mentions: string[]
}
