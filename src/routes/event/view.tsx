import { useLoaderData } from "react-router-dom"
import { format } from 'date-fns';
import {useEffect, useRef, useState} from "react";
import {fromNano} from "ton-core";
import {useTonConnect} from "../../hooks/useTonConnect";
import {useEventContract} from "../../hooks/useEventContract";
import BrandHelper from "../../helper/brandHelper";
import EventDoughnut from "../../Components/EventDoughnut";
import {getEvent} from "../../api/endpoints";
import {useLoader} from "../root";
import {useTranslation} from "react-i18next";
import Clipboard from 'clipboard';
import { NavLink } from "react-router-dom";
import {useTonConnectModal} from "@tonconnect/ui-react";
const miniapp = import.meta.env.VITE_TELEGRAM_MINIAPP;

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

    const [t] = useTranslation("global");

    const { event } = useLoaderData();
    const {connected} = useTonConnect();
    const {buyTicket} = useEventContract(event.address);

    const stopSellTicket = BrandHelper.getDate(event.stop_sell_ticket_datetime);
    const eventStart = BrandHelper.getDate(event.event_start_datetime);

    const [ticketAmount, setTicketAmount] = useState(5);
    const [ticketOption, setTicketOption] = useState(1);

    const { open } = useTonConnectModal();

    const ticketAmountHandler = (event) => {
        const newAmount = event.target.value;
        const isValid = /^\d*$/.test(newAmount);
        if (isValid) {
            setTicketAmount(newAmount);
        }
    }

    const ticketOptionHandler = (event) => {
        setTicketOption(Number(event.target.value));
    }

    const buyTicketHandler = async () => {
        if(isNaN(ticketAmount) || ticketAmount === 0 || ticketAmount == ''){
            return;
        }

        if(connected){
            await buyTicket(ticketAmount * Number(fromNano(event.ticket_price)),{
                $$type: "CreateTicket",
                query_id: 0n,
                ticket_amount: BigInt(ticketAmount),
                ticket_option: BigInt(ticketOption)
            }, {
                event: event.address
            });
        }else{
            open();
        }
    }

    const renderEventAction = () => {
        switch (event.state){
            case "active":
                return (<>
                    <p className="text-xl font-semibold mb-3 text-neutral">{t("event.take_part.label")}</p>
                    <select className="select w-full max-w-xs bg-secondary-content text-neutral font-semibold" value={ticketOption} onChange={ticketOptionHandler}>
                        <option disabled selected>{t("event.pick_option")}</option>
                        {event.options.map((value, index) => (
                            <option key={index} value={value.option}>{value.name}</option>
                        ))}
                    </select>

                    <div className="flex justify-between items-center gap-3 mt-8">
                        <input type="number" className="input w-full max-w-xs bg-primary/10 text-neutral font-semibold" value={ticketAmount} step="1" placeholder={t("event.ticket_amount_placeholder")} onChange={ticketAmountHandler} inputMode="tel" onKeyDown={ticketAmountHandler}/>
                        {/*<p className="mt-3 mb-2">{t("event.ticket_to_buy", {count: ticketAmount})}</p>*/}
                        {/*<input type="range" min="1" max="100" value={ticketAmount} className="range range-primary range-lg" onChange={ticketAmountHandler} disabled={moreTickets}/>*/}
                        <button className="btn btn-primary" onClick={buyTicketHandler}>{t("event.take_part.button")}</button>
                    </div>
                </>);
        }
    }

    const btnRef = useRef(null);

    useEffect(() => {
        new Clipboard(btnRef.current, {
            text: () => `${miniapp}?startapp=${event._id}`,
        })
    }, []);

    const label = BrandHelper.getEventStateLabel(event.state);

    return (
        <>
            <div className="">
                <div className="bg-base-100 rounded-xl shadow-xl">
                    <div className="bg-cover bg-center h-44 rounded-t-xl mt-3 relative" style={{backgroundImage: `url(${event.image})`}} >
                        <div className={`absolute top-0 left-0 mt-2 ml-2 badge-md badge ${label.badge}`}>{t(`event.state.${event.state}`)}</div>

                        <div className="bg-base-content/80 rounded-xl flex justify-start gap-2 items-center absolute bottom-0 right-0 pr-2 pl-2 mr-2 mb-2">
                            <span className="font-bold text-2xl text-base-100">{event.total_tickets}</span>
                            <svg className="inline-block w-7 h-7 fill-base-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"/></svg>
                        </div>

                        {/*{event.is_completed ?*/}
                        {/*    <div className="mt-3 absolute left-0 bottom-0 bg-base-content/80 p-1 px-2 rounded-xl mb-2 ml-2">*/}
                        {/*        <p className="text-nowrap">*/}
                        {/*            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5 fill-warning mr-2" viewBox="0 0 576 512"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>*/}
                        {/*            <span className="text-lg font-bold text-warning">{event.options[event.winner_option - 1].name.slice(0, 10)}</span>*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*    : ""}*/}

                        <label className="btn btn-sm btn-circle swap shadow swap-rotate absolute top-0 right-0 mt-2 mr-2 bg-base-100" ref={btnRef}>

                            {/* this hidden checkbox controls the state */}
                            <input type="checkbox" />

                            {/* hamburger icon */}
                            <svg className="swap-off fill-current" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>

                            {/* close icon */}
                            <svg className="swap-on fill-current" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z"/></svg>
                            {/*<svg className="swap-on fill-current" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>*/}

                        </label>
                    </div>

                    <div className="p-5 pt-2">
                        {event.is_completed ?
                            <div className="flex justify-start gap-2 items-center flex-wrap overflow-scroll mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-6 h-6 fill-warning" viewBox="0 0 576 512"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
                                <span className="text-xl font-bold text-warning">{event.options[event.winner_option - 1].name}</span>
                            </div>
                            : ""}
                        <h3 className="text-2xl font-semibold text-neutral">{event.name}</h3>
                        <p className="font-normal mt-2 text-base-content/70">{event.description}</p>

                        <div className="mt-3">
                            <NavLink to={`/profile/${event.owner_address}`}>
                                <div className="flex justify-start items-center gap-3 mt-2">
                                    <div className="avatar">
                                        <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={event.creator.avatar ?? '/images/avatar_small.png'} />
                                        </div>
                                    </div>
                                    <p className="text-primary font-bold">{event.creator.name}</p>
                                </div>
                            </NavLink>
                        </div>

                        <div className="mt-3">
                            <div className="stat-title">{t("event.stop_sell_ticket.label")}</div>
                            <div className="stat-value text-lg text-neutral">
                                <div className="flex justify-start gap-2 items-center">
                                    {format(stopSellTicket, "dd.MM.yyyy - HH:mm")}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="inline-block w-5 h-5 fill-neutral"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"/></svg>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3">
                            <div className="stat-title">{t("event.end_event.label")}</div>
                            <div className="stat-value text-lg text-neutral">
                                <div className="flex justify-start gap-2 items-center">
                                    {format(eventStart, "dd.MM.yyyy - HH:mm")}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="inline-block w-5 h-5 fill-neutral"><path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z"/></svg>
                                </div>
                            </div>
                        </div>

                        {event.total_tickets > 0 ? (
                            <div className="mt-3"><EventDoughnut options={event.options} /></div>
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