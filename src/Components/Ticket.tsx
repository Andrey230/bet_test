import {useTicketContract} from "../hooks/useTicketContract";

export default function Ticket({ticket, options}){

    const {returnWinnerTicket, cancelTicket} = useTicketContract(ticket.address);

    const renderTicketAction = () => {
        switch (ticket.state){
            case "cancel":
                const cancelTicketHandler = async () => {
                    await cancelTicket({
                        ticket: ticket.address
                    });
                }
                return <button onClick={cancelTicketHandler} className="btn btn-warning btn">
                    <svg className="h-4 w-4 fill-base-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
                </button>;
            case "win":
                const returnWinnerTicketHandler = async () => {
                    await returnWinnerTicket({
                        ticket: ticket.address
                    });
                }
                return <button onClick={returnWinnerTicketHandler} className="btn btn-success btn">
                    <svg className="h-4 w-4 fill-base-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z"/></svg>
                </button>;
        }
    }

    return (
        <div className="flex justify-between flex-wrap items-center p-3 pl-0 pr-0">
            <p className="font-bold">{options[ticket.ticket_option - 1].name} <span className="text-base-content/60">({ticket.ticket_amount}x)</span></p>
            {renderTicketAction()}
        </div>
    );
}