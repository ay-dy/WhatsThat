import { createContext, useState } from "react";

export const ChatContext = createContext({
    chat: [],
    set: (chat) => { },
    clear: () => { }
});

export default function ChatContextProvider({ children }) {
    const [chat, setChat] = useState();

    function set(chat) {
        setChat(chat);
    }

    function clear() {
        setChat(null);
    }

    const value = {
        chat: chat,
        set: set,
        clear: clear
    }

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}