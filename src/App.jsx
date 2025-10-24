import { Board } from "./components/Board/Board";
import { Grid } from "./components/Grid/Grid";
import { AppProvider } from "./providers/AppProvider";

function App() {
  return (
    <AppProvider>
      <div className="container">
        <Board>
          <Grid />
        </Board>
      </div>
    </AppProvider>
  );
}

export default App;
