import Header from "../Components/Header";
import { Outlet } from "react-router-dom";
import {createContext, useContext, useEffect, useState} from 'react';
import Notifications from "../Components/Notifications";
import LoadingScreen from "../Components/LoadingScreen";
import {useCookies} from "react-cookie";
import {useTranslation} from "react-i18next";
import WebApp from "@twa-dev/sdk";
import {getWaitingEvents} from "../api/endpoints";
import {useTonConnect} from "../hooks/useTonConnect";
import { NavLink, useLocation } from "react-router-dom";
import {useTonConnectUI} from "@tonconnect/ui-react";
import { Analytics } from "@vercel/analytics/react"
const chain = import.meta.env.VITE_NETWORK;

const NotificationContext = createContext({});
const LoaderContext = createContext({});
const RedirectContext = createContext({});

const networks = {
    testnet: -3,
    mainnet: -239
};

export default function Root() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startRedirect, setStartRedirect] = useState(false);
    const [waitingEventsCount, setWaitingEventsCount] = useState(0);
    const {wallet, connected, network} = useTonConnect();
    const location = useLocation();
    const [tonConnectUI] = useTonConnectUI();

    useEffect(() => {

        if(network){
            if (chain in networks) {
                const value = networks[chain];
                if(value !== Number(network)){
                    tonConnectUI.disconnect();
                    addNotification({
                        success: false,
                        message: t("notification.network", {chain: chain})
                    });
                }
            } else {
                tonConnectUI.disconnect();
            }
        }

        if (connected) {
            getWaitingEvents(wallet?.toString())
                .then((response) => response.json())
                .then((data) => {
                    setWaitingEventsCount(data.totalEvents ?? 0);
                })
                .catch((error) => console.log(error));
        }

        WebApp.BackButton.isVisible = location.pathname !== '/';

        return () => {
            //setLoading(true);
        };
    }, [connected, location]);

    const [t, i18n] = useTranslation("global");

    const [cookies] = useCookies();

    useEffect(() => {
        if(cookies.language){
            i18n.changeLanguage(cookies.language);
        }
        WebApp.expand();
        WebApp.enableClosingConfirmation();
        WebApp.setHeaderColor('#FFFFFF');
        WebApp.onEvent('backButtonClicked', () => {
            window.location.href = "/";
        });
        WebApp.ready();
    }, []);

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
                        <Analytics/>
                        <Notifications />
                        <LoadingScreen />
                        <Header />
                        <div className="bg-base-300/70 pt-6 pb-8 min-h-screen">
                            <div className="flex justify-center">
                                <div className="w-4/5 max-w-xs">
                                    {connected && waitingEventsCount > 0 ?
                                        <NavLink to="profile/waiting">
                                            <div role="alert" className="alert alert-warning drop-shadow-lg mb-4 rounded-lg">
                                                <div className="text-xs">{t("notification.waiting", {count: waitingEventsCount})}</div>
                                            </div>
                                        </NavLink>
                                        : ""}
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