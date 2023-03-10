export const btnClasses = {
  green: "rounded-lg bg-green-200 py-1 px-3 text-lg font-bold text-gray-600",
  orange: "rounded-lg bg-orange-200 py-1 px-3 text-lg font-bold text-gray-600",
  red: "rounded-lg bg-red-200 py-1 px-3 text-lg font-bold text-gray-600",
};

export interface Meme {
  memeId: number;
  comments: Array<Meme>;
  createdAt: Date;
  imgUrl: string;
  isComment: Boolean;
  parentMeme: number;
  likedBy: Array<number>;
  softDeleted: Boolean;
  tags: Array<string>;
  template: string;
  uploader: number;
  updatedAt: Date;
}

export interface User {
  userId: number;
  googleId: number;
  username: string;
  name: string;
  nickname: string;
  email: string;
  avatar: string;
  banner: string;
  about: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  twitch: string;
  siteUrl: string;

  friends: Array<number>;
  followers: Array<number>;
  followersCounter: number;
  follows: Array<number>;
  followsCounter: number;
  likeCounter: number;
  searchEntries: Array<String>;
  isAdmin: Boolean;
  likedMemes: Array<number>;
  memes: Array<number>;
  softDeleted: Boolean;
  tags: Array<string>;
  birthday: Date;
  createdAt: Date;
  updatedAt: Date;
}
