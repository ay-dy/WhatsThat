import { createContext, useState } from "react";

export const DraftsContext = createContext({
    drafts: [],
    set: (drafts) => { },
    clear: () => { }
});

export default function DraftsContextProvider({ children }) {
    const [drafts, setDrafts] = useState([]);

    function set(drafts) {
        setDrafts(drafts);
    }

    function clear() {
        setDrafts(null);
    }

    const value = {
        drafts: drafts,
        set: set,
        clear: clear
    }

    return <DraftsContext.Provider value={value}>{children}</DraftsContext.Provider>
}