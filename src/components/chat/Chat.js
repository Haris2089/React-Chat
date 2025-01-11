import { arrayUnion, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import './chat.css';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';

export default function Chat() {
    const [open, setOpen] = useState(false);
    const [chat, setChat] = useState();
    const [text, setText] = useState('');

    const [img, setImg] = useState({    
        file: null,
        url: ''
    })

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isRecieverBlocked} = useChatStore();

    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
            setChat(res.data());
        });

        return () => {
            unSub();
        };
    }, [chatId]);

    function handleEmoji(event) {
        setText((prev) => prev + event.emoji);
        setOpen(false);
    }

    function handleImg(event){
        if(event.target.files[0]){
            setImg({
                file:event.target.files[0],
                url: URL.createObjectURL(event.target.files[0])
            })
        } 
    }

    async function handleSend() {
        if (text === '') return;

        let imgUrl = null

        try {

            if (img.file) {
                imgUrl = await upload(img.file)
            }

            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && {img: imgUrl})
                }),
            });

            const userIds = [currentUser.id, user.id]

            userIds.forEach(async (id) =>{

                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    );

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true: false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            })
            setText(''); 
        } catch (error) {
            console.log(`Send error: ${error.message}`);
        }

        setImg({
            file: null,
            url: ''
        })

        setText('')
    }

    return (
        <div className='chat'>
            <div className='top'>
                <div className='user'>
                    <img src={user?.avatar || 'imgs/avatar.png'} alt='User Avatar' />
                    <div className='texts'>
                        <span>{user.username}</span>
                        <p>Lorem Ipsum, blah bla bla bla bla bla</p>
                    </div>
                </div>
                <div className='icon'>
                    <img src='imgs/phone.png' alt='Phone Icon' />
                    <img src='imgs/video.png' alt='Video Icon' />
                    <img src='imgs/info.png' alt='Info Icon' />
                </div>
            </div>

            <div className='center'>
                {chat?.messages?.map((message, index) => (
                    <div className={message.senderId === currentUser.id ? 'message own' : 'message'} key={index}>
                        <div className='text'>
                            {message.img && <img src={message.img} alt='Message Attachment' />}
                            <p>{message.text || 'No message'}</p>
                            {/* <span>{message.createdAt}</span> */}
                        </div>
                    </div>
                ))}

                {img.url && <div className='message own'>
                    <div className='text'>
                        <img src={img.url} />
                    </div>
                </div>}

                <div ref={endRef}></div>
            </div>

            <div className='bottom'>
                <div className='icons'>

                    <label htmlFor='file'>
                        <img src='imgs/img.png' alt='Image Icon' />
                    </label>
                    <input type='file' id='file' style={{display: 'none'}} onChange={handleImg}/>

                    <img src='imgs/camera.png' alt='Camera Icon' />
                    <img src='imgs/mic.png' alt='Mic Icon' />
                </div>

                <input
                    type='text'
                    placeholder={isRecieverBlocked ? 'User Is Blocked' : isCurrentUserBlocked? 'You are Blocked' : 'Type a message...'}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled = {isCurrentUserBlocked || isRecieverBlocked}
                />

                <div className='emoji'>
                    <img src='/imgs/emoji.png' alt='Emoji Icon' onClick={() => setOpen((prevOpen) => !prevOpen)} />
                    {open && (
                        <div className='picker'>
                            {/* <EmojiPicker open={open} onEmojiClick={handleEmoji} /> */}
                        </div>
                    )}
                </div>
                
                <button className='sendButton' onClick={handleSend} disabled = {isCurrentUserBlocked || isRecieverBlocked}>Send</button>
            </div>
        </div>
    );
}
