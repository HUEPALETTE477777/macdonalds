import React, { createContext, useEffect, useState } from 'react';
import { 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword, 
    getAuth, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    updateProfile 
} from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                setLoading(false);
                return result;
            })
            .catch(error => {
                console.error("Error creating user:", error.message);
                setLoading(false);
            });
    }

    const signUpWithGmail = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .then((result) => {
                setLoading(false);
                return result;
            })
            .catch(error => {
                console.error("Error signing up with Gmail:", error.message);
                setLoading(false);
            });
    }

    const updateUserProfile = ({ name, photoURL }) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photoURL
        })
        .then(() => {
            setUser({...auth.currentUser,displayName: name,photoURL: photoURL});
        })
        .catch(error => {
            console.error("Error updating profile:", error.message);
        });
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
            .catch(error => {
                console.error("Error logging in:", error.message);
            });
    }

    const logOut = () => {
        return signOut(auth).catch(error => {
            console.error("Error logging out:", error.message);
        });
    }

    useEffect( () =>{
        const unsubscribe = onAuthStateChanged(auth, currentUser =>{
            setUser(currentUser);
            setLoading(false);
        });

        return () =>{
            return unsubscribe();
        }
    }, [])

    const authInfo = { user, createUser, signUpWithGmail, login, logOut, updateUserProfile, loading };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
