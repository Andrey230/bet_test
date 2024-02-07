import {useTicketContract} from "../hooks/useTicketContract";

export default function Ticket({ticket, options}){

    console.log(ticket.returned);

    const {returnWinnerTicket, cancelTicket} = useTicketContract(ticket.address);

    const renderTicketAction = () => {
        switch (ticket.state){
            case "cancel":
                const cancelTicketHandler = async () => {
                    await cancelTicket({
                        ticket: ticket.address
                    });
                }
                return <button onClick={cancelTicketHandler} className="btn btn-warning btn-sm">Return</button>;
            case "win":
                const returnWinnerTicketHandler = async () => {
                    await returnWinnerTicket({
                        ticket: ticket.address
                    });
                }
                return <button onClick={returnWinnerTicketHandler} className="btn btn-success btn-sm">Get reward</button>;
        }
    }

    return (
        <div className="flex justify-between items-center">
            <p className="font-bold">{options[ticket.ticket_option - 1].name} ({ticket.ticket_amount}x)</p>
            {renderTicketAction()}
        </div>
    );
}