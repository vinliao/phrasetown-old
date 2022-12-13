// https://api.farcaster.xyz/v2/user-by-username?username=${username}

export interface Root {
  data: Data;
}

export interface Data {
  result: Result;
}

export interface Result {
  user: User;
}

export interface User {
  fid: number;
  username: string;
  displayName: string;
  pfp: Pfp;
  profile: Profile;
  followerCount: number;
  followingCount: number;
  referrerUsername: string;
  viewerContext: ViewerContext;
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
  mentions: any[];
}

export interface ViewerContext {
  following: boolean;
  followedBy: boolean;
  canSendDirectCasts: boolean;
}
