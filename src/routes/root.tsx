import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import {createContext, useContext, useState} from 'react';
import Notifications from "../Components/Notifications";

const Context = createContext({});

export default function Root() {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message) => {
        setNotifications([message]);

        setTimeout(() => {
            setNotifications([]);
        }, 5000);
    };

    const clearNotification = () => {
        setNotifications([]);
    }

    const contextValues = {
        notifications,
        addNotification,
        clearNotification
    };

    return (
        <>
            <Context.Provider value={contextValues}>
                <Notifications />
                <Header />
                <div className="bg-base-300 pt-6 pb-8">
                    <div className="flex justify-center">
                        <div className="w-4/5">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </Context.Provider>
        </>
    )
}

export const useNotification = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};