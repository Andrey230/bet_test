import {Cell, SenderArguments} from "ton-core";
import {SendTransactionResponse, useTonConnectUI, useTonWallet} from "@tonconnect/ui-react";
import {Buffer} from "buffer";
import {sendTransaction} from "../api/endpoints";
import {useNotification} from "../routes/root";
import {useTranslation} from "react-i18next";
const miniapp = import.meta.env.VITE_TELEGRAM_MINIAPP;

console.log(miniapp);

export function useTonConnect(): {
    //sender: Sender;
    connected: boolean;
    wallet: string | null;
    network: string | null;
    getSender
} {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();
    const {notifications, addNotification} = useNotification();
    const [t] = useTranslation("global");

    return {
        getSender: (action: string = 'none', additionalParams = {}) => {
            return {
                sender: {
                    send: async (args: SenderArguments) => {
                        try {
                            const result = await tonConnectUI.sendTransaction({
                                messages: [
                                    {
                                        address: args.to.toString(),
                                        amount: args.value.toString(),
                                        payload: args.body?.toBoc().toString("base64"),
                                    },
                                ],
                                validUntil: Date.now() + 5 * 60 * 1000,
                            }, {
                                returnStrategy: miniapp,
                                twaReturnUrl: miniapp
                            });

                            const getTxHash = (
                                tx: SendTransactionResponse,
                            ): string => {
                                const data = Cell.fromBoc(Buffer.from(tx.boc, 'base64'))[0].hash();
                                return Buffer.from(data).toString('hex');
                            };

                            console.log(getTxHash(result));

                            if(action !== 'none'){
                                const requiredParams = {
                                    action: action,
                                    transaction: getTxHash(result)
                                };

                                sendTransaction({...requiredParams, ...additionalParams});
                                addNotification({
                                    success: true,
                                    message: t("notification.success")
                                });
                            }
                        }catch (error){
                            addNotification({
                                success: false,
                                message: t("notification.error")
                            });
                        }
                    }
                }
            }
        },
        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
        network: wallet?.account.chain ?? null,
    };
}