import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useUserStore } from '../../../lib/userStore'
import AddUser from '../../addUser/AddUser'
import './chatList.css'
import React, { useEffect } from 'react'
import { auth, db } from '../../../lib/firebase'
import { useChatStore } from '../../../lib/chatStore'

export default function ChatList(){
    
    const [addMode, setAddMode] = React.useState(true)
    const [chats, setChats] = React.useState([])
    const [input, setInput] = React.useState('')

    const {currentUser} = useUserStore();

    const {chatId, changeChat} = useChatStore();

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data()?.chats || [];

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, 'user', item.recieverId);
                const userDocSnap = await getDoc(userDocRef);
                const user = userDocSnap.exists() ? userDocSnap.data() : {}; // Default to an empty object if no data is found

                return { ...item, user }; // Ensure `user` is at least an empty object
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        };
    }, [currentUser.id]);

    async function handleSelect(chat){
        
        const userChats = chats.map(item => {
            const {user, ...rest} = item

            return rest;
        })

        const chatIndex = userChats.findIndex(item=>item.chatId === chat.chatId)

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id)

        try {
            await updateDoc(userChatsRef, {
                chats: userChats
            })
            changeChat(chat.chatId, chat.user)
        } catch (error) {
            console.log(error);
        }

    }

    const filteredChats = chats.filter((c)=> c.user.username.toLowerCase().includes(input.toLowerCase()))
    
    return(

        <div className='chatList'>
            <div className='search'>
                <div className='searchBar'>
                    <img src='./imgs/search.png' />
                    <input type='text' placeholder='Search' onChange={(e) => setInput(e.target.value)}/>
                </div>

                <img src={addMode ? 'imgs/plus.png': 'imgs/minus.png'} className='plus' onClick={() => {
                    setAddMode(prevMode => !prevMode)
                }}/>
            </div>

            {filteredChats.map((chat) => (
                <div className='item' key={chat.chatid} onClick={() => handleSelect(chat)} style={{
                    backgroundColor: chat?.isSeen ? 'transparent' : "#5183fe"
                }}>
                    <img src=
                    {chat.user.blocked.includes(currentUser.id) 
                    ? 'imgs/avatar.png'
                    : chat.user?.avatar || 'imgs/avatar.png'} alt="User Avatar" />
                    <div className='texts'>
                        <span>{chat.user?.username || 'Unknown User'}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}

            {!chats && <div className='buttonContainer'>
                <button className='listLogOutButton' onClick={() => auth.signOut()}>Log Out</button>
            </div>}


            
            {!addMode && <AddUser />}

        </div>
    )
}