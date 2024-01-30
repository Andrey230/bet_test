import {useTonConnect} from "./useTonConnect";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {EventCreate, EventCreator} from "../contracts/eventCreator";
import {Address, OpenedContract, toNano} from "ton-core";
import {useTonClient} from "./useTonClient";

export function useEventCreatorContract() {
    const {client} = useTonClient();
    const {getSender} = useTonConnect();

    const eventCreatorContract = useAsyncInitialize(async () => {
        if(!client) return;

        const contract = EventCreator.fromAddress(Address.parse("EQB9gncraLfnYpyIR6jDJ4PIpc-i7DCBFrrjch-iRNPfUPuU"));

        return client.open(contract) as OpenedContract<EventCreator>;
    }, [client]);

    return {
        createEvent: async (message: EventCreate) => {
            const {sender} = getSender("createEvent");

            await eventCreatorContract?.send(sender, {
                value: toNano("0.15"),
            }, message);
        },
    }
}