import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import WebApp from '@twa-dev/sdk'
import {
    createBrowserRouter,
    RouterProvider,
    Navigate
} from "react-router-dom"
import {TonConnectUIProvider} from "@tonconnect/ui-react";
import Root from "./routes/root"
import Home, {loader as homeLoader} from "./routes/home"
import EventView, {loader as eventLoader} from "./routes/event/view";
import ProfileView, {loader as profileLoader} from "./routes/profile/view";
import EventCreate from "./routes/event/create";
import ProfileWaiting from "./routes/profile/waiting";
import ProfileHistory from "./routes/profile/history";
import TicketsView from "./routes/tickets/view";
import i18next from "i18next";
import translation_en from './i18n/en/translation.json';
import translation_ru from './i18n/ru/translation.json';
import translation_pl from './i18n/pl/translation.json';
import translation_ua from './i18n/ua/translation.json';
import {I18nextProvider} from "react-i18next";

i18next.init({
    interpolation: {escapeValue: false},
    lng: "en",
    resources: {
        en: {
            global: translation_en
        },
        ru: {
            global: translation_ru
        },
        pl: {
            global: translation_pl
        },
        ua: {
            global: translation_ua
        }
    }
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            // {
            //     path: "/",
            //     element: <Navigate to={"/app"} replace={true} />
            // },
            {
                path: "/",
                element: <Home />,
                loader: homeLoader,
            },
            {
                path: "tickets",
                element: <TicketsView />,
            },
            {
                path: "event/:eventId",
                element: <EventView />,
                loader: eventLoader,
            },
            {
                path: "event/create",
                element: <EventCreate />
            },
            {
                path: "profile/waiting",
                element: <ProfileWaiting />,
            },
            {
                path: "profile/history",
                element: <ProfileHistory />,
            },
            {
                path: "profile/:address",
                element: <ProfileView />,
                loader: profileLoader,
            },
        ],
    },
]);

WebApp.ready()
WebApp.expand();
WebApp.enableClosingConfirmation();
WebApp.setHeaderColor('#FFFFFF');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <I18nextProvider i18n={i18next} >
          <TonConnectUIProvider manifestUrl="https://bafkreig5ot5zrnghimvmkdolg7s4lxivcq6gkrdi7lxwtzg3egixy7jxrq.ipfs.nftstorage.link/">
              <RouterProvider router={router} />
          </TonConnectUIProvider>
      </I18nextProvider>
  </React.StrictMode>,
)
