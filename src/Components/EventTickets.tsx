import Ticket from "./Ticket";
import BrandHelper from "../helper/brandHelper";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export default function EventTickets({event, history}){
    const [t] = useTranslation("global");
    let winnerTickets = 0;

    const filterTickets = (tickets) => {
        return tickets.map((ticket) => {
            if(event.is_completed){
                if(event.winner_option == ticket.ticket_option){
                    ticket.state = "win";
                    winnerTickets++;
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
                    <div className="mt-3 absolute left-0 bottom-0 bg-base-content/80 p-1 px-2 rounded-xl mb-2 ml-2">
                        <p className="text-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" className="inline-block w-5 h-5 fill-warning mr-2" viewBox="0 0 576 512"><path d="M400 0H176c-26.5 0-48.1 21.8-47.1 48.2c.2 5.3 .4 10.6 .7 15.8H24C10.7 64 0 74.7 0 88c0 92.6 33.5 157 78.5 200.7c44.3 43.1 98.3 64.8 138.1 75.8c23.4 6.5 39.4 26 39.4 45.6c0 20.9-17 37.9-37.9 37.9H192c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H357.9C337 448 320 431 320 410.1c0-19.6 15.9-39.2 39.4-45.6c39.9-11 93.9-32.7 138.2-75.8C542.5 245 576 180.6 576 88c0-13.3-10.7-24-24-24H446.4c.3-5.2 .5-10.4 .7-15.8C448.1 21.8 426.5 0 400 0zM48.9 112h84.4c9.1 90.1 29.2 150.3 51.9 190.6c-24.9-11-50.8-26.5-73.2-48.3c-32-31.1-58-76-63-142.3zM464.1 254.3c-22.4 21.8-48.3 37.3-73.2 48.3c22.7-40.3 42.8-100.5 51.9-190.6h84.4c-5.1 66.3-31.1 111.2-63 142.3z"/></svg>
                            <span className="text-lg font-bold text-warning">{event.options[event.winner_option - 1].name.slice(0, 10)}</span>
                        </p>
                    </div>
                    : ""}
            </div>
            <div className="card-body  p-4">
                <Link to={"/event/" + event._id}><h2 className="font-bold text-xl text-primary">{event.name}</h2></Link>

                <div className="collapse bg-base-200 collapse-arrow mt-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-xl font-medium flex justify-start items-center gap-2">
                        {!history && winnerTickets > 0 ? <span className="animate-bounce">
                            <svg className="h-5 w-5 fill-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z"/></svg>
                        </span> : ""}
                        <span>{t("profile.tickets")}</span>
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