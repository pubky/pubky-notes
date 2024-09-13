import styled from "styled-components";
import { Toaster } from "react-hot-toast";

import GlobalStyle from "~/styles/global";
import Header from "~/components/Header";
import AppRouter from "./components/AppRouter";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <AppRouter />
      </AppContainer>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 5000,
          style: { padding: "4px 8px" },
        }}
      />
    </>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
`;

export default App;
