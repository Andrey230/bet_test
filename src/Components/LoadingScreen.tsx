import {useLoader} from "../routes/root";

export default function LoadingScreen()
{
    const {loading} = useLoader();

    if(!loading){
        return;
    }

    return (
        <div className="w-screen h-screen bg-base-300 fixed z-50 overflow-hidden overscroll-auto flex justify-center items-center">
            <span className="loading loading-spinner loading-lg"></span>
        </div>
    );
}