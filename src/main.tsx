import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
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
import AboutUs from "./routes/about-us";
import TicketsView from "./routes/tickets/view";
import i18next from "i18next";
import translation_en from './i18n/en/translation.json';
import translation_ru from './i18n/ru/translation.json';
import translation_pl from './i18n/pl/translation.json';
import translation_ua from './i18n/ua/translation.json';
import {I18nextProvider} from "react-i18next";
const miniapp = import.meta.env.VITE_TELEGRAM_MINIAPP;

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
                path: "about-us",
                element: <AboutUs />,
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
            {
                path: "*",
                element: <Navigate to={"/"} replace={true} />
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <I18nextProvider i18n={i18next} >
          <TonConnectUIProvider manifestUrl="https://bafkreicc6s2m6tr3onlvt67dd3pikzi5ppruj2u4u4kyxx2s5lsegfmu7q.ipfs.nftstorage.link/" actionsConfiguration={{
              twaReturnUrl: miniapp
          }}>
              <RouterProvider router={router} />
          </TonConnectUIProvider>
      </I18nextProvider>
  </React.StrictMode>,
)
