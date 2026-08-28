export interface Lecture {
  id: number;
  description: string;
  price: string;
  coverImage: string;
  buyLink: string;
  /** Slides shown in the modal gallery. */
  images: string[];
}
