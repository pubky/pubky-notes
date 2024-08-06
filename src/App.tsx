import styled from "styled-components";

import GlobalStyle from "~/styles/global";
import Header from "~/components/Header";
import Auth from "~/components/Auth";
import Main from "~/components/Main";
import Sidebar from "~/components/Sidebar";
import Note from "~/components/Note";

const App = () => {
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <Auth>
          <Main>
            <Sidebar />
            <Note />
          </Main>
        </Auth>
      </AppContainer>
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
