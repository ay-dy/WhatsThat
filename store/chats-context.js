import { createContext, useState } from "react";

export const ChatsContext = createContext({
    chats: [],
    set: (chats) => { },
    clear: () => { }
});

export default function ChatsContextProvider({ children }) {
    const [chats, setChats] = useState([]);

    function set(chats) {
        setChats(chats);
    }

    function clear() {
        setChats([]);
    }

    const value = {
        chats: chats,
        set: set,
        clear: clear
    }

    return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>
}