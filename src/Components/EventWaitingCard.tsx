import {useState} from "react";
import {useEventContract} from "../hooks/useEventContract";
import BrandHelper from "../helper/brandHelper";

export default function EventWaitingCard({event}){
    const [winnerOption, setWinnerOptionInput] = useState(1);
    const {setWinnerOption} = useEventContract(event.address);

    const changeWinnerOption = (element) => {
        setWinnerOptionInput(Number(element.target.value));
    }

    const submitWinnerOption = async () => {
        await setWinnerOption({
            $$type: "SetWinnerOption",
            query_id: 0n,
            winner_option: BigInt(winnerOption)
        }, {
            event: event.address
        });
    }


    return (
        <div className="card bg-base-100 shadow-xl w-full">
            <div className="bg-cover bg-center h-44 rounded-t-xl" style={{backgroundImage: `url(${event.image})`}} ></div>
            <div className="card-body pt-4">
                <p className="font-semibold text-slate-400">
                    Left {BrandHelper.getDistance(BrandHelper.getDate(event.event_start_datetime + 86400), new Date())} to set winner option
                </p>
                <h2 className="font-bold text-xl">{event.name}</h2>

                <p>Set winner option</p>

                <div>
                    <select className="select w-full max-w-xs bg-base-200" value={winnerOption} onChange={changeWinnerOption}>
                        {event.options.map((value, index) => (
                            <option key={index} value={value.option}>{value.name}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary mt-3" onClick={submitWinnerOption}>Set</button>
                </div>
            </div>
        </div>
    );
}