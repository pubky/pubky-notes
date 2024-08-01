import { useState } from "react";
import { PubkyClient, Keypair, PublicKey } from "@synonymdev/pubky";
import { Buffer } from "buffer";

import "./App.css";

const HOMESERVER = "8pinxxgqs41n4aididenw5apqp1urfmzdztr8jt4abrkdn435ewo";

const decoder = new TextDecoder();

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [note, setNote] = useState("");

  async function create() {
    // Initialize PubkyClient with Pkarr relay(s).
    const client = PubkyClient.testnet();
    console.log({ client });

    // Generate a keypair
    const keypair = Keypair.random();
    console.log({ keypair });

    // Create a new account
    const homeserver = PublicKey.from(HOMESERVER);
    console.log({ homeserver });

    const response = await client.signup(keypair, homeserver);
    console.log({ response });

    const publicKey = keypair.publicKey();
    console.log({ publicKey });

    // Pubky URL
    const url = `pubky://${publicKey.z32()}/pub/example.com/arbitrary`;
    // Verify that you are signed in.
    const session = await client.session(publicKey);
    const body = Buffer.from(JSON.stringify({ foo: inputValue }));

    // PUT public data, by authorized client
    await client.put(url, body);

    // GET public data
    const buffer = await client.get(url);
    console.log({ buffer });

    if (buffer) {
      const json = decoder.decode(buffer);
      const note = JSON.parse(json);
      console.log({ note });

      setNote(note.foo);
    }
  }

  return (
    <div className="container">
      <h1>Pubky Notes</h1>

      <p>Write a note and save it to the server.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          create();
        }}
      >
        <input
          id="note-input"
          onChange={(e) => setInputValue(e.currentTarget.value)}
          placeholder="Write a note..."
        />
        <button type="submit">Save</button>
      </form>

      <p>{note}</p>
    </div>
  );
};

export default App;
