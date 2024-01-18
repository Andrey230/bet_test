import EventCard from "./EventCard";
import Events from "../mock/data.json";

export default function EventsContainer() {

    const events = Events

    return (
        <>
            <div className="flex justify-center">
                <div className="w-4/5">
                    <input type="text" id="find-event-input" placeholder="Find event" className="drop-shadow-lg input w-full max-w-xs mb-5" />
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-semibold">Top events</h1>
                        <div className="dropdown dropdown-bottom dropdown-end">
                            <div tabIndex={0} role="button" className="btn bg-base-100">Categories</div>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 mt-3 rounded-box w-52">
                                <li><a>Top events</a></li>
                                <li><a>Sport</a></li>
                                <li><a>Crypto</a></li>
                                <li><a>Other</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex gap-5 flex-col">
                        {events.map((event, index) => (
                            <EventCard event={event} key={index}/>
                        ))}
                    </div>
                    <div className="flex justify-center mt-6">
                        <button className="btn btn-primary">More events</button>
                    </div>
                </div>
            </div>
        </>
    )
}