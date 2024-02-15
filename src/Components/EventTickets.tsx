import Ticket from "./Ticket";
import BrandHelper from "../helper/brandHelper";
import {Link} from "react-router-dom";

export default function EventTickets({event}){
    const filterTickets = (tickets) => {
        return tickets.map((ticket) => {
            if(event.is_completed){
                if(event.winner_option == ticket.ticket_option){
                    ticket.state = "win";
                }else{
                    ticket.state = "lose";
                }
            }else{
                const currentDate = Math.floor(new Date().getTime() / 1000);

                if(currentDate < event.event_start_datetime){
                    ticket.state = "event_not_ended";
                }else{
                    const eventStart24hours = event.event_start_datetime + 86400;

                    if(currentDate > eventStart24hours){
                        ticket.state = "cancel";
                    }else{
                        ticket.state = "waiting_winner";
                    }
                }
            }

            return ticket;
        });
    }

    const renderStatus = () => {
        switch (BrandHelper.getEventState(event)){
            case "completed":
                return "Event completed";
            case "active":
                return `Left ${BrandHelper.getDistance(BrandHelper.getDate(event.stop_sell_ticket_datetime), new Date())} to buy a ticket/s`;
            case "ticket_closed":
                return "The opportunity to buy tickets is closed";
            case "canceled":
                return "Event is canceled";
            case "waiting_winner":
                return "Event is waiting for winner option";
        }
    }

    const tickets = filterTickets(event.tickets ?? []);

    return (
        <div className="card bg-base-100 shadow-xl w-full">
            <div className="bg-cover bg-center h-44 rounded-t-xl" style={{backgroundImage: `url(${event.image})`}} ></div>
            <div className="card-body pt-4">
                <p className="font-bold text-base-content/30">
                    {renderStatus()}
                </p>
                <Link to={"/app/event/" + event.address}><h2 className="font-bold text-xl text-primary">{event.name}</h2></Link>

                <div className="collapse bg-base-200 collapse-arrow">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        Tickets
                    </div>
                    <div className="collapse-content">
                        {tickets.map((ticket, index) => (
                            <Ticket ticket={ticket} key={index} options={event.options}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}