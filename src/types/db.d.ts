import firebase from "firebase/compat/app";

export type TUser = {
  name?: string;
  email?: string;
  gender?: string;
  birth?: {
    year: number;
    month: number;
    day: number;
  }
  size?: string;
  profile?: string;
}

export type TProduct = {
  productId: string;
  modelNo?: string;
  modelName?: string;
  brand?: string;
  link?: string;
  image?: string;
};

export type TBrand = {
  brandId?: string;
  brand: string;
  description: string;
  link: string;
  thumbnail: string;
}

export type TLikeBrand = {
  brandId?: string;
  nameKor?: string;
  nameEn?: string;
  image?: string;
}

export type TShoeRackReview = {
  star: number;
  datetime?: Date | firebase.firestore.Timestamp;
  length: string;
  width: string;
  height: string;
  cushion: string;
  weight: string;
  size: string;
  review: string;
};

export type TSearchHistory = {
  value: string;
  datetime: Date | firebase.firestore.Timestamp;
}

export type TChatMessage = {
  id?: number | string;
  sender?: string;
  text?: string;
  image?: string | File;
  products?: TProduct[];
  brands?: TBrand[];
  dislike?: boolean;
}

export type TChat = {
  chatId: string;
  title?: string;
  messages?: TChatMessage[];
  datetime?: Date;
}

export type TSharedChat = {
  title: string;
  count?: number;
  datetime?: firebase.firestore.Timestamp | string;
}