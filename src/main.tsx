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
import TicketsView from "./routes/tickets/view";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <Navigate to={"/app"} replace={true} />
            },
            {
                path: "/app",
                element: <Home />,
                loader: homeLoader,
            },
            {
                path: "/app/tickets",
                element: <TicketsView />,
            },
            {
                path: "/app/event/:eventId",
                element: <EventView />,
                loader: eventLoader,
            },
            {
                path: "/app/event/create",
                element: <EventCreate />
            },
            {
                path: "/app/profile/waiting",
                element: <ProfileWaiting />,
            },
            {
                path: "/app/profile/:address",
                element: <ProfileView />,
                loader: profileLoader,
            },
        ],
    },
]);

WebApp.ready()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <TonConnectUIProvider manifestUrl="https://bafkreif7vyi7y6kevlgjq6g6khpvs3xbkvjhz2vpajeide2a64gdg2uadq.ipfs.nftstorage.link/">
          <RouterProvider router={router} />
      </TonConnectUIProvider>
  </React.StrictMode>,
)
