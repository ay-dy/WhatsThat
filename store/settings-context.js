import { createContext, useState } from "react";

export const SettingsContext = createContext({
    profile_photo: null,
    info: {
        first_name: null,
        last_name: null,
        email: null,
        password: null
    },
    set: (profile_photo, info) => { },
    clear: () => { }
});

export default function SettingsContextProvider({ children }) {
    const [profilePhoto, setProfilePhoto] = useState();
    const [info, setInfo] = useState();

    function set(profile_photo, info) {
        setProfilePhoto(profile_photo);
        setInfo(info);
    }

    function clear() {
        setProfilePhoto(null);
        setInfo(null);
    }

    const value = {
        profile_photo: profilePhoto,
        info: info,
        set: set,
        clear: clear
    }

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}