import { ReactNode, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useAtomValue, useSetAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";

import { notesAtom, pubkyUrlAtom } from "~/atoms";
import decoder from "~/utils/textdecoder";
import { pubkyClient } from "~/constants/index";

const POLLING_INTERVAL = 5000;

const Main = ({ children }: { children: ReactNode }) => {
  const url = useAtomValue(pubkyUrlAtom);
  const setNotes = useSetAtom(notesAtom);

  const getCurrentNotes = useAtomCallback(
    useCallback((get) => get(notesAtom), [])
  );

  useEffect(() => {
    const syncRemote = async () => {
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

          // If there are no notes, set the remote notes
          if (currentNotes.length === 0) {
            setNotes(remoteNotes);
            return;
          }

          const localIds = currentNotes.map((note) => note.id);
          const remoteIds = remoteNotes.map((note) => note.id);

          const newNotes = remoteNotes.filter((note) => {
            return !localIds.includes(note.id);
          });
          const updatedNotes = remoteNotes.filter((note) => {
            return localIds.includes(note.id);
          });

          const mergedNotes = currentNotes
            .filter((note) => !remoteIds.includes(note.id))
            .concat(newNotes)
            .concat(updatedNotes);

          setNotes(mergedNotes);
        } else {
          console.log("notes are the same");
        }
      }
    };

    syncRemote();
    const interval = setInterval(syncRemote, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [url]);

  return <Container>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  flex: 1;
`;

export default Main;
