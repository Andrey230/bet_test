import EventWaitingCard from "./EventWaitingCard";
import EventCard from "./EventCard";

export default function EventGrid({events, waiting, more}){
    const renderEvents = () => {
        if(events.length > 0){
            return events.map((event, index) => {
                return waiting ? <EventWaitingCard event={event} key={index} /> : <EventCard event={event} key={index} />
            });
        }
    }

    return (
        <>
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
    );
}