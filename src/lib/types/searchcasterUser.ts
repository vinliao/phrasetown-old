export type Root = Root2[]

export interface Root2 {
  body: Body
  connectedAddress: string
}

export interface Body {
  id: number
  address: string
  username: string
  displayName: string
  bio: string
  followers: number
  following: number
  avatarUrl: string
  isVerifiedAvatar: boolean
  proofUrl: string
  registeredAt: number
}
