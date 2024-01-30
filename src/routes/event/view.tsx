import { useLoaderData } from "react-router-dom"
import { format } from 'date-fns';
import {useEffect, useState} from "react";
import {fromNano} from "ton-core";
import {useTonConnect} from "../../hooks/useTonConnect";
import {TonConnectButton} from "@tonconnect/ui-react";
import {useEventContract} from "../../hooks/useEventContract";

export async function loader({ params }) {
    const eventId = params.eventId;

    let event;

    await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "GET"
    })
        .then((response) => response.json())
        .then((data) => {
            event = data;
        })
        .catch((error) => console.log(error));


    if(!event){
        console.log("404");
    }

    return { event };
}

export default function EventView(){
    const { event } = useLoaderData();
    const {connected} = useTonConnect();
    const {buyTicket} = useEventContract(event.address);

    const stopSellTicket = new Date(event.stop_sell_ticket_datetime * 1000);
    const eventStart = new Date(event.event_start_datetime * 1000);

    const [ticketAmount, setTicketAmount] = useState(1);
    const [moreTickets, setMoreTickets] = useState(false);
    const [ticketOption, setTicketOption] = useState(1);

    const ticketAmountHandler = (event) => {
        setTicketAmount(event.target.value);
    }

    const ticketMoreHandler = () => {
        setMoreTickets(!moreTickets);
    }

    const ticketOptionHandler = (event) => {
        setTicketOption(Number(event.target.value));
    }

    const buyTicketHandler = async () => {
        await buyTicket(ticketAmount * Number(fromNano(event.ticket_price)),{
            $$type: "CreateTicket",
            query_id: 0n,
            ticket_amount: BigInt(ticketAmount),
            ticket_option: BigInt(ticketOption)
        }, {
            event: event.address
        });
    }

    return (
        <>
            <div className="flex justify-center">
                <div className="bg-base-100 rounded-xl p-5 shadow-xl">
                    <h3 className="text-2xl font-semibold">{event.name}</h3>
                    <div className="bg-cover bg-center h-44 rounded-lg mt-3" style={{backgroundImage: `url(${event.image})`}} ></div>
                    <p className="font-normal mt-2">{event.description}</p>
                    <div className="stats stats-vertical lg:stats-horizontal w-full">

                        <div className="stat pl-0">
                            <div className="stat-title">Ticket price</div>
                            <div className="stat-value text-lg text-primary">{fromNano(event.ticket_price)} TON</div>
                        </div>

                        <div className="stat pl-0">
                            <div className="stat-title">Total tickets</div>
                            <div className="stat-value text-lg text-secondary text-success">{event.total_tickets}</div>
                        </div>

                        <div className="stat pl-0">
                            <div className="stat-title">Stop sell tickets</div>
                            <div className="stat-value text-lg text-base-content">{format(stopSellTicket, "MMMM d, yyyy - HH:mm")}</div>
                        </div>

                        <div className="stat pl-0">
                            <div className="stat-title">Event end date</div>
                            <div className="stat-value text-lg text-base-content">{format(eventStart, "MMMM d, yyyy - HH:mm")}</div>
                        </div>
                    </div>
                    {connected ?
                    <>
                        <p className="text-xl font-semibold mb-3">Take part in the event</p>
                        <select className="select w-full max-w-xs shadow" value={ticketOption} onChange={ticketOptionHandler}>
                            <option disabled selected>Pick your option</option>
                            {event.options.map((value, index) => (
                                <option key={index} value={value.option}>{value.name}</option>
                            ))}
                        </select>

                        <p className="mt-3 mb-2">Tickets: {ticketAmount}</p>
                        <input type="range" min="1" max="100" value={ticketAmount} className="range range-primary range-md" onChange={ticketAmountHandler} disabled={moreTickets}/>
                        <button className="btn btn-primary mt-4" onClick={buyTicketHandler}>Take a part</button>
                    </> :
                        <>
                            <p className="text-xl font-semibold mb-3">To participate, connect your wallet</p>
                        </>
                    }
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