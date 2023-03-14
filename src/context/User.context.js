import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
}

export const UserProvider = ({children}) => {
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        const q = collection(db, "users");
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userArray = [];
            snapshot.forEach((doc) => {
              userArray.push(doc.data());
            });
            console.log('user array:', userArray);
            setUserList(userArray);
          });
          return unsubscribe;
    }, [])
    const user = {
        userList
    }
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}