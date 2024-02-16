import { Link } from "react-router-dom";
import {fromNano} from "ton-core";
import BrandHelper from "../helper/brandHelper";

export default function EventCard({event}) {
    const stopSellDate = BrandHelper.getDate(event.stop_sell_ticket_datetime);
    const volume = fromNano(event.ticket_price * event.total_tickets);

    const renderStatus = () => {
        switch (BrandHelper.getEventState(event)){
            case "completed":
                return <p className="text-base-content/30 text-sm font-bold text-right">Event completed</p>;
            case "active":
                return <div className="flex justify-end items-center gap-2">
                    <span className="text-sm font-bold text-base-content/30">{BrandHelper.getDistance(stopSellDate, new Date())}</span>
                    <svg className="inline-block w-5 h-5 stroke-current fill-base-content/30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
                </div>;
            case "ticket_closed":
                return <p className="text-base-content/30 text-sm font-bold text-right">The opportunity to buy tickets is closed</p>;
            case "canceled":
                return <p className="text-base-content/30 text-sm font-bold text-right">Event is canceled</p>;
            case "waiting_winner":
                return <p className="text-base-content/30 text-sm font-bold text-right">Waiting for winner option</p>;
        }
    }

    return (
        <Link to={"/app/event/" + event.address}>
            <div className="card bg-base-100 shadow-xl w-full">
                <div className="bg-cover bg-center h-44 rounded-t-xl" style={{backgroundImage: `url(${event.image})`}} ></div>
                <div className="card-body pt-4">
                    {renderStatus()}
                    <h2 className="font-bold text-xl">{event.name}</h2>
                    <div className="card-actions justify-end">
                        {event.tags.map((value, index) => (
                            <div key={index} className="badge badge-outline">{value}</div>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    )
}