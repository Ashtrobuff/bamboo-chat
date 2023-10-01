import React from 'react'
import {useEffect,useState} from 'react'
import profielpic from '../profielpic.png'
import { onSnapshot ,setDoc,doc} from 'firebase/firestore';
import {firestore} from'../firebase'
export default function User({user,selectUser,user1,chat }) {
  const user2=user?.uid;
  const [data,setdata]=useState('');
  useEffect(()=>{
    const id=user1>user2 ? `${user1+user2}`:`${user2+user1}`;
    let unsub=onSnapshot(doc(firestore,'lastMsgs',id),(doc)=>{
      setdata(doc.data());
    });

    return()=>unsub();
  },[])
  return (
    <div className='user-wrapper' onClick={()=>selectUser(user)}>
    <div className='user-info'>
        <div className='user-detail'>
        <img  className="avatar" src={user.avatar || profielpic} alt="avatar"></img>
        <h4>{user.name}</h4>
        {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
        </div>
       <div className='lastmsg'>
       {data && (
          <p >
            {data.text}
          </p>
        )}
       </div>
        {user.isOnline ? <div className='user-status online'>Online</div> : <div className='user-status offline'>Offline</div>}

       {/* <div className={`user-status ${user.isOnline ? 'online' : 'offline'}`}></div>*/}
    </div>

   </div>
  )
}
