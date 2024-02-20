import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import {createContext, useContext, useEffect, useState} from 'react';
import Notifications from "../Components/Notifications";
import LoadingScreen from "../Components/LoadingScreen";
import {useCookies} from "react-cookie";
import {useTranslation} from "react-i18next";
import WebApp from "@twa-dev/sdk";

const NotificationContext = createContext({});
const LoaderContext = createContext({});
const RedirectContext = createContext({});

export default function Root() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startRedirect, setStartRedirect] = useState(false);
    const [t, i18n] = useTranslation();

    const [cookies] = useCookies();

    useEffect(() => {
        if(cookies.language){
            i18n.changeLanguage(cookies.language);
        }
        WebApp.expand();
        WebApp.enableClosingConfirmation();
        WebApp.setHeaderColor('#FFFFFF');
        WebApp.ready();
    }, []);

    console.log(cookies.language);

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

    const contextLoaderValues = {
        loading,
        setLoading
    };

    const contextRedirectValues = {
        startRedirect,
        setStartRedirect
    };

    return (
        <>
            <LoaderContext.Provider value={contextLoaderValues}>
                <NotificationContext.Provider value={contextValues}>
                    <RedirectContext.Provider value={contextRedirectValues}>
                        <Notifications />
                        <LoadingScreen />
                        <Header />
                        <div className="bg-base-300 pt-6 pb-8 min-h-screen">
                            <div className="flex justify-center">
                                <div className="w-4/5 max-w-xs">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </RedirectContext.Provider>
                </NotificationContext.Provider>
            </LoaderContext.Provider>
        </>
    )
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useNotification must be used within a LoaderContext');
    }
    return context;
};

export const useStartRedirect = () => {
    const context = useContext(RedirectContext);
    if (!context) {
        throw new Error('useNotification must be used within a LoaderContext');
    }
    return context;
};