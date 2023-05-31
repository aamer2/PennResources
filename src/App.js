import './App.css';
import "rsuite/dist/rsuite.min.css";
import { Navbar, Nav, Button} from 'rsuite';
import { useState } from 'react';
import { Resources } from './pages/Resources';
import { Contribute } from './pages/Contribute';
import { MyContributions } from './pages/MyContributions';
import { Contact } from './pages/Contact';
import { signInWithPopup, signOut} from "firebase/auth"
import { auth, googleProvider} from "./config/firebase"
import NavItem from 'rsuite/esm/Nav/NavItem';

import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';




function App() {

  const [collectionData, setCollectionData] = useState([]);
  const resourceCollectionRef = collection(db, 'resources');



  useEffect(()=> {
    const GetResources = async () => {

      try {
        const data =  await getDocs(resourceCollectionRef);
        const cleanedResources = data.docs.map((doc) => ({...doc.data(), id: doc.id,}));
        console.log(cleanedResources);
      } catch (err) {
        console.error(err);
      }

    };

    GetResources();

}, []);


  
  const [page, setPage] = useState("Resources");
  const [loggedIn, setLoggedIn] = useState(false);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth,googleProvider);
      setLoggedIn(true);
    } catch (err){
      console.log(err);
    }
  }

  const signOut = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
    } catch (err){
      console.log(err);
    }
  }

  return (
    <>

    
    <Navbar>
      <Navbar.Brand href="#"><img id="logo" src="logo.png" alt="logo"/></Navbar.Brand>
      <Nav>
        <Nav.Item onClick={() => setPage("Resources")}>Resources</Nav.Item>
        <Nav.Item onClick={() => setPage("Contact")}>Contact</Nav.Item>
      </Nav>
      <Nav pullRight>
        {loggedIn ?
        <Nav.Menu title={auth?.currentUser?.displayName}>
          <Nav.Item onClick={() => setPage("My-Contributions")}>My Contributions</Nav.Item>
          <Nav.Item onClick={signOut}>Logout</Nav.Item>
        </Nav.Menu> :
        <Nav.Item onClick={signInWithGoogle}>Login</Nav.Item>
        }
      </Nav>
    </Navbar>

    {page === "Resources" ? <Resources/>: <div></div>}
    {page === "My-Contributions" ? <MyContributions/>: <div></div>}
    {page === "Contact" ? <Contact/> : <div></div>}


    </>
    
  );
}

export default App;
