import { useUserStore } from '../../../lib/userStore'
import './userInfo.css'

export default function UserInfo(){

    const {currentUser} = useUserStore()


    return(
        <div className='userInfo'>

            <div className='user'>
                <img src={currentUser.avatar || 'imgs/avatar.png'} />
                <h2>{currentUser.username}</h2>
            </div> 

            <div className='icons'>
                <img src='/imgs/more.png' />
                <img src='/imgs/edit.png' />
                <img src='/imgs/video.png' />
            </div>

        </div>
    )
}