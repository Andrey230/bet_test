import {useState, forwardRef} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EventCreate(){
    //OPTIONS
    const defaultOptions = ["Option 1", "Option 2"];
    const [options, setOptions] = useState(defaultOptions);
    const [optionsError, setOptionsError] = useState("");

    //TITLE
    const [title, setTitle] = useState("");
    const [titleError, setTitleError] = useState("");

    //IMAGE
    const [image, setImage] = useState("");
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

    const [endEventDate, setEndDateEvent] = useState(defaultEndEventDate);
    const [endEventDateError, setEndDateEventError] = useState("");
    const [stopSellTicketDate, setStopSellTicketDate] = useState(defaultStopSellTicketDate);
    const [stopSellTicketDateError, setStopSellTicketDateError] = useState("");
    const [price, setPrice] = useState(5);

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
        const optionLength = options.length;
        const newOptions = [...options, ""]
        setOptions(newOptions)
    }

    const removeOptionHandler = (optionIndex) => {
        const newOptions = options.filter(function(item, index) {
            return optionIndex !== index;
        });

        setOptions(newOptions)
    }

    const submitCreateEventForm = (event) => {
        event.preventDefault();

        console.log(title);
        console.log(desc);
        console.log(options);
        console.log(endEventDate);
        console.log(stopSellTicketDate);
    };

    const textInputHandler = (event, setValue, setError) => {
        const value = event.target.value;

        if(!value){
            setError("Required field");
        }else{
            setError("");
        }

        setValue(event.target.value);
    }

    const stopSellTicketHandler = (date) => {
        console.log(date.valueOf());

        if(date.valueOf() < Date.now()){
            setStopSellTicketDateError("Date must be greater that now");
        }else{
            setStopSellTicketDateError("");
            setStopSellTicketDate(date);

            const newEndDateEvent = new Date(date);
            newEndDateEvent.setMinutes(newEndDateEvent.getMinutes() + 10);
            setEndDateEvent(newEndDateEvent);
        }
    }

    const endDateEventHandler = (date) => {
        if(date.valueOf() < stopSellTicketDate.valueOf()){
            setEndDateEventError("Date must be greater that stop sell ticket date");
        }else{
            setEndDateEventError("");
            setEndDateEvent(date);
        }
    }

    const StopSellTicketInput = forwardRef(({ value, onClick }, ref) => (
        <button className="btn w-full no-animation" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    const EndDateEventInput = forwardRef(({ value, onClick }, ref) => (
        <button className="btn w-full no-animation" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    const onChangeImage = (e) => {
        console.log(e.target.files[0].size);

        if(e.target.files[0].size > maxImageSize){
            setImageError("Max size 5MB");
        }else{
            setImageUrl(URL.createObjectURL(e.target.files[0]));
        }
    }

    const ticketPriceHandler = (event) => {
        setPrice(event.target.value);
    }

    const createEventHandler = () => {
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

        if(optionsError){
            hasErrors = true;
            setOptionsError("Invalid options");
        }


    }

    return (
        <>
            <div className="flex justify-center">
                <div className="w-4/5 bg-base-100 rounded-lg p-5 shadow-xl">
                    <h3 className="text-2xl font-semibold">Create event</h3>

                    <label className="form-control w-full max-w-xs mt-3">

                        {imageUrl ?
                            <div className="bg-cover bg-center h-44 rounded-lg" style={{backgroundImage: `url(${imageUrl})`}} ></div>
                            :
                            <div className="bg-cover bg-center h-44 rounded-lg bg-base-200 flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 fill-base-100" viewBox="0 0 512 512"><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                            </div>
                        }

                        <input type="file" className="hidden" accept="image/*" onChange={onChangeImage}/>
                        {imageError ?
                            <div className="label">
                                <span className="label-text-alt"></span>
                                <span className="label-text-alt text-error">{imageError}</span>
                            </div>
                            : null}
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Title</span>
                        </div>
                        <input type="text" placeholder="Event title" className={`bg-base-200 input w-full max-w-xs ${titleError ? "input-error" : ""}`} name="title" value={title} onChange={(event) => {textInputHandler(event, setTitle, setTitleError)}}/>
                    </label>

                    <label className="form-control">
                        <div className="label">
                            <span className="label-text font-semibold">Description</span>
                        </div>
                        <textarea className={`textarea bg-base-200 h-24 ${descError ? "input-error" : ""}`} placeholder="Event description" name="description" value={desc} onChange={(event) => {textInputHandler(event, setDesc, setDescError)}}></textarea>
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Ticket price: {price} TON</span>
                        </div>

                        <input type="range" min={1} max={100} value={price} className="range range-primary range-md" onChange={ticketPriceHandler}/>
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Stop sell tickets date</span>
                        </div>
                        <DatePicker
                            selected={stopSellTicketDate}
                            onChange={(date) => stopSellTicketHandler(date)}
                            customInput={<StopSellTicketInput />}
                            showTimeInput
                            timeInputLabel="Time:"
                            dateFormat="MMMM d, yyyy - HH:mm"
                            minDate={new Date()}
                        />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text font-semibold">Event end date</span>
                        </div>
                        <DatePicker
                            selected={endEventDate}
                            onChange={(date) => endDateEventHandler(date)}
                            customInput={<EndDateEventInput />}
                            showTimeInput
                            timeInputLabel="Time:"
                            dateFormat="MMMM d, yyyy - HH:mm"
                            minDate={stopSellTicketDate}
                        />
                    </label>

                    <div className="mt-2">
                        <p className="text-sm mb-2 font-semibold">Options</p>
                        <div className="flex flex-col gap-3">
                            {renderOptions()}
                        </div>
                    </div>

                    <div className="mt-2 flex justify-left gap-2 mt-5">
                        <div className="btn btn-active" onClick={addOptionHandler}>Add option</div>
                        <button className="btn btn-primary" onClick={createEventHandler}>Create</button>
                    </div>
                </div>
            </div>
        </>
    )
}