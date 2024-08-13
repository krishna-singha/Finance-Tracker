import { atom } from "recoil";

export const incomeAtom = atom({
  key: 'incomeAtomKey',
  default: [{
    source: "income",
    amount: 0,
    date: "13-aug-2024"
  }],
});
