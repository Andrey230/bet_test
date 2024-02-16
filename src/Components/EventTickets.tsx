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

    const tickets = filterTickets(event.tickets ?? []);
    const label = BrandHelper.getEventStateLabel(BrandHelper.getEventState(event));

    return (
        <div className="card bg-base-100 shadow-xl w-full">
            <div className="bg-cover bg-center h-44 rounded-t-xl relative" style={{backgroundImage: `url(${event.image})`}} >
                <div className={`absolute top-0 left-0 mt-2 ml-2 badge badge-md badge-${label.color}`}>{label.text}</div>
            </div>
            <div className="card-body pt-4">
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