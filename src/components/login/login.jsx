import { useState } from 'react'
import './login.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import upload from '../../lib/upload';

export default function Login(){

    const [avatar, setAvatar] = useState({
        file:null,
        url: ''
    })

    const [loading, setLoading] = useState(false)

    function handleAvatar(event){
        if(event.target.files[0]){
            setAvatar({
                file:event.target.files[0],
                url: URL.createObjectURL(event.target.files[0])
            })
        } 
    }

    async function handleLogin(event){
        event.preventDefault()
        setLoading(true)

        const formData = new FormData(event.target)

        const {email, password} = Object.fromEntries(formData)

        try {
            await signInWithEmailAndPassword(auth, email, password)
            console.log(`auth: ${auth}, email: ${email}, password: ${password}`)
            
        } catch (error) {
            console.log(error.message)
            toast.error(`Error: ${error.message}`)
        } finally{
            setLoading(false)
        }
    }

    


    async function handleRegister(event){
        event.preventDefault()

        const formData = new FormData(event.target)

        const {username, email, password} = Object.fromEntries(formData)

        try {

            setLoading(true)

            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgUrl = avatar.file ? await upload(avatar.file) : null;

            await setDoc(doc(db, 'user', res.user.uid),{
                username: username,
                email: email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: []
            })

            await setDoc(doc(db, 'userchats', res.user.uid),{
                chats: []
            })

            toast.success('Account created! You can login now!')
            console.log('Account created! You can login now!')

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally{
            setLoading(false)
        }
    }
    
    return(
        <div className='login'>
            <div className="loginItem">
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder='Email' name='email' />
                    <input type="text" placeholder='Password' name='password' />
                    <button disabled={loading}>{loading ? "Loading" : "Sign in"}</button>
                </form>
            </div>

            <div className="seperator">

            </div>

            <div className="loginItem">
                <h2>Create an account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={
                            avatar.url || 'imgs/avatar.png'
                        } alt="" />
                    Upload Image</label>
                    <input type="file" id='file' style={{display: "none"}} onChange={handleAvatar}/>
                    <input type="text" placeholder='UserName' name='username' />
                    <input type="text" placeholder='Email' name='email' />
                    <input type="text" placeholder='Password' name='password' />
                    <button disabled={loading}>{loading ? "Loading" : "Sign up"}</button>
                </form>
            </div>
        </div>
    )
}