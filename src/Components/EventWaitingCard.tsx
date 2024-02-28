import {useEffect, useState} from "react";
import {useEventContract} from "../hooks/useEventContract";
import BrandHelper from "../helper/brandHelper";
import {useTranslation} from "react-i18next";

export default function EventWaitingCard({event}){
    const [winnerOption, setWinnerOptionInput] = useState(1);
    const [leftHours, setLeftHours] = useState(0);
    const [leftMinutes, setLeftMinutes] = useState(0);
    const [leftSeconds, setLeftSeconds] = useState(0);
    const {setWinnerOption} = useEventContract(event.address);
    const [t] = useTranslation("global");

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

    const label = BrandHelper.getEventStateLabel("waiting_winner");

    function updateTimer() {
        const currentDate = new Date();
        const diffInMilliseconds = BrandHelper.getDate(event.event_start_datetime + 86400) - currentDate;
        const remainingHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        const remainingMinutes = Math.floor((diffInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const remainingSeconds = Math.floor((diffInMilliseconds % (1000 * 60)) / 1000);

        setLeftHours(remainingHours);
        setLeftMinutes(remainingMinutes);
        setLeftSeconds(remainingSeconds);
    }

    useEffect(() => {
        const updateTime = () => {
            updateTimer();
        };

        const timerId = setInterval(updateTime, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    return (
        <div className="card bg-base-100 shadow-xl w-full">
            <div className="bg-cover bg-center h-44 rounded-t-xl relative" style={{backgroundImage: `url(${event.image})`}} >
                <div className={`absolute top-0 left-0 mt-2 ml-2 badge badge-md ${label.badge}`}>{t("event.state.waiting_winner")}</div>

                <div className="bg-base-content/80 rounded-xl flex justify-start gap-2 items-center absolute bottom-0 right-0 pr-2 pl-2 mr-2 mb-2">
                    <span className="font-bold text-2xl text-base-100">{event.total_tickets}</span>
                    <svg className="inline-block w-7 h-7 stroke-current fill-base-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z"/></svg>
                </div>
            </div>
            <div className="card-body pt-4 text-neutral">
                <div className="mb-2">
                    <p className="text-neutral">{t("event.cancel_after")}</p>
                    <span className="countdown font-mono text-xl">
                  <span style={{"--value":leftHours}}></span>:
                  <span style={{"--value":leftMinutes}}></span>:
                  <span style={{"--value":leftSeconds}}></span>
                </span>
                </div>

                <h2 className="font-bold text-xl text-neutral">{event.name}</h2>

                <div>
                    <select className="select w-full max-w-xs bg-secondary-content" value={winnerOption} onChange={changeWinnerOption}>
                        {event.options.map((value, index) => (
                            <option key={index} value={value.option}>{value.name}</option>
                        ))}
                    </select>

                    <button className="btn btn-primary mt-3" onClick={submitWinnerOption}>{t("event.set_winner.button")}</button>
                </div>
            </div>
        </div>
    );
}