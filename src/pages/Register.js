import React ,{useState}from 'react'
import{createUserWithEmailAndPassword} from 'firebase/auth'
import { firestore} from '../firebase'
import{doc,setDoc,Timestamp} from 'firebase/firestore';
import '../App.css'
import { Auth } from 'firebase/auth'
import { auth } from '../firebase'
import {useNavigate} from 'react-router-dom';
const Register = () => {
    const [data,setData]=useState({
        name:"",
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
        if(!name||!password||!email)
        {
            setData({...data,error:"All fields are required"})
        }
        try{
            const result=await createUserWithEmailAndPassword(auth,email,password);
            await  setDoc(doc(firestore,'users',result.user.uid),{uid:result.user.uid,name,email,
            createdAt: Timestamp.fromDate(new Date()),
            isOnline:true});
            setData({name:'',email:'',password:'',error:null,loading:false});
            navigate("/");
        } catch(err){
                    setData({...data,error:err.message,loading:false});
        }
    }
  return (
    <section className='section'>
    <h3>Create an account</h3>
    <form className='form' onSubmit={handleSubmit}>
        <div className='input-container'>
            
            <input placeholder='name' type="text" name="name" value={name} onChange={handelChange}/>
        </div>
        <div className='input-container'>
           
            <input placeholder='email' type="text" name="email" value={email} onChange={handelChange}/>
            
        </div>
        <div className='input-container'>
           
            <input placeholder="password"type="password" name="password" value={password} onChange={handelChange}/>
            
        </div>
        {error?<p className='error'>{error}</p>:null}
        <div className='btn-container'>
            <button className='btn'disabled={loading}>{loading ? 'Registering' : 'register'}</button>
        </div>
    </form>
      
    </section>
  )
}

export default Register
