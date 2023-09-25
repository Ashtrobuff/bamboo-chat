import React from 'react'
import{Link} from 'react-router-dom';
import '../App.css'
import { auth, firestore } from '../firebase';
import { signOut } from 'firebase/auth';
import { Firestore } from '../firebase';
import { doc, setDoc,updateDoc } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useContext } from 'react';
import{useNavigate} from  'react-router-dom'
const Navbar = () => {
    const navigate=useNavigate();
    const{User}=useAuth();
    const handleSignout=async()=>{
await signOut(auth);
        if(User){
  await updateDoc(doc(firestore,'users',User.uid),{
    isOnline:false,
  });

    }
    navigate("Login/");
}
  return (
    <>
      <nav className="nav">
        <h3>
       <Link to="/">Messenger</Link>
        </h3>
        <div>
        {User ? (
        <> 
            <Link to="/profile">Profile</Link>
            <button className='btn' onClick={handleSignout}>Logout</button>
        </>):(
            <>
            <Link to="/register">Register</Link>
            <Link to="/Login">Login</Link>
            </>)
        }
        
        </div>
      </nav>
    </>
  )
}

export default Navbar
