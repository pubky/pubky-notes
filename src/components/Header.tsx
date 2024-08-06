import { useAtom, useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import styled from "styled-components";

import {
  notesAtom,
  pubkyUrlAtom,
  secretKeyAtom,
  selectedNoteAtom,
} from "~/atoms";

const Header = () => {
  const [secretKey, setSecretKey] = useAtom(secretKeyAtom);
  const setUrl = useSetAtom(pubkyUrlAtom);
  const setNotes = useSetAtom(notesAtom);
  const setSelectedNote = useSetAtom(selectedNoteAtom);

  const onLogout = () => {
    // Clear all the atoms
    setUrl("");
    setSecretKey(RESET);
    setNotes(RESET);
    setSelectedNote(RESET);

    // Make sure everything is cleared
    localStorage.clear();
  };

  return (
    <Container>
      <Title>Pubky Notes</Title>
      <Actions>
        {secretKey && <button onClick={onLogout}>Logout</button>}
      </Actions>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(238, 113, 255, 0.42);
  min-height: 40px;
  padding: 8px 16px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export default Header;
