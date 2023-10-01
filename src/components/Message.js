import { ref } from 'firebase/storage';
import React, { useRef,useEffect } from 'react'
import Moment from 'react-moment'

const Message=({msg,user1})=>{
  const scrollRef=useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
 
  return (
    <div className={`message-wrapper ${msg.from === user1 ? "own": "other"}`} ref={scrollRef}>
        <p> 
            {msg.media? <img src={msg.media}/>:null}
            {msg.text}
        <br/>
        <small>
            <Moment  className='moment'fromNow>{msg.createdAt.toDate()}</Moment>
        </small>
        </p>
    </div>
  )
}

export default Message