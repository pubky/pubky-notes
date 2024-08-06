import styled from "styled-components";
import { useAtom, useAtomValue } from "jotai";

import {
  initialNote,
  notesAtom,
  pubkyUrlAtom,
  selectedNoteAtom,
} from "~/atoms";
import { pubkyClient } from "~/constants/index";

const Sidebar = () => {
  const url = useAtomValue(pubkyUrlAtom);
  const [notes, setNotes] = useAtom(notesAtom);
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);

  const createNote = async () => {
    const newNote = { id: `${notes.length}`, content: "" };
    setSelectedNote(newNote);
    setNotes((prev) => [...prev, newNote]);
  };

  const deleteNote = async (id: string) => {
    let newNotes = notes.filter((note) => note.id !== id);
    if (newNotes.length === 0) {
      newNotes = [initialNote];
    }

    setNotes(newNotes);
    setTimeout(() => setSelectedNote(newNotes[0]), 0);
    // Delete note from server
    pubkyClient.delete(`${url}/notes/${id}`);
  };

  const sortedNotes = notes.sort((a, b) => a.id.localeCompare(b.id));

  return (
    <Container>
      {sortedNotes.map((note) => {
        const firstLine = note.content.split("\n")[0];
        const title = firstLine.substring(0, 20) || "Untitled";
        // Remove special characters at the beginning of the title
        const strippedTitle = title.replace(/^[^a-z0-9]+/gi, "");

        return (
          <ListItem
            key={note.id}
            $selected={selectedNote.id === note.id}
            onClick={() => setSelectedNote(note)}
          >
            {strippedTitle}
            <DeleteButton onClick={() => deleteNote(note.id)}>🗑</DeleteButton>
          </ListItem>
        );
      })}
      <Button onClick={createNote}>New Note</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #2a2a2a;
  height: 100vh;
  width: 200px;
  padding: 16px;
`;

const DeleteButton = styled.div`
  display: none;
  margin-left: 16px;
`;

const ListItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  cursor: pointer;
  padding: 8px;
  font-weight: ${({ $selected }) => ($selected ? "bold" : "normal")};

  &:hover {
    background-color: #3a3a3a;

    ${DeleteButton} {
      display: block;
    }
  }
`;

const Button = styled.button`
  margin-top: 8px;
`;

export default Sidebar;
