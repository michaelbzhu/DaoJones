import { EthProvider } from "./contexts/EthContext";
import Intro from "./components/Intro";
import Setup from "./components/Setup";
import Demo from "./components/Demo";
import Footer from "./components/Footer";
// import GovernorTable from "./components/GovernorTable"
import BasicTable from "./components/BasicTable"

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Intro />
          <hr />
          <Setup />
          <hr />
          <Demo />
          <hr />
          <Footer />
          {/* <GovernorTable /> */}
          <BasicTable />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
