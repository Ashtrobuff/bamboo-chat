import React ,{useState}from 'react'
import{createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
import { firestore} from '../firebase'
import{doc,updateDoc} from 'firebase/firestore';
import '../App.css'
import { Auth } from 'firebase/auth'
import { auth } from '../firebase'
import {useNavigate} from 'react-router-dom';
import giffer from '../gifer.gif'
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
    < div className='loginbox'>
<img src={giffer} className='giffer'></img>

    <section className='section'>
    <h3>Log into your account</h3>
    <form className='form' onSubmit={handleSubmit}>
      
        <div className='input-container'>
            
            <input  placeholder="email" type="text" id='email' name="email" value={email} onChange={handelChange}/>
            
        </div>
        <div className='input-container'>
          
            <input type="password" placeholder="password"  id='password' name="password" value={password} onChange={handelChange}/>
            
        </div>
        {error?<p className='error'>{error}</p>:null}
        <div className='btn-container'>
            <button  id="loggerbtn"className='btn'disabled={loading}>{loading?'logging in':'Login'}</button>
        </div>
    </form>
      
    </section>
    <div className='namer'>
     Sheesh Chat
     <h4 id="tagline">get in touch instantly.</h4>
</div>
    </div>
  )
}

export default Login
