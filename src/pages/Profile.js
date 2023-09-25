import React,{useState,useEffect} from 'react'
import profielpic from '../profielpic.png'
import Camera from './components/svg/Camera'
import { storage,firestore,auth} from '../firebase'
import { ref,getDownloadURL,uploadBytes,deleteObject} from 'firebase/storage'
import {getDoc,doc, updateDoc, getDocs} from 'firebase/firestore'
import { Delete } from './components/svg/Delete'
import { useNavigate } from 'react-router-dom'
const Profile = () => {
    const navigate=useNavigate();
     const[img,setImg]=useState("");
    const [user,setuser]=useState();
    useEffect(()=>{
        getDoc(doc(firestore,'users',auth.currentUser.uid)).then(docSnap=>{
            if(docSnap.exists){
                setuser(docSnap.data());
            }
        });

if(img){
    const uploadImg=async()=>{
        const imgRef=ref(storage,`avatar/${new Date().getTime()}-${img.name}`);
        try {
        if(user.avatarPath){
            await deleteObject(ref(storage,user.avatarPath))
        }
        const snap= await uploadBytes(imgRef,img);
        console.log(snap.ref.fullPath)
        const url=await getDownloadURL(ref(storage,snap.ref.fullPath));
        console.log(url)
        await updateDoc(doc(firestore,'users',auth.currentUser.uid),{
            avatar: url,
            avatarPath: snap.ref.fullPath,
        });
        console.log(url);
        setImg("");
    }
    catch(err){
        console.log(err.message);
    }
        
    };
    uploadImg();
}
    
    },[img])

    const deleteImage=async()=>{
        try{
        const confirm=window.confirm("delete avatar");
        if(confirm){
            await deleteObject(ref(storage,user.avatarPath));
            await updateDoc(doc(firestore,'users',auth.currentUser.uid),{
                avatar: "",
                avatarPath: ""
            })
            navigate("/")
        }
    }
    catch(err){
        console.log(err.message);
    }
    };
  return (
 <section>
    <div className='profile-container'>
        <div className='img-container'>
            <img  className="pp"src={user?.avatar || profielpic} alt="/"></img>
            <div className='overlay'>
                <div>
                    <label htmlFor='photo'>
                        <Camera></Camera>
                    </label>
                    {user?.avatar ? <Delete deleteImage={deleteImage}/> :null } 
                    <input type='file' accept='image/*' style={{display:"none"}} id='photo' onChange={(e)=>{setImg(e.target.files[0])}}></input>
                </div>
            </div>
        </div>
        <div className='text-container'>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <hr/>
            <small>Joined on: ..{user?.createdAt.toDate().toDateString()}</small>
        </div>
    </div>
 </section>
  )
}

export default Profile
