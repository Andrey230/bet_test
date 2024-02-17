import Ticket from "./Ticket";
import BrandHelper from "../helper/brandHelper";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function EventTickets({event, history}){
    const [t] = useTranslation("global");

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
                <div className={`absolute top-0 left-0 mt-2 ml-2 badge badge-md ${label.badge}`}>{t(`event.state.${BrandHelper.getEventState(event)}`)}</div>
                {event.is_completed ?
                    <div className="flex justify-start flex-nowrap gap-2 items-center flex-wrap overflow-scroll mt-3 absolute left-0 bottom-0 bg-base-content/80 p-1 px-2 rounded-xl mb-2 ml-2 max-w-44">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5 fill-warning" viewBox="0 0 576 512"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
                        </div>
                        <span className="text-lg font-bold text-warning text-nowrap">{event.options[event.winner_option - 1].name.slice(0, 15)}</span>
                    </div>
                    : ""}
            </div>
            <div className="card-body  p-4">
                <Link to={"/app/event/" + event.address}><h2 className="font-bold text-xl text-primary">{event.name}</h2></Link>

                <div className="collapse bg-base-200 collapse-arrow mt-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium">
                        {t("profile.tickets")}
                    </div>
                    <div className="collapse-content">
                        {tickets.map((ticket, index) => (
                            <Ticket ticket={ticket} key={index} options={event.options} history={history}/>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}