import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import {useRoutes} from "./router";
import 'materialize-css';

function App() {
    const routes = useRoutes(false);
  return (
      <Router>
          <div className="container">
             {routes}
          </div>
      </Router>
  );
}

export default App;
