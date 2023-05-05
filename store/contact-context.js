import { createContext, useState } from "react";

export const ContactContext = createContext({
    id: null,
    set: (id) => { },
    clear: () => { }
});

export default function ContactContextProvider({ children }) {
    const [contactId, setContactId] = useState();

    function set(id) {
        setContactId(id);
    }

    function clear(id) {
        setContactId(null);
    }

    const value = {
        id: contactId,
        set: set,
        clear: clear
    }

    return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
}