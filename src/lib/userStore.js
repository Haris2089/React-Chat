import { doc, getDoc } from 'firebase/firestore';
import {create} from 'zustand'
import { db } from './firebase';

export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    message: '',

    fetchUserInfo: async (uid) =>{
        if(!uid){
            return set({currentUser:null, isLoading: false})
        } 

        try {
        
         const docRef = doc(db, 'user', uid)
         const docSnap = await getDoc(docRef)

         if(docSnap.exists()){
            set({currentUser:docSnap.data(), isLoading: false, message:'User accepted'})
         } else{
            set({currentUser:null, isLoading: false, message:'User not accepted'})
         }


        } catch (error) {
            console.log(error.message);
            return set({currentUser:null, isLoading: false})
        }
    }
})) 