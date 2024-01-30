import { Link } from "react-router-dom";
import { formatDistance } from 'date-fns';
import {fromNano, toNano} from "ton-core";

export default function EventCard({event}) {

    const stopSellDate = new Date(event.stop_sell_ticket_datetime * 1000);
    const volume = fromNano(event.ticket_price * event.total_tickets);

    return (
        <Link to={"/app/event/" + event.address}>
            <div className="card bg-base-100 shadow-xl w-full">
                <div className="bg-cover bg-center h-44 rounded-t-xl" style={{backgroundImage: `url(${event.image})`}} ></div>
                <div className="card-body pt-4">
                    <p className="font-semibold text-slate-400">
                        {formatDistance(stopSellDate, new Date(), { addSuffix: true })}
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