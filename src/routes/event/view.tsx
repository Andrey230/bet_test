import { useLoaderData } from "react-router-dom"
import { format } from 'date-fns';
import {useState} from "react";
import {fromNano} from "ton-core";
import {useTonConnect} from "../../hooks/useTonConnect";
import {useEventContract} from "../../hooks/useEventContract";
import BrandHelper from "../../helper/brandHelper";
import EventDoughnut from "../../Components/EventDoughnut";
import {getEvent} from "../../api/endpoints";
import {useLoader} from "../root";

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
    const {setLoading} = useLoader();
    setLoading(false);

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
        switch (event.state){
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
        }
    }

    const label = BrandHelper.getEventStateLabel(event.state);

    return (
        <>
            <div className="">
                <div className="bg-base-100 rounded-xl shadow-xl">
                    <div className="bg-cover bg-center h-44 rounded-t-xl mt-3 relative" style={{backgroundImage: `url(${event.image})`}} >
                        <div className={`absolute top-0 left-0 mt-2 ml-2 badge-md badge ${label.badge}`}>{label.text}</div>

                        <div className="bg-base-content/80 rounded-xl flex justify-start gap-2 items-center absolute bottom-0 right-0 pr-2 pl-2 mr-2 mb-2">
                            <span className="font-bold text-2xl text-base-100">{event.total_tickets}</span>
                            <svg className="inline-block w-7 h-7 stroke-current fill-base-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"/></svg>
                        </div>
                    </div>

                    <div className="p-5 pt-2">
                        <h3 className="text-2xl font-semibold">{event.name}</h3>
                        <p className="font-normal mt-2 text-base-content/70">{event.description}</p>
                        <div className="stats stats-vertical lg:stats-horizontal w-full">
                            <div className="stat pl-0">
                                <div className="stat-title">Stop sell tickets</div>
                                <div className="stat-value text-lg text-base-content">
                                    <div className="flex justify-start gap-2 items-center">
                                        {format(stopSellTicket, "dd.MM.yyyy - HH:mm")}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="inline-block w-5 h-5 stroke-current"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"/></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="stat pl-0">
                                <div className="stat-title">Event end date</div>
                                <div className="stat-value text-lg text-base-content">
                                    <div className="flex justify-start gap-2 items-center">
                                        {format(eventStart, "dd.MM.yyyy - HH:mm")}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="inline-block w-5 h-5 stroke-current"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {event.total_tickets > 0 ? (
                            <EventDoughnut options={event.options} />
                        ): ""}

                        <div className="mt-5">
                            {renderEventAction()}
                        </div>
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