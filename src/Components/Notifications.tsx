import {useNotification} from "../routes/root";

export default function Notifications(){

    const {notifications, clearNotification} = useNotification();

    const closeNotification = () => {
        clearNotification();
    }

    return (
        <>
            <div className="fixed z-50 w-full">
                <div className="flex justify-center mt-3 px-3">
                    {notifications.map((notification, index) => {
                        return <div role="alert" className={`alert ${notification.success ? "alert-success" : "alert-error"}`} key={index} onClick={closeNotification}>
                            <span>{notification.message}</span>
                        </div>;
                    })}
                </div>
            </div>
        </>
    );
}