import React, { useEffect,useState } from 'react'
import{firestore,auth,storage,onDisconnect} from '../firebase'
import { collection,query,where,onSnapshot, addDoc,setDoc,doc, CollectionReference, QuerySnapshot, Timestamp, orderBy,updateDoc } from 'firebase/firestore';
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
  useEffect(() => {
    // Update user's status to "online" when they interact with your app.
    const userDocRef = doc(firestore, 'users', user1);
    updateDoc(userDocRef, { isOnline: true });

    // Set up a "beforeunload" event listener to update the user's status to "offline" when they close the tab or navigate away.
    const beforeUnloadHandler = () => {
      updateDoc(userDocRef, { isOnline: false });
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    const usersRef = collection(firestore, 'users');
    // ...

    return () => {
      // Cleanup function: Update the user's status to "offline" when they log out or navigate away.
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      updateDoc(userDocRef, { isOnline: false });
      if (unsub) {
        unsub();
      }
    };
  }, [user1]);
  useEffect(() => {
    // Set up a "beforeunload" event listener to sign the user out when they close the tab or navigate away.
    const beforeUnloadHandler = () => {
      // Check if there's a user signed in before signing out.
      if (auth.currentUser) {
        auth.signOut();
      }
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      // Remove the event listener when the component is unmounted.
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []); 
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
    });
    await setDoc(doc(firestore, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });


    setText("");
    setimg("")
  }


  
  return (
   <div className='home-container'>
    
    <div className='user-container'>
      {users.map((user)=><User key={user.uid} user={user} selectUser={selectUser} user1={user1} chat={chat}/>)}
    </div>
    <div className='messages-container'>
      {chat? <><div className='messages-user'>
        <h3>{chat.name}</h3>
      </div> <div className='messages'>
        { msgs.length ? msgs.map((msg,i)=><Message key={i} msg={msg} user1={user1}/>):null}
        </div><MessageForm handleSubmit={handleSubmit} text={text} setText={setText} setimg={setimg}></MessageForm></>:<div id="userprompt">select user to start conversation</div>}
    
    </div>
   </div>
  )
}

export default Home
