import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import './addUser.css'
import { db } from '../../lib/firebase'
import { useState } from 'react'
import { useStore } from 'zustand'
import { useUserStore } from '../../lib/userStore'

export default function AddUser(){
    
    const [user, setUser] = useState(null)

    const {currentUser} = useUserStore();

    async function handleSearch(event){
        event.preventDefault()

        const formData = new FormData(event.target)
        const username = formData.get('username')


        try {

            const userRef = collection(db, 'user')

            const q = query(userRef, where('username', '==', username))

            const querySnapshot = await getDocs(q)

            if(!querySnapshot.empty){
                setUser(querySnapshot.docs[0].data())
            }else{
                setUser(null)
            }

        } catch (error) {
            console.log(`Search error: ${error.message}`);
        }

    }

    async function handleAdd(event){
        const chatRef = collection(db, 'chats')
        const userChatRef = collection(db, 'userchats')
        
        try { 

            const newChatRef = doc(chatRef)
            
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            })

            await updateDoc(doc(userChatRef, user.id),{
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    recieverId: currentUser.id,
                    updatedAt: Date.now(),
                })
            })

            await updateDoc(doc(userChatRef, currentUser.id),{
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    recieverId: user.id,
                    updatedAt: Date.now(),
                })
            })
            
        } catch (error) {
            console.log(error.message);
        }
    }

    return(
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type="text" placeholder='Username' name='username' />
                <button>Search</button>
            </form>

            {user && <div className="userInfo">
                <div className="details">
                    <img src={user.avatar || "imgs/avatar.png"} alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    )
}