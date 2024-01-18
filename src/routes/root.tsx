import Header from "../Components/Header";
import { Outlet } from "react-router-dom"

export default function Root() {
    return (
        <>
            <Header />
            <div className="bg-base-300 pt-6 pb-8">
                <Outlet />
            </div>
        </>
    )
}