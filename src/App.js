import { useEffect } from 'react';
import './App.css';
import Chat from './components/chat/Chat';
import Detail from './components/detail/Detail';
import List from './components/list/List';
import Login from './components/login/login';
import Notification from './components/notification/notification';
import { onAuthStateChanged } from 'firebase/auth';
import { useUserStore } from './lib/userStore';
import { auth } from './lib/firebase';
import { useChatStore } from './lib/chatStore';

function App() {

  const {currentUser, isLoading, fetchUserInfo, message} = useUserStore()
  const {chatId} = useChatStore()

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) =>{
      if (user) {
        fetchUserInfo(user.uid);
        
      } else {
        fetchUserInfo(null);
      }
    });

    return () => {
      unSub()
    };
  }, [fetchUserInfo]);

  console.log(currentUser);

  if(isLoading) return <div className='loading'>Loading...</div>

  return(
    <div className='container'>
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (<Login />)}
      <Notification />
    </div>
  )
}
export default App;
