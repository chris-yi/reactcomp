import React, { Component } from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Login from './Components/Login/Login';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
      {/*COMP 42G*/}
      <Switch>
        {/*COMP 42F*/}
        <Route path='/' component={Login} exact/>
      </Switch>
    </BrowserRouter>
    );
  }
}

export default App;
