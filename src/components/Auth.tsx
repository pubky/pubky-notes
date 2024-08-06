import { useEffect, ReactNode, useState } from "react";
import styled from "styled-components";
import { Keypair, PublicKey } from "@synonymdev/pubky";
import { useAtom, useAtomValue } from "jotai";
import { Buffer } from "buffer";

import { DOMAIN, HOMESERVER, pubkyClient } from "~/constants";
import { pubkyUrlAtom, secretKeyAtom } from "~/atoms";
import Login from "~/components/Login";

const Auth = ({ children }: { children: ReactNode }): ReactNode => {
  const [url, setUrl] = useAtom(pubkyUrlAtom);
  const secretKey = useAtomValue(secretKeyAtom);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const signIn = async (): Promise<void> => {
      if (!secretKey) {
        setIsLoading(false);
        return;
      }

      // Generate a keypair from the secret key
      const secretkey = Buffer.from(secretKey, "hex");
      const keypair = Keypair.fromSecretKey(secretkey);

      // Signup to homeserver
      const homeserver = PublicKey.from(HOMESERVER);
      await pubkyClient.signup(keypair, homeserver);
      const publicKey = keypair.publicKey().z32();

      // Set the URL
      setUrl(`pubky://${publicKey}/pub/${DOMAIN}`);
      setIsLoading(false);
    };

    signIn();
  }, [secretKey]);

  const loggedIn = !!secretKey && !!url;

  if (isLoading) {
    return <Loading />;
  }

  return loggedIn ? children : <Login />;
};

const Loading = styled.div`
  background-color: #2a2a2a;
  flex: 1;
`;

export default Auth;
