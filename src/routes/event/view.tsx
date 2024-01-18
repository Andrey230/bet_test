import { useLoaderData } from "react-router-dom"
import Events from "../../mock/data.json";
import {useState} from "react";

export function loader({ params }) {
    const eventId = params.eventId;
    const events = Events;

    const event = events.find((e) => e.address == eventId);
    return { event };
}

export default function EventView(){
    const { event } = useLoaderData();
    const [ticketAmount, setTicketAmount] = useState(1);
    const [moreTickets, setMoreTickets] = useState(false);

    const ticketAmountHandler = (event) => {
        setTicketAmount(event.target.value);
    }

    const ticketMoreHandler = () => {
        setMoreTickets(!moreTickets);
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="w-4/5 bg-base-100 rounded-xl p-5 shadow-xl">
                    <h3 className="text-2xl font-semibold">{event.title}</h3>
                    <div className="bg-cover bg-center h-44 rounded-lg mt-3" style={{backgroundImage: `url(${event.image})`}} ></div>
                    <p className="font-normal mt-2">{event.description}</p>
                    <div className="stats stats-vertical lg:stats-horizontal w-full">

                        <div className="stat pl-0">
                            <div className="stat-title">Ticket price</div>
                            <div className="stat-value text-xl text-primary">{event.price} TON</div>
                        </div>

                        <div className="stat pl-0">
                            <div className="stat-title">Total tickets</div>
                            <div className="stat-value text-xl text-secondary text-success">{event.totalTickets} ({event.volume} TON)</div>
                        </div>

                        <div className="stat pl-0">
                            <div className="stat-title">Stop sell tickets</div>
                            <div className="stat-value text-xl text-base-content">23.03.2024 - 15:45</div>
                        </div>

                        <div className="stat pl-0">
                            <div className="stat-title">Event end date</div>
                            <div className="stat-value text-xl text-base-content">23.03.2024 - 17:45</div>
                        </div>
                    </div>

                    <p className="text-xl font-semibold mb-3">Take part in the event</p>

                    <select className="select w-full max-w-xs shadow">
                        <option disabled selected>Pick your option</option>
                        {event.options.map((value, index) => (
                            <option key={index}>{value}</option>
                        ))}
                    </select>

                    <p className="mt-3 mb-2">Tickets: {ticketAmount}</p>
                    <input type="range" min="1" max="100" value={ticketAmount} className="range range-primary range-md" onChange={ticketAmountHandler} disabled={moreTickets}/>
                    <button className="btn btn-primary mt-4">Take a part</button>
                    {/*<div className="form-control">*/}
                    {/*    <label className="label cursor-pointer">*/}
                    {/*        <span className="label-text">Need more tickets ?</span>*/}
                    {/*        <input type="checkbox" className="toggle" onChange={ticketMoreHandler}/>*/}
                    {/*    </label>*/}
                    {/*</div>*/}

                    {/*{moreTickets ?*/}
                    {/*    <input type="text" placeholder="Type amount of tickets" className="input w-full max-w-xs shadow" onChange={ticketAmountHandler}/>*/}
                    {/*    :*/}
                    {/*    null}*/}
                </div>
            </div>
        </>
    )
}