import React, {useContext, useState, useEffect} from "react";
import {auth} from "../firebase";

const AuthContext = React.createContext()

export function useAuth(){
  return useContext(AuthContext)
}

export function AuthProvider({children}) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState()
  const [employee, setEmployee] = useState()



function signup(email, password){
  return auth.createUserWithEmailAndPassword(email, password)
}

function login(email, password){
  return auth.signInWithEmailAndPassword(email, password)
}

function logout(){
   return auth.signOut()
}

function resetPassword(email){
  return auth.sendPasswordResetEmail(email)
}

function updatePassword(password){
  return currentUser.updatePassword(password)
}

useEffect(() =>{
  const unsubscribe = auth.onAuthStateChanged(user => {

    if(user){
      setCurrentUser(user)
      user.getIdTokenResult()
          .then(idTokenResult => {
              setEmployee(idTokenResult.claims.employee)
              setAdmin(idTokenResult.claims.admin)
      })
    }
    else{
      setCurrentUser(null);
    }
    setLoading(false)
  })
  return [unsubscribe, admin, employee]
},[admin, employee])


  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    admin,
    employee
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
