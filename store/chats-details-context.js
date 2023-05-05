import { createContext, useState } from "react";

export const ChatsDetailsContext = createContext({
    chatsDetails: [],
    set: (chatsDetails) => { },
    clear: () => { }
});

export default function ChatsDetailsContextProvider({ children }) {
    const [chatsDetails, setChatsDetails] = useState([]);

    function set(chatsDetails) {
        setChatsDetails(chatsDetails);
    }

    function clear() {
        setChatsDetails([]);
    }

    const value = {
        chatsDetails: chatsDetails,
        set: set,
        clear: clear
    }

    return <ChatsDetailsContext.Provider value={value}>{children}</ChatsDetailsContext.Provider>
}