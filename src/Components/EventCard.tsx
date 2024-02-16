import { Link } from "react-router-dom";
import {fromNano} from "ton-core";
import BrandHelper from "../helper/brandHelper";

export default function EventCard({event}) {
    const stopSellDate = BrandHelper.getDate(event.stop_sell_ticket_datetime);
    const volume = fromNano(event.ticket_price * event.total_tickets);

    const renderStatus = () => {
        switch (event.state){
            case "active":
                return <div className="flex justify-end items-center gap-2">
                    <span className="text-sm font-bold text-base-content/30">{BrandHelper.getDistance(stopSellDate, new Date())}</span>
                    <svg className="inline-block w-5 h-5 stroke-current fill-base-content/30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
                </div>;
        }
    }

    const label = BrandHelper.getEventStateLabel(event.state);

    return (
        <Link to={"/app/event/" + event.address}>
            <div className="card bg-base-100 shadow-xl w-full">
                <div className="bg-cover bg-center h-44 rounded-t-xl" style={{backgroundImage: `url(${event.image})`}} >
                    <div className="bg-cover bg-center h-44 rounded-lg relative" style={{backgroundImage: `url(${event.image})`}} >
                        <div className={`absolute top-0 left-0 mt-2 ml-2 badge badge-md ${label.badge}`}>{label.text}</div>

                        <div className="bg-base-content/80 rounded-xl flex justify-start gap-2 items-center absolute bottom-0 right-0 pr-2 pl-2 mr-2 mb-2">
                            <span className="font-bold text-2xl text-base-100">{event.total_tickets}</span>
                            <svg className="inline-block w-7 h-7 stroke-current fill-base-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"/></svg>
                        </div>
                    </div>
                </div>
                <div className="card-body p-6 pt-4">
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