import { useLoaderData } from "react-router-dom"
import { format } from 'date-fns';
import {useState} from "react";
import {fromNano} from "ton-core";
import {useTonConnect} from "../../hooks/useTonConnect";
import {useEventContract} from "../../hooks/useEventContract";
import BrandHelper from "../../helper/brandHelper";
import EventDoughnut from "../../Components/EventDoughnut";
import {getEvent} from "../../api/endpoints";

export async function loader({ params }) {
    const eventId = params.eventId;

    let event;

    await getEvent(eventId).then((response) => response.json())
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

    const stopSellTicket = BrandHelper.getDate(event.stop_sell_ticket_datetime);
    const eventStart = BrandHelper.getDate(event.event_start_datetime);

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

    const renderEventAction = () => {
        switch (BrandHelper.getEventState(event)){
            case "completed":
                return <p className="text-xl font-semibold text-base-content/50">Event is completed</p>;
            case "active":
                return (<>
                    <p className="text-xl font-semibold mb-3">Take part in the event</p>
                    <select className="select w-full max-w-xs bg-base-200" value={ticketOption} onChange={ticketOptionHandler}>
                        <option disabled selected>Pick your option</option>
                        {event.options.map((value, index) => (
                            <option key={index} value={value.option}>{value.name}</option>
                        ))}
                    </select>

                    <p className="mt-3 mb-2">Tickets: {ticketAmount}</p>
                    <input type="range" min="1" max="100" value={ticketAmount} className="range range-primary range-lg" onChange={ticketAmountHandler} disabled={moreTickets}/>
                    <button className="btn btn-primary mt-4" onClick={buyTicketHandler}>Take a part</button>
                </>);
            case "ticket_closed":
                return <p className="text-xl font-semibold text-base-content/50">The opportunity to buy tickets is closed</p>;
            case "canceled":
                return <p className="text-xl font-semibold text-base-content/50">Event is canceled</p>;
            case "waiting_winner":
                return <p className="text-xl font-semibold text-base-content/50">Event is waiting for winner option</p>;
        }
    }

    return (
        <>
            <div className="">
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

                    {event.total_tickets > 0 ? (
                        <EventDoughnut options={event.options} />
                    ): ""}

                    <div className="mt-5">
                        {renderEventAction()}
                    </div>
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