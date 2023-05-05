import { createContext, useState } from "react";

export const BlockedContactsContext = createContext({
    blockedContacts: [],
    set: (blockedContacts) => { },
    clear: () => { }
});

export default function BlockedContactsContextProvider({ children }) {
    const [blockedContacts, setBlockedContacts] = useState([]);

    function set(contacts) {
        setBlockedContacts(contacts);
    }

    function clear() {
        setBlockedContacts([]);
    }

    const value = {
        blockedContacts: blockedContacts,
        set: set,
        clear: clear
    }

    return <BlockedContactsContext.Provider value={value}>{children}</BlockedContactsContext.Provider>
}