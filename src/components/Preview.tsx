import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Markdoc, { RenderableTreeNode } from "@markdoc/markdoc";
import styled from "styled-components";

import { pubkyClient } from "~/constants/index";
import decoder from "~/utils/textdecoder";

const POLLING_INTERVAL = 3000;

const Preview = () => {
  let [searchParams] = useSearchParams();
  const [markdown, setMarkdown] = useState<RenderableTreeNode>();

  const fetchNote = useCallback(async () => {
    const url = searchParams.get("url");

    if (!url) {
      return;
    }

    // Fetch note
    const noteBuffer = await pubkyClient!.get(url);
    const json = decoder.decode(noteBuffer);
    const note = JSON.parse(json);

    // Render markdown
    const ast = Markdoc.parse(note.content);
    const content = Markdoc.transform(ast);
    setMarkdown(content);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNote();
  }, []);

  // Polling
  useEffect(() => {
    const interval = setInterval(fetchNote, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNote]);

  return (
    <Container>
      {markdown && Markdoc.renderers.react(markdown, React)}
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  height: 100vh;
  padding: 24px 32px;
  position: relative;
`;

export default Preview;
