
// React
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

// Pages
import Index from './pages/index.js';

// Components
import Header from './components/header.js';

// CSS
import './static/css/app.css';


function App() {
  return (
    <Router>
      <Header />
      <Switch>
        {/* Index */}
        <Route path="/" component={ Index } />
      </Switch>
    </Router>
  );
}

export default App;
