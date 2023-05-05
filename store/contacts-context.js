import { createContext, useState } from "react";

export const ContactsContext = createContext({
    contacts: [],
    set: (contacts) => { },
    clear: () => { }
});

export default function ContactsContextProvider({ children }) {
    const [contacts, setContacts] = useState([]);

    function set(contacts) {
        setContacts(contacts);
    }

    function clear() {
        setContacts([]);
    }

    const value = {
        contacts: contacts,
        set: set,
        clear: clear
    }

    return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>
}