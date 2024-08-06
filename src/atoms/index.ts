import { atom } from "jotai";
import { atomWithDefault, atomWithStorage } from "jotai/utils";

export const secretKeyAtom = atomWithStorage<string | undefined>(
  "secretKey",
  undefined,
  undefined,
  {
    getOnInit: true,
  }
);

export const pubkyUrlAtom = atom("");

export type TNote = {
  id: string;
  content: string;
};

export const initialNote = { id: "0", content: "" };

export const notesAtom = atomWithStorage<TNote[]>(
  "notes",
  [initialNote],
  undefined,
  {
    getOnInit: true,
  }
);

export const sortedNotesAtom = atom((get) => {
  return get(notesAtom).sort((a, b) => a.id.localeCompare(b.id));
});

export const selectedNoteAtom = atomWithDefault((get) => {
  return get(sortedNotesAtom)[0];
});
