import { atom } from "recoil";

export const expenseAtom = atom({
  key: 'expenseAtomKey',
  default: [{
    types: "expense",
    amount: 0,
    date: "13-aug-2024"
  }],
});
