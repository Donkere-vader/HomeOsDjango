
// React
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// Pages
import Index from './pages/index';
import Device from './pages/device'

// Components
import Header from './components/header.js';

// CSS
import './static/css/app.css';
import LoginPage from "./pages/login";
import LogoutPage from "./pages/logout";


function App() {
  return (
    <Router>
      <Header />
      <Switch>
        {/* Dynamic routes */}
        <Route path="/dev/:device_id" component={ Device } />

        {/* Auth */}
        <Route path="/login" component={ LoginPage } />
        <Route path="/logout" component={ LogoutPage } />

        {/* Index */}
        <Route path="/" component={ Index } />
      </Switch>
    </Router>
  );
}

export default App;
