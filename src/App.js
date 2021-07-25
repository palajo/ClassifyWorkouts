import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import MainPage from './routes/MainPage';

function App() {
  return(
    <BrowserRouter>
      <Switch>
        <Route component={MainPage} path="/" exact />
      </Switch>
    </BrowserRouter>
  )
}

export default App;