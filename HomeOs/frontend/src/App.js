
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
import Events from "./pages/events";
import Actions from "./pages/actions";
import Event from "./pages/event";
import RegisterPage from "./pages/register";
import Admin from "./pages/admin";



function App() {
  return (
    <Router>
      <Header />
      <Switch>
        {/* Dynamic routes */}
        <Route path="/dev/:device_id" component={ Device } />
        <Route path="/event/:event_id" component={ Event } />

        {/* Normal routes */}
        <Route path="/actions" component={ Actions } />
        <Route path="/events" component={ Events } />
        <Route path="/admin" component={ Admin } />

        {/* Auth */}
        <Route path="/login" component={ LoginPage } />
        <Route path="/register" component={ RegisterPage } />
        <Route path="/logout" component={ LogoutPage } />

        {/* Index */}
        <Route path="/" component={ Index } />
      </Switch>
    </Router>
  );
}

export default App;
