import React, { useEffect, useState } from "react";
import Markdoc, { RenderableTreeNode } from "@markdoc/markdoc";
import styled from "styled-components";
import { Buffer } from "buffer";
import toast from "react-hot-toast";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useDebounce } from "~/hooks";
import { pubkyClient } from "~/constants/index";
import {
  notesAtom,
  pubkyUrlAtom,
  selectedNoteAtom,
  syncingAtom,
} from "~/atoms";

const SYNC_INTERVAL = 3000;

const Note = () => {
  const url = useAtomValue(pubkyUrlAtom);
  const setNotes = useSetAtom(notesAtom);
  const [note, setNote] = useAtom(selectedNoteAtom);
  const [isSyncing, setIsSyncing] = useAtom(syncingAtom);
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState<RenderableTreeNode>();
  const debouncedNote = useDebounce(note.content, SYNC_INTERVAL);

  useEffect(() => {
    const syncNote = async () => {
      const body = Buffer.from(JSON.stringify(note));
      await pubkyClient!.put(`${url}/notes/${note.id}`, body);

      setIsSyncing(false);
    };

    if (!isSyncing) {
      return;
    }

    syncNote();
  }, [debouncedNote]);

  useEffect(() => {
    setShowPreview(false);
    setMarkdown(undefined);
  }, [note]);

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsSyncing(true);
    const editedNote = { id: note.id, content: event.target.value };
    setNote(editedNote);
    setNotes((prev) => {
      const filtered = prev.filter((n) => n.id !== note.id);
      return [...filtered, editedNote];
    });
  };

  const onPreview = () => {
    const ast = Markdoc.parse(note.content);
    const content = Markdoc.transform(ast);
    setMarkdown(content);
    setShowPreview((prev) => !prev);
  };

  const onShare = () => {
    const shareUrl = `${window.location.origin}/preview?url=${url}/notes/${note.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Copied public URL to clipboard");
  };

  return (
    <Container>
      <Actions>
        <SyncedIndicator $synced={!isSyncing}>Synced ✔</SyncedIndicator>
        <button onClick={onPreview}>{showPreview ? "Edit" : "Preview"}</button>
        <button onClick={onShare}>Share</button>
      </Actions>

      {!showPreview && (
        <TextArea
          value={note.content}
          placeholder="Write a note..."
          onChange={onChange}
        />
      )}

      {showPreview && markdown && Markdoc.renderers.react(markdown, React)}
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  height: 100vh;
  padding: 24px 32px;
  position: relative;
`;

const Actions = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TextArea = styled.textarea`
  flex: 1;
  width: 100%;
  height: 100vh;
  background-color: transparent;
  border: none;
  color: white;
  line-height: 1.5;
`;

const SyncedIndicator = styled.div<{ $synced?: boolean }>`
  font-size: 0.9rem;
  margin-right: 8px;
  opacity: ${({ $synced }) => ($synced ? 0.5 : 0)};
  transition: opacity 0.25s;
`;

export default Note;
