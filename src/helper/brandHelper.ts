import { formatDistance } from 'date-fns';

export default class BrandHelper{
    static getTimeStamp(date: Date): number{
        return Math.floor(date.getTime() / 1000)
    }

    static getDate(unix: number): Date{
        return new Date(unix * 1000);
    }

    static getDistance(from: Date, to: Date, addSuffix: boolean = false): string
    {
        return formatDistance(from, to, {addSuffix: addSuffix});
    }

    static getEventState(event): string
    {
        const currentDate = BrandHelper.getTimeStamp(new Date());

        if(event.is_completed){
            return "completed";
        }else{
            if(currentDate < event.stop_sell_ticket_datetime){
                return "active";
            }else{
                if(currentDate < event.event_start_datetime){
                    return "ticket_closed";
                }else{
                    const eventStart24hours = event.event_start_datetime + 86400;
                    if(currentDate >= eventStart24hours){
                        return "canceled";
                    }else{
                        return "waiting_winner";
                    }
                }
            }
        }
    }

    static getEventStateLabel(state)
    {
        switch (state){
            case "active":
                return {
                    color : "success",
                    text : "active"
                };
            case "completed":
                return {
                    color : "ghost",
                    text : "completed"
                };
            case "ticket_closed":
                return {
                    color : "warning",
                    text : "gate closed"
                };
            case "canceled":
                return {
                    color : "error",
                    text : "canceled"
                };
            case "waiting_winner":
                return {
                    color : "warning",
                    text : "waiting winner"
                };
        }
    }
}