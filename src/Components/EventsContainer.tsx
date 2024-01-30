import EventCard from "./EventCard";
import EventWaitingCard from "./EventWaitingCard";

export default function EventsContainer({
                                            events,
                                            title,
                                            search = true,
                                            categories = true,
                                            waiting = false,
                                            more = true

}) {
    const renderEvents = () => {
        if(events.length > 0){
            return events.map((event, index) => {
                return waiting ? <EventWaitingCard event={event} key={index} /> : <EventCard event={event} key={index} />
            });
        }
    }

    return (
        <>
            {search ? <input type="text" id="find-event-input" placeholder="Find event" className="drop-shadow-lg input w-full max-w-xs mb-5" /> : ''}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-semibold">{title}</h1>
                {categories ?
                    <div className="dropdown dropdown-bottom dropdown-end">
                        <div tabIndex={0} role="button" className="btn bg-base-100">Categories</div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 mt-3 rounded-box w-52">
                            <li><a>Top events</a></li>
                            <li><a>Sport</a></li>
                            <li><a>Crypto</a></li>
                            <li><a>Other</a></li>
                        </ul>
                    </div>
                    : ""
                }
            </div>
            <div className="flex gap-5 flex-col">
                {events.length > 0 ?
                    <>
                        {renderEvents()}
                        {more ? <div className="flex justify-center mt-6">
                            <button className="btn btn-primary">More events</button>
                        </div> : ""}
                    </>
                    :
                    <h3>Events nof found</h3>
                }
            </div>
        </>
    )
}