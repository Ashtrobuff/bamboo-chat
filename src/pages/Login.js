import React ,{useState}from 'react'
import{createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
import { firestore} from '../firebase'
import{doc,updateDoc} from 'firebase/firestore';
import '../App.css'
import { Auth } from 'firebase/auth'
import { auth } from '../firebase'
import {useNavigate} from 'react-router-dom';
const Login = () => {
    const [data,setData]=useState({
        email:"",
        password:"",
        error:null,
        loading:false,
    });
    const navigate=useNavigate();
    const{name,email,password,error,loading}=data;
    const handelChange=e=>{
        setData({...data,[e.target.name]: e.target.value})
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setData({...data,error:null,loading:true})
        console.log(data);
        if(!password||!email)
        {
            setData({...data,error:"All fields are required"})
        }
        try{
            const result=await signInWithEmailAndPassword(auth,email,password);
            await  updateDoc(doc(firestore,'users',result.user.uid),{isOnline:true});
            setData({name:'',email:'',password:'',error:null,loading:false});
            navigate("/");
        } catch(err){
                    setData({...data,error:err.message,loading:false});
        }
    }
  return (
    <section className='section'>
    <h3>Log into your account</h3>
    <form className='form' onSubmit={handleSubmit}>
      
        <div className='input-container'>
            <label htmlFor='email'>Email</label>
            <input type="text" name="email" value={email} onChange={handelChange}/>
            
        </div>
        <div className='input-container'>
            <label htmlFor='password'>Password</label>
            <input type="password" name="password" value={password} onChange={handelChange}/>
            
        </div>
        {error?<p className='error'>{error}</p>:null}
        <div className='btn-container'>
            <button className='btn'disabled={loading}>{loading?'logging in':'Login'}</button>
        </div>
    </form>
      
    </section>
  )
}

export default Login
