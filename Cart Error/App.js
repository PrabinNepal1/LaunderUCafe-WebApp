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
import {CartContextProvider} from "./global/CartContext";
import PrivateRoute from './components/PrivateRoute';
import Cafe from './components/pagesComponent/services/cafe';
import Cart from './components/pagesComponent/services/cart';
//import CheckoutForm from './components/pagesComponent/payment/checkoutform'
//import { loadStripe } from "@stripe/stripe-js";
//import { Elements } from "@stripe/react-stripe-js";

//const promise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);


function App (){
  return (

    <Router>
      <AuthProvider>
      <CartContextProvider>
      <Switch>
        <div className="App">

          <Header/>
          <Route exact path='/' component={Homepage}/>
          <Route exact path='/login' component={Login}/>
          <Route exact path='/signup' component={Signup}/>
          <PrivateRoute exact path='/userpage' component={UserPage}/>
          <Route exact path='/cafe' component={Cafe}/>
          <PrivateRoute exact path='/cart' component={Cart}/>

        </div>
      </Switch>
      </CartContextProvider>
      </AuthProvider>
    </Router>
  );
 }

export default App;
