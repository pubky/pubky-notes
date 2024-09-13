import { useCallback, useEffect } from "react";
import styled from "styled-components";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";

import { pubkyClient } from "~/constants/index";
import decoder from "~/utils/textdecoder";
import Sidebar from "~/components/Sidebar";
import Note from "~/components/Note";
import {
  notesAtom,
  pubkyUrlAtom,
  selectedNoteAtom,
  syncingAtom,
} from "~/atoms";

const POLLING_INTERVAL = 5000;

const Main = () => {
  const url = useAtomValue(pubkyUrlAtom);
  const isSyncing = useAtomValue(syncingAtom);
  const [selectedNote, setSelectedNote] = useAtom(selectedNoteAtom);
  const setNotes = useSetAtom(notesAtom);

  const getCurrentNotes = useAtomCallback(
    useCallback((get) => get(notesAtom), [])
  );

  const syncRemote = useCallback(async () => {
    if (isSyncing) {
      return;
    }

    const list = await pubkyClient!.list(url);

    if (list.length > 0) {
      const promises = list.map(async (url: string) => {
        return await pubkyClient!.get(url);
      });

      const noteBuffers = await Promise.all(promises);
      const remoteNotes = noteBuffers.map((noteBuffer) => {
        const json = decoder.decode(noteBuffer);
        return JSON.parse(json);
      });

      const currentNotes = getCurrentNotes();

      // Update notes if there are changes
      if (JSON.stringify(currentNotes) !== JSON.stringify(remoteNotes)) {
        console.log("notes have changed");

        // Update all notes
        setNotes(remoteNotes);

        // Update the currently selected note
        const selected = remoteNotes.find((note) => {
          return note.id === selectedNote.id;
        });

        if (selected) {
          setSelectedNote(selected);
        }
      } else {
        console.log("notes are the same");
      }
    }
  }, [isSyncing]);

  // Initial sync
  useEffect(() => {
    syncRemote();
  }, [url]);

  // Polling
  useEffect(() => {
    const interval = setInterval(syncRemote, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [url, syncRemote]);

  return (
    <Container>
      <Sidebar />
      <Note />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex: 1;
`;

export default Main;
