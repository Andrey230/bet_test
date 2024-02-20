import {useState, forwardRef} from "react";
import {useEventCreatorContract} from "../../hooks/useEventCreatorContract";
import {beginCell, toNano} from "ton-core";
import {uploadPinataFile, uploadPinataJson} from "../../api/endpoints";
import DatePicker from "react-datepicker";
import '/src/datepicker/datepicker.css';
import BrandHelper from "../../helper/brandHelper";
import {useLoader} from "../root";
import {useTranslation} from "react-i18next";

export default function EventCreate(){
    const maxTags = 5;

    const {setLoading} = useLoader();
    setLoading(false);

    const [t] = useTranslation("global");

    const {createEvent} = useEventCreatorContract();
    //OPTIONS
    const defaultOptions = ["Option 1", "Option 2"];
    const [options, setOptions] = useState(defaultOptions);
    const [optionsError, setOptionsError] = useState("");

    const [loading, setLoadingEvent] = useState(false);

    //TAGS
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");

    //TITLE
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");

    //IMAGE
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [imageError, setImageError] = useState("");
    const maxImageSize = 5000000;

    //DESCRIPTION
    const [desc, setDesc] = useState("");
    const [descError, setDescError] = useState("");

    //DATE
    const defaultStopSellTicketDate = new Date();

    const defaultEndEventDate = new Date(defaultStopSellTicketDate);
    defaultEndEventDate.setMinutes(defaultEndEventDate.getMinutes() + 10);

    const [stopSellTicketDate, setStopSellTicketDate] = useState(defaultStopSellTicketDate);
    const [stopSellTicketDateError, setStopSellTicketDateError] = useState(false);

    const [endEventDate, setEndDateEvent] = useState(defaultEndEventDate);
    const [endEventDateError, setEndDateEventError] = useState(false);
    const [price, setPrice] = useState(1);

    const optionHandler = (option) => {
        const optionIndex = option.target.dataset.optionIndex

        options[optionIndex] = option.target.value
        const newOptions = [...options]
        setOptions(newOptions)

        let isError = false;

        options.forEach((value) => {
            if(value == ""){
                isError = true;
            }
        });

        setOptionsError(isError ? "Invalid options" : "");
    }

    const renderOptions = () => {
        return options.map((value, index) => (
            <div className="flex justify-between" key={index}>
                <input type="text" placeholder={`Options ${index + 1}`} className={`bg-base-200 input w-full max-w-xs ${value == "" ? "input-error" : ""}`} name={`option`} onChange={optionHandler} data-option-index={index} value={value}/>

                {index > 1 ? (
                    <a className="btn btn-ghost btn-circle" onClick={() => removeOptionHandler(index)} data-option-index={index}>
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-error" viewBox="0 0 448 512"><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"/></svg>
                        </div>
                    </a>
                ) : (
                    <div className="btn btn-ghost btn-circle no-animation">
                        <div className="indicator">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-success" viewBox="0 0 448 512"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>
                        </div>
                    </div>
                )}
            </div>
        ));
    };

    const addOptionHandler = () => {
        const newOptions = [...options, ""]
        setOptions(newOptions);
    }

    const removeOptionHandler = (optionIndex) => {
        const newOptions = options.filter(function(item, index) {
            return optionIndex !== index;
        });

        setOptions(newOptions)
    }

    const textInputHandler = (event, setValue, setError) => {
        const value = event.target.value;

        if(!value){
            setError("Required field");
        }else{
            setError("");
        }

        const cleanedText = value.replace(/\s+/g, ' ');

        setValue(cleanedText);
    }

    const onChangeImage = async (e) => {
        if(e.target.files[0].size > maxImageSize){
            setImageError("Max size 5MB");
        }else{
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    }

    const ticketPriceHandler = async (event) => {
        setPrice(event.target.value);
    }

    const createEventHandler = async () => {
        if(loading){
            return;
        }

        let hasErrors = false;
        if(title === ""){
            hasErrors = true;
            setTitleError("Required field");
        }

        if(desc === ""){
            hasErrors = true;
            setDescError("Required field");
        }
        let optionsError = false;
        options.forEach((value, index) => {
            if(value == ""){
                optionsError = true;
            }
        });

        if(!image){
            hasErrors =true;
            setImageError("Pick image");
        }

        if(optionsError){
            hasErrors = true;
            setOptionsError("Invalid options");
        }

        if(hasErrors){
            return;
        }

        setLoadingEvent(true);

        const pinataImage = await uploadPinataFile(image);
        const pinataImageUrl = `https://apricot-secret-orangutan-556.mypinata.cloud/ipfs/${pinataImage}`;
        const eventData = {
            name: title,
            description: desc,
            image: pinataImageUrl,
            options: options,
            tags: tags
        };

        const pinataJson = await uploadPinataJson(eventData);

        const pinataJsonUrl = `https://apricot-secret-orangutan-556.mypinata.cloud/ipfs/${pinataJson}`;


        const OFFCHAIN_CONTENT_PREFIX = 0x01;


        let eventContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(pinataJsonUrl).endCell();
        //
        await createEvent({
            $$type: "EventCreate",
            query_id: 0n,
            content: eventContent,
            ticket_price: toNano(`${price}`),
            stop_sell_ticket_datetime: BigInt(BrandHelper.getTimeStamp(stopSellTicketDate)),
            event_start_datetime: BigInt(BrandHelper.getTimeStamp(endEventDate)),
            total_options: BigInt(options.length)
        });

        setLoadingEvent(false);
    }

    const addTagsButton = () => {
        if(tag !== "" && tags.length < maxTags){
            const newTags = [...tags, tag];
            setTags(newTags);
            setTag("");
        }
    };

    const handleTagsInput = (element) => {
        setTag(element.target.value);
    }

    const removeTag = (tagIndex) => {
        const newTags = tags.filter(function(item, index) {
            return tagIndex !== index;
        });

        setTags(newTags);
    }

    const StopSellTicketInput = forwardRef(({ value, onClick }, ref) => (
        <button className="btn w-full no-animation" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    const stopSellTicketDateHandler = (date) => {
        setStopSellTicketDate(date);
        checkStopSellTicketDate(date);
    }

    const endEventDateHandler = (date) => {
        setEndDateEvent(date);
        checkEndEventDate(date);
    }

    const checkEndEventDate = (date) => {
        if(BrandHelper.getTimeStamp(stopSellTicketDate) >= BrandHelper.getTimeStamp(date)){
            setEndDateEventError(true);
        }else{
            setEndDateEventError(false);
            setStopSellTicketDateError(false);
        }
    }

    const checkStopSellTicketDate = (date) => {
        if(BrandHelper.getTimeStamp(date) >= BrandHelper.getTimeStamp(endEventDate)){
            setStopSellTicketDateError(true);
        }else{
            setStopSellTicketDateError(false);
            setEndDateEventError(false);
        }
    }

    return (
        <>
            <div className="flex justify-center mb-20">
                <div className="bg-base-100 rounded-lg p-5 shadow-xl">
                    <h3 className="text-2xl font-semibold border-base-300">{t("create.main_title")}</h3>

                    <div className="flex flex-col mt-5">
                        <label>
                            <div>
                                {imageUrl ?
                                    <div className="bg-cover bg-center h-44 rounded-lg" style={{backgroundImage: `url(${imageUrl})`}} ></div>
                                    :
                                    <div className={`bg-cover bg-center h-44 rounded-lg bg-base-200 flex justify-center items-center ${imageError ? 'border-error border' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 fill-base-100" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                                    </div>
                                }
                                <input type="file" className="hidden" accept="image/*" onChange={onChangeImage}/>
                            </div>
                        </label>

                        <div className="mt-5">
                            <p className="font-semibold mb-2">{t("create.title.label")}</p>
                            <input type="text" placeholder={t("create.title.placeholder")} className={`bg-base-200 input w-full max-w-xs ${titleError ? "input-error" : ""}`} name="title" value={title} onChange={(event) => {textInputHandler(event, setTitle, setTitleError)}}/>
                        </div>

                        <div className="mt-5">
                            <p className="font-semibold mb-2">{t("create.description.label")}</p>
                            <textarea className={`w-full textarea bg-base-200 h-24 ${descError ? "input-error" : ""}`} style={{height: "160px"}} maxLength={380} placeholder={t("create.description.placeholder")} name="description" value={desc} onChange={(event) => {textInputHandler(event, setDesc, setDescError)}}></textarea>
                        </div>

                        <div className="mt-5">
                            <p className="font-semibold mb-3">{t("create.stop_sell_ticket.label")}</p>

                            <input type="time" className="input w-full max-w-xs"/>

                            {/*<DatePicker*/}
                            {/*    className="w-full"*/}
                            {/*    selected={stopSellTicketDate}*/}
                            {/*    onChange={stopSellTicketDateHandler}*/}
                            {/*    customInput={<StopSellTicketInput />}*/}
                            {/*    showTimeInput*/}
                            {/*    timeInputLabel="Time:"*/}
                            {/*    dateFormat="MMMM d, yyyy - HH:mm"*/}
                            {/*    minDate={new Date()}*/}
                            {/*    shouldCloseOnSelect={false}*/}
                            {/*/>*/}

                            {stopSellTicketDateError ? <p className="text-error text-xs mt-2">{t("create.stop_sell_ticket.error")}</p> : ""}
                        </div>

                        <div className="mt-5">
                            <p className="font-semibold mb-3">{t("create.end_event.label")}</p>
                            {/*<DatePicker*/}
                            {/*    selected={endEventDate}*/}
                            {/*    onChange={endEventDateHandler}*/}
                            {/*    customInput={<StopSellTicketInput />}*/}
                            {/*    showTimeInput*/}
                            {/*    timeInputLabel="Time:"*/}
                            {/*    dateFormat="MMMM d, yyyy - HH:mm"*/}
                            {/*    minDate={new Date()}*/}
                            {/*    shouldCloseOnSelect={false}*/}
                            {/*/>*/}

                            {endEventDateError ? <p className="text-error text-xs mt-2">{t("create.end_event.error")}</p> : ""}
                        </div>

                        {/*<div className="mt-5">*/}
                        {/*    <p className="font-semibold mb-3">Ticket price: {price} TON</p>*/}
                        {/*    <input type="range" min={1} max={100} value={price} className="range range-primary range-lg" onChange={ticketPriceHandler}/>*/}
                        {/*</div>*/}

                        <div className="mt-5">
                            <p className="font-semibold mb-3">{t("create.tags.label")}</p>
                            <div className="flex justify-between gap-3">
                                <input type="text" placeholder={t("create.tags.placeholder")} className={`bg-base-200 input w-full max-w-xs`} name="tags" value={tag} onChange={handleTagsInput}/>
                                <button className="btn btn-primary text-xl" onClick={addTagsButton}>
                                    +
                                </button>
                            </div>
                            <div className="flex gap-2 flex-wrap mt-3">
                                {tags.map((element, index) => {
                                    return <div className="badge badge-primary badge-lg gap-1" key={index} onClick={() => removeTag(index)}>
                                        {element}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </div>;
                                })}
                            </div>
                        </div>

                        <div className="mt-5">
                            <p className="text-sm mb-2 font-semibold">{t("create.options.label")}</p>
                            <div className="flex flex-col gap-3">
                                {renderOptions()}
                            </div>
                        </div>

                        <div className="mt-5">
                            <div className="flex justify-left gap-2 mt-5">
                                <div className="btn btn-active" onClick={addOptionHandler}>{t("create.options.add")}</div>
                                <button className="btn btn-primary" onClick={createEventHandler} disabled={loading}>
                                    {loading ? <span className="loading loading-spinner loading-md"></span> :
                                        t("create.button")
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}