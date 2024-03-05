import {useAsyncInitialize} from "./useAsyncInitialize";
import {TonClient} from "ton";
import {getHttpEndpoint} from "@orbs-network/ton-access";
const network = import.meta.env.VITE_NETWORK;

export function useTonClient() {
    return {
        client: useAsyncInitialize(async () => {
            return new TonClient({
                endpoint: await getHttpEndpoint({
                    network: network
                })
            });
        }, [])
    }
}