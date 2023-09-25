import React from 'react'
import profielpic from '../profielpic.png'
export default function User({user,selectUser}) {
  return (
    <div className='user-wrapper' onClick={()=>selectUser(user)}>
    <div className='user-info'>
        <div className='user-detail'>
        <img  className="avatar" src={user.avatar || profielpic} alt="avatar"></img>
        <h4>{user.name}</h4>
        </div>
        <div className={`user-status ${user.isOnline ? 'online' : 'offline'}`}></div>
    </div>

   </div>
  )
}
