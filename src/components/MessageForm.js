import React from 'react'
import Attachments from '../pages/components/svg/Attachments'
export default function MessageForm({handleSubmit,text,setText,setimg}) {
  return (
    <form className='message-form' onSubmit={handleSubmit}>
        <label htmlFor="img"> <Attachments/></label>
        <input type="file" id="img" accept='image' style={{display:'none'}} onChange={(e)=>setimg(e.target.files[0])}/>
        <div>
            <input type='text' placeholder='enter mesage' value={text} onChange={e=>setText(e.target.value)}/>
        </div>
        <div>
            <button className='btn'>Send</button>
        </div>
    </form>
  )
}
