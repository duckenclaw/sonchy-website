export interface Lecture {
  id: number;
  description: string;
  price: string;
  coverImage: string;
  /** Shop link. Paid lectures only — free materials are mailed instead. */
  buyLink?: string;
  /** Slides shown in the modal gallery. */
  images: string[];
  /**
   * Marks a free material and names the file the server mails out. Set this
   * instead of `buyLink`: the card then carries the star badge rather than a
   * price button, and the modal shows the email form in place of the buy
   * button. Must match a key of MATERIALS in server/index.js.
   */
  material?: string;
}
