import { atom } from "recoil";

export const isLoggedInAtom = atom({
  key: 'isLoggedInAtomKey',
  default: false
});
