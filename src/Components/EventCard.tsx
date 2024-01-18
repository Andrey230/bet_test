import { Link } from "react-router-dom"

export default function EventCard({event}) {
    return (
        <Link to={"/app/event/" + event.address}>
            <div className="card bg-base-100 shadow-xl">
                <figure><img src={event.image} alt="Shoes" /></figure>
                <div className="card-body pt-4">
                    <p className="font-semibold text-slate-400">left {event.endDate}</p>
                    <h2 className="font-bold text-xl">{event.title}</h2>
                    <p className="text-primary font-semibold text-lg">Volume: <span className="font-bold">{event.volume} TON</span></p>
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