// 📂 src/app/models/board.model.ts

export type Card = {
  readonly id: string;
  title: string;
  dueDate?: string;
};

export type List = {
  readonly id: string;
  title: string;
  cards: Card[];
};

export type Board = {
  readonly id: string;
  title: string;
  lists: List[];
  image?: string;
  imageHd?: string; // Optional high-resolution image for the board (base64 or URL)
};

export type BoardState = {
  boards: Board[];
  activeBoardId: string | null;
};
