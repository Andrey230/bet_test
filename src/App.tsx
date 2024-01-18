import './App.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import Header from "./Components/Header"
import EventsContainer from "./Components/EventsContainer"


function App() {
    return (
    <>
        <Header />
        <section className="bg-base-300">
            <EventsContainer />
        </section>
    </>
  )
}

export default App
