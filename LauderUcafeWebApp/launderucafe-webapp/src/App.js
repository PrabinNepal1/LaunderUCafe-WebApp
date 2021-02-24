//includes
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import './Assets/css/default.min.css';

//components
import Header from './components/headerComponent/header';
import Homepage from './components/pagesComponent/homepage';
import Login from './components/pagesComponent/login';
import Signup from './components/pagesComponent/signup';
import UserPage from './components/pagesComponent/userpage';
import {AuthProvider} from "./contexts/AuthContext";
import PrivateRoute from './components/PrivateRoute';

function App (){
  return (

    <Router>
      <AuthProvider>
      <Switch>
        <div className="App">

          <Header />
          <Route exact path='/' component={Homepage}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <PrivateRoute exact path='/userpage' component={UserPage}/>

        </div>
      </Switch>
      </AuthProvider>
    </Router>
  );
 }

export default App;
