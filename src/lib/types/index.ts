export interface CastInterface {
  author: {
    username: string,
    displayName: string,
    pfp: string,
    fid?: number, // eventually make this not optional
  };
  parent?: {
    username: string,
    hash: string,
  };
  hash: string,
  timestamp: number;
  text: string;
  image?: string,
  likes: number,
  replies: number,
  recasts: number,
  recasted?: {
    username: string,
  };
}

export interface ColumnInterface {
  casts: CastInterface[],
  name: string;
  index: number;
}

/**
 * @param id id of endpoint, a feed with multiple endpoints have
 * the same id 
 * 
 * @param url where to fetch it from
 * 
 * @param type for deciding how to parse the url
 * it's an enum of "searchcaster", 'merkle', 
 * 
 * @param name the name of the feed, human-readable id
 * 
 * @param cursor for fetching next page from merkle's api
 * 
 * @param nextpage for fetching next page from searchcaster
 * 
 * @param username for recast text (todo: move this somewhere)
 */
export interface EndpointInterface {
  id: string,
  url: string,
  type: string,
  name: string,
  cursor?: string,
  nextPage?: number,
  username?: string; // only exist when endpoint is a farlist
}

export interface FeedInterface {
  casts: CastInterface[],
  enpdoints: EndpointInterface[];
}