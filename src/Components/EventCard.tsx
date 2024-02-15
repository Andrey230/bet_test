import { Link } from "react-router-dom";
import {fromNano} from "ton-core";
import BrandHelper from "../helper/brandHelper";

export default function EventCard({event}) {
    const stopSellDate = BrandHelper.getDate(event.stop_sell_ticket_datetime);
    const volume = fromNano(event.ticket_price * event.total_tickets);

    const renderStatus = () => {
        switch (BrandHelper.getEventState(event)){
            case "completed":
                return "Event completed";
            case "active":
                return `Left ${BrandHelper.getDistance(stopSellDate, new Date())} to buy a ticket/s`;
            case "ticket_closed":
                return "The opportunity to buy tickets is closed";
            case "canceled":
                return "Event is canceled";
            case "waiting_winner":
                return "Event is waiting for winner option";
        }
    }

    return (
        <Link to={"/app/event/" + event.address}>
            <div className="card bg-base-100 shadow-xl w-full">
                <div className="bg-cover bg-center h-44 rounded-t-xl" style={{backgroundImage: `url(${event.image})`}} ></div>
                <div className="card-body pt-4">
                    <p className="font-bold text-base-content/30">
                        {renderStatus()}
                    </p>
                    <h2 className="font-bold text-xl">{event.name}</h2>
                    <p className="text-primary font-semibold text-lg">Volume: <span className="font-bold">{volume} TON</span></p>
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