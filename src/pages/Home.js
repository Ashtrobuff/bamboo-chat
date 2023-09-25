import React, { useEffect,useState } from 'react'
import{firestore,auth,storage} from '../firebase'
import { collection,query,where,onSnapshot, addDoc, CollectionReference, QuerySnapshot, Timestamp, orderBy } from 'firebase/firestore';
import { ref,getDownloadURL,uploadBytes,deleteObject} from 'firebase/storage'
import User from '../components/User';
import MessageForm from '../components/MessageForm';
import Message from '../components/Message';
const Home = () => {
  const[users,setUsers]=useState([]);
  const[chat,setChat]=useState("");
  const[text,setText]=useState("");
  const [img,setimg]=useState("");
  const [msgs, setmsgs]=useState([]);
  const [unsub, setUnsub] = useState(null)
  const user1=auth.currentUser.uid;
  useEffect(()=>{
    
    const usersRef= collection(firestore,'users')
    //create a query obejct
    const q= query(usersRef,where('uid','not-in',[user1])); 
    //exceute the query
    const unsub=onSnapshot(q,(querySnapshot)=>{
      let users=[] 
      querySnapshot.forEach((doc)=>{
        users.push(doc.data());
      })
      setUsers(users);
    }) ;
    return ()=> unsub();
    
  },[]);
  const selectUser=(user)=>{
    setChat(user);
    setmsgs([]);
    if(unsub)
    {
      unsub();
    }
     const user2= user.uid;
     const id=user1>user2 ? `${user1+user2}`:`${user2+user1}`;
     const msgsRef=collection(firestore,'messages',id,'chat');
     const q= query(msgsRef,orderBy('createdAt','asc'));
     if(unsub)unsub();
    const newunsub=onSnapshot(q,querySnapshot=>{
      let msgs=[]
      querySnapshot.forEach(doc=>{
        msgs.push(doc.data());
      })
      setmsgs(msgs)
    });
    setUnsub(()=>newunsub);
  }
console.log(msgs)
  const handleSubmit=async e=>{ 
    e.preventDefault();
    const user2=chat.uid;
    const id=user1>user2 ? `${user1+user2}`:`${user2+user1}`;
    let url;
    if(img){
      const imageRef=ref(storage,`images/${new Date().getTime()}-${img.name}`)
      const snap=await uploadBytes(imageRef,img);
      const dlUrl=await getDownloadURL(ref(storage,snap.ref.fullPath))
      url=dlUrl;
    }
    await addDoc(collection(firestore,'messages',id,'chat'),{
      text,
      from:user1,
      to:user2,
      createdAt:Timestamp.fromDate(new Date()),
      media: url|| " ",
    })
    setText("");
  }


  
  return (
   <div className='home-container'>
    
    <div className='user-container'>
      {users.map((user)=><User key={user.uid} user={user} selectUser={selectUser}/>)}
    </div>
    <div className='messages-container'>
      {chat? <><div className='messages-user'>
        <h3>{chat.name}</h3>
      </div> <div className='messages'>
        { msgs.length ? msgs.map((msg,i)=><Message key={i} msg={msg}/>):null}
        </div><MessageForm handleSubmit={handleSubmit} text={text} setText={setText} setimg={setimg}></MessageForm></>:<h3>select user to start conversation</h3>}

    </div>
   </div>
  )
}

export default Home
