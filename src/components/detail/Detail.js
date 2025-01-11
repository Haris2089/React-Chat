import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore';
import './detail.css'

export default function Detail(){

    const {chatId, user, isCurrentUserBlocked, isRecieverBlocked, changeBlock} = useChatStore()

    const {currentUser} = useUserStore()

    async function handleBlock(){
        if(!user) return

        const userDocRef = doc(db, 'user', currentUser.id)

        try {
            await updateDoc(userDocRef, {
                blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
            })

            changeBlock()
        } catch (error) {
            console.log(error);
        }
    }


    return(
        <div className='detail'>
            <div className='userDetails'>
                <img src={user?.avatar || 'imgs/avatar.png'} />
                <h2>{user?.username}</h2>
                <p>Lorem deier ierief eifeireief ef</p>
            </div>

            <div className='information'>
                <div className='options'>
                    <div className='title'>
                        <span>Chat Settings</span>
                        <img src='/imgs/arrowUp.png' />
                    </div>
                </div>
                <div className='options'>
                    <div className='title'>
                        <span>Privacy & Help</span>
                        <img src='/imgs/arrowUp.png' />
                    </div>
                </div>
                <div className='options'>
                    <div className='title'>
                        <span>Shared Photos</span>
                        <img src='/imgs/arrowUp.png' />
                    </div>
                    <div className='photos'>
                        <div className='photoItem'>
                            <div className='photoDetail'>
                                <img src='https://c8.alamy.com/comp/MR0G79/random-pictures-MR0G79.jpg' />
                                <span>2024 Picture</span>
                            </div>
                        <img src="imgs/download.png" className='downloadIcon'/>
                        </div>
                    </div>
                </div>
                <div className='options'>
                    <div className='title'>
                        <span>Shared Files</span>
                        <img src='/imgs/arrowDown.png' />
                    </div>
                </div>
                <div className='buttons'>
                    <button className='blockButton' onClick={handleBlock}>{
                    
                    isCurrentUserBlocked ? 'You are blocked' : isRecieverBlocked ? 'User Blocked' : 'Block User'
                    
                    }</button>
                    <button className='blockButton logOutButton' onClick={() => auth.signOut()}>Log Out</button>
                </div>
            </div>
        </div>
    )
}