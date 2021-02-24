import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {useAuth, AuthProvider} from "../../contexts/AuthContext";

function Header(){

    const [error, setError] = useState("")
    const {currentUser, logout} = useAuth()
    const history = useHistory()

    async function handleLogOut(){
      setError('')

      try{
        await logout()
        history.push('/')
      }catch{
        setError("Failed to log out!")
      }

    }

    return (
    <AuthProvider>
      <nav className="navbar navbar-expand-xl navbar-light bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
        <img src="logo.png" alt="logo" width="70" height="60"/>
        LaunderUCafe
        </Link>
    <button
      className="navbar-toggler bg-white"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
      >

      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav m-auto">
        <li className="nav-item">
          <Link className="nav-link text-white mx-5" aria-current="page" to='/'>Home</Link>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle text-white mx-5" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Pricing
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a className="dropdown-item" href="#">Laundry Services</a></li>
            <li><a className="dropdown-item" href="#">Cafe Menu</a></li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle text-white mx-5" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Services
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a className="dropdown-item" href="#">Schedule Laundry</a></li>
            <li><a className="dropdown-item" href="#">Laundry Delivery</a></li>
            <li><a className="dropdown-item" href="#">Cafe</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white mx-5" href="#" tabindex="-1" aria-disabled="true">About Us</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-white mx-5" href="#" tabindex="-1" aria-disabled="true">Contact Us</a>
        </li>
        <li class="nav-item">
        {
            currentUser ?
            (<Link class="nav-link text-white mx-5" to='/userpage' tabindex="-1" aria-disabled="true"><span class="fas fa-user"></span> Profile</Link>) :
            (<Link class="nav-link text-white mx-5" to='/signup' tabindex="-1" aria-disabled="true"><span class="fas fa-user"></span> Sign Up</Link>)

        }
        </li>
        <li class="nav-item">
        {
          currentUser ?
          (<Button variant="link color-white" onClick={handleLogOut}><span class="fas fa-sign-out-alt"></span>Log Out</Button>) :
          (<Link class="nav-link text-white mx-5" to='/login' tabindex="-1" aria-disabled="true"><span class="fas fa-sign-in-alt"></span>Log In</Link>)

        }
          </li>
        </ul>
      </div>
    </div>
  </nav>
</AuthProvider>
  );
}

export default Header;
