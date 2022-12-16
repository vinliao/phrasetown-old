export type PerlCastTypeOne = {
  id: number
  type: string
  payload: {
    hash: string
    text: string
    author: {
      fid: number
      pfp: {
        url: string
        verified: boolean
      }
      profile: {
        bio: {
          text: string
          mentions: Array<any>
        }
      }
      username: string
      displayName: string
      followerCount: number
      followingCount: number
    }
    recasts: {
      count: number
      recasters: Array<{
        fid: number
        username: string
        recastHash: string
        displayName: string
      }>
    }
    replies: {
      count: number
    }
    watches: {
      count: number
    }
    reactions: {
      count: number
    }
    timestamp: number
    threadHash: string
    attachments: {
      openGraph: Array<{
        url: string
        domain: string
        useLargeImage: boolean
        strippedCastText: string
      }>
    }
  }
  num_saves: string
  timestamp: string
}

export type PerlCastTypeTwo = {
  id: number
  type: string
  payload: {
    body: {
      fid: number
      data: {
        text: string
      }
      type: string
      address: string
      sequence: number
      username: string
      publishedAt: number
      prevMerkleRoot: string
    }
    meta: {
      avatar: string
      parents: Array<any>
      recasts: {
        self: boolean
        count: number
      }
      replies: Array<any>
      watches: {
        self: boolean
        count: number
      }
      mentions: Array<{
        address: string
        username: string
      }>
      reactions: {
        self: boolean
        type: string
        count: number
      }
      recasters: Array<any>
      displayName: string
      followerCount: number
      followingCount: number
      isVerifiedAvatar: boolean
      numReplyChildren: number
    }
    signature: string
    merkleRoot: string
    attachments: {
      openGraph: Array<{
        url: string
        logo: string
        domain: string
        useLargeImage: boolean
        strippedCastText: string
      }>
    }
    threadMerkleRoot: string
  }
  num_saves: string
  timestamp: string
}