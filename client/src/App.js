import "./App.css";
import Portal from "./Components/Portal/Portal";
import { Route, Switch, BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Portal} exact />
        <Route path="/portal/:key" component={Portal} />
      </Switch>
    </BrowserRouter>
    // <div className="App">
    //   <Portal />
    // </div>
  );
}

export default App;
