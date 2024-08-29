import { atom } from "recoil";

export const expenseAtom = atom({
  key: 'expenseAtomKey',
  default: [],
});
