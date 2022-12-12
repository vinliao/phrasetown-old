export type CastArray = Cast[]

export interface Cast {
  id: number
  type: string
  payload: Payload
  num_saves: string
  timestamp: string
}

export interface Payload {
  body: Body
  meta: Meta
  signature: string
  merkleRoot: string
  attachments: Attachments
  threadMerkleRoot: string
}

export interface Body {
  fid: number
  data: Data
  type: string
  address: string
  sequence: number
  username: string
  publishedAt: number
  prevMerkleRoot: string
}

export interface Data {
  text: string
  replyParentMerkleRoot?: string
}

export interface Meta {
  avatar: string
  parents: any[]
  recasts: Recasts
  replies: any[]
  watches: Watches
  reactions: Reactions
  recasters: any[]
  displayName: string
  isVerifiedAvatar: boolean
  numReplyChildren: number
  replyParentUsername?: ReplyParentUsername
  mentions?: Mention[]
  followerCount?: number
  followingCount?: number
}

export interface Recasts {
  self: boolean
  count: number
}

export interface Watches {
  self: boolean
  count: number
}

export interface Reactions {
  self: boolean
  type: string
  count: number
}

export interface ReplyParentUsername {
  address: string
  username: string
}

export interface Mention {
  address: string
  username: string
}

export interface Attachments {
  openGraph: OpenGraph[]
}

export interface OpenGraph {
  url: string
  logo: string
  image?: string
  title?: string
  domain: string
  imageId: any
  description?: string
  useLargeImage: boolean
  strippedCastText: string
}