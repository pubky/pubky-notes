import { Buffer } from "buffer";
import { useSetAtom } from "jotai";
import styled from "styled-components";
import { Keypair, PublicKey } from "@synonymdev/pubky";

import { HOMESERVER } from "~/constants";
import { secretKeyAtom } from "~/atoms";
import { pubkyClient } from "~/constants/index";

const Login = () => {
  const setSecretKey = useSetAtom(secretKeyAtom);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const secretKey = formData.get("secretKey") as string;

    setSecretKey(secretKey);
  };

  const onSignup = async () => {
    // Create a new account
    const keypair = Keypair.random();
    const homeserver = PublicKey.from(HOMESERVER);
    await pubkyClient.signup(keypair, homeserver);
    const secretKey = Buffer.from(keypair.secretKey()).toString("hex");

    setSecretKey(secretKey);
  };

  return (
    <Container>
      <Title>Pubky Notes</Title>
      <Text>Enter your private key to login</Text>
      <Form onSubmit={onSubmit}>
        <TextField type="text" name="secretKey" placeholder="Private Key" />
        <button type="submit">Login</button>
      </Form>
      <Divider />
      <Text>Or signup with a new account</Text>
      <button onClick={onSignup}>New Account</button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 16px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-top: 0;
`;

const Text = styled.p`
  font-size: 1rem;
  margin: 0;
  margin-bottom: 16px;
`;

const Divider = styled.div`
  background-color: #666;
  height: 1px;
  width: 60%;
  margin: 32px 0;
`;

const Form = styled.form`
  display: flex;
  gap: 8px;
`;

const TextField = styled.input`
  padding: 8px 16px;
`;

export default Login;
