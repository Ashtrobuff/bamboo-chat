import React, { useContext, useState, useEffect } from "react"
import { auth,firestore } from "../firebase"
import Loading from "../components/Loading"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [User, setUser] = useState(null)
  const [loading, setLoading] = useState(true)  

 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, []);
  if(loading){
    return <Loading/>
  }



  return (
    <AuthContext.Provider value={{User}}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
