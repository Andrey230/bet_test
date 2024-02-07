import {useTonClient} from "./useTonClient";
import {useTonConnect} from "./useTonConnect";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {ReturnTicket, Ticket} from "../contracts/ticket";
import {Address, OpenedContract, toNano} from "ton-core";

export function useTicketContract(address){
    const {client} = useTonClient();
    const {getSender} = useTonConnect();

    const ticketContract = useAsyncInitialize(async () => {
        if(!client) return;

        const contract = Ticket.fromAddress(Address.parse(address));

        return client.open(contract) as OpenedContract<Ticket>;
    }, [client]);

    return {
        returnWinnerTicket: async (additionalParams = {}) => {
            const {sender} = getSender("updateTicket", additionalParams);
            const message = {
                $$type: "ReturnTicket",
                query_id: 0n
            };

            await ticketContract?.send(sender, {
                value: toNano("0.15"),
            }, message);
        },
        cancelTicket: async (additionalParams = {}) => {
            const {sender} = getSender("updateTicket", additionalParams);
            const message = {
                $$type: "CancelTicket",
                query_id: 0n
            };

            await ticketContract?.send(sender, {
                value: toNano("0.15"),
            }, message);
        }
    }
}