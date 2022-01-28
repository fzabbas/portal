import "./App.scss";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Portal from "./Components/Portal/Portal";
import LandingPage from "./Pages/LandingPage/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={LandingPage} exact />
        <Route path="/portal/:key" component={Portal} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
