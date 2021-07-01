import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from "../../contexts/AuthContext";

export default function Toolbar() {

  const {admin, employee} = useAuth();


  return (
    <div>
    {admin &&
      <div className="tool_bar">
      <ul>
        <li>
            <Link to="/admin">Admin Panel</Link>
        </li>
      </ul>
      </div>
    }
      {employee &&
        <div className="tool_bar">
        <ul>
          <li>
            <Link to="/employee">Employee Panel</Link>
          </li>
        </ul>
      </div>}
    </div>
  )
}
