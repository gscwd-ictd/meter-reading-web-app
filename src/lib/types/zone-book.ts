import { Area } from "./area";
import { Consumer } from "./consumer";

export type ZoneBook = {
  id: string;
  zone: Area["zone"];
  book: Area["book"];
  consumers: Array<Consumer>;
};
