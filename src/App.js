
import './App.css';
import React, { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {useAuthState} from 'react-firebase-hooks/auth'
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCo-IWzLl2n30F1_iIY0uhvbj3K6DvOeUE",
  authDomain: "prochat-1ec42.firebaseapp.com",
  projectId: "prochat-1ec42",
  databaseURL:"https:/prochat-1ec42.firebaseio.com",
  storageBucket: "prochat-1ec42.appspot.com",
  messagingSenderId: "928898256654",
  appId: "1:928898256654:web:541340c18f34bce30e915f",
  measurementId: "G-NMTX91PBKQ",
})

const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {

  const [user] = useAuthState(auth);
   



  return (
    <div className="App">
      <header>
        <h1> This Is A Chat Server</h1>
        <SignOut/>
      </header>
      <section>
      {user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn(){

   const signInWithGoogle = () => {
     const provider = new firebase.auth.GoogleAuthProvider();
     auth.signInWithPopup(provider);
   };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}

function SignOut() {
       return auth.currentUser && (
           <button className="sign-out" onClick={() => auth.signOut()}>
             Sign Out
           </button>
           )
         
       
}
function ChatRoom() {

  
  const dummy = useRef();
  const messagesRef =firestore.collection("messages")
   const query = messagesRef.orderBy("createdAt").limit(50);

   const [messages] = useCollectionData(query, { idField: "id" });

    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();

      const { uid, photoURL } = auth.currentUser;

      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });

      setFormValue("");
      dummy.current.scrollIntoView({ behavior: "smooth" });
    };
    return (
      <>
        <main>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        </main>
        <form onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />

          <button type="submit" disabled={!formValue}>
            🕊️
          </button>
        </form>
      </>
    );
}

function ChatMessage(props){
  const {text,uid,photoURL} =props.message;
  const messageClass= uid === auth.currentUser.uid ?'sent' :'received';

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img
          src={
            photoURL || "https://pngtree.com/freepng/users-vector_3725294.htmlcle"
          }alt="Not Avaliable"
        />
        <p>{text}</p>
      </div>
    </>
  );
}
export default App;
