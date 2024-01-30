import {TonConnectButton, useTonConnectUI} from "@tonconnect/ui-react"
import { NavLink } from "react-router-dom"
import {useTonConnect} from "../hooks/useTonConnect"

export default function Header() {

    const {connected, wallet} = useTonConnect();
    const [tonConnectUI] = useTonConnectUI();

    const disconnectWallet = async () => {
        await tonConnectUI.disconnect()
    }

    return (
        <>
            <div className="navbar bg-base-100 relative z-20">
                <div className="flex-1">
                    <NavLink to="/" className="btn btn-ghost text-xl">moc1000</NavLink>
                </div>

                <div className="flex-none">
                    {connected ? (
                        <>
                            <NavLink to="/app/event/create">
                                <div className="btn btn-ghost btn-circle">
                                    <div className="indicator">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" stroke="currentColor" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>
                                    </div>
                                </div>
                            </NavLink>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                    <li>
                                        <a className="justify-between" href={`/app/profile/${wallet?.toString()}`}>
                                            Profile
                                        </a>
                                    </li>
                                    <li><a>Settings</a></li>
                                    <li><a onClick={disconnectWallet}>Logout</a></li>
                                </ul>
                            </div>
                        </>
                    ) : (
                        <TonConnectButton />
                    )}
                </div>
            </div>
        </>
    )
}