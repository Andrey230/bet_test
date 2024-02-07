import {useTonClient} from "./useTonClient";
import {useTonConnect} from "./useTonConnect";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {CreateTicket, Event, SetWinnerOption} from "../contracts/Event";
import {Address, OpenedContract, toNano} from "ton-core";

export function useEventContract(address){
    const {client} = useTonClient();
    const {getSender} = useTonConnect();

    const eventContract = useAsyncInitialize(async () => {
        if(!client) return;

        const contract = Event.fromAddress(Address.parse(address));

        return client.open(contract) as OpenedContract<Event>;
    }, [client]);

    return {
        setWinnerOption: async (message: SetWinnerOption, additionalParams = {}) => {
            const {sender} = getSender("setWinnerOption", additionalParams);

            await eventContract?.send(sender, {
                value: toNano("0.15"),
            }, message);
        },
        buyTicket: async (value: number, message: CreateTicket, additionalParams = {}) => {
            const {sender} = getSender("createTicket", additionalParams);
            const additionalValue = 0.08;



            await eventContract?.send(sender, {
                value: toNano(value + additionalValue),
            }, message);
        },
    }
}