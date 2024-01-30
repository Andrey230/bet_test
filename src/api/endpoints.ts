import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const baseUrl = "http://localhost:3000";
const PINATA_JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5M2MwMTk5NC0yYmFmLTQwMDktYjc1OC04NWU0M2QzOTk2MWEiLCJlbWFpbCI6ImFuZHJleWJlbG91czIzMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMGE2MjEwMTlhYTRmNWYwMTRmOTgiLCJzY29wZWRLZXlTZWNyZXQiOiIyN2ZlZWRkNWE3YjQ5M2Y5NDU5MDUxMGQxMmE0ZmE0ZmEyZDg1Y2U1MTZhOWYzODVlNDgyY2NjYTQ2NDU3MTkzIiwiaWF0IjoxNzA2Mjc3ODI0fQ.98KA_65Bl8lxBlgBMwd_uzSAupQWdUJVRtbAdu77gxc`;

export function sendTransaction(params: {}){
    fetch(baseUrl + `/transactions/update`, {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params),
        method: "PATCH"
    });
}

function buildQueryString(params = {}){
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
}

export function getEvents(params = {}){
    const paramsString = buildQueryString(params);
    let url = baseUrl + "/events";

    if(paramsString !== ''){
        url = url + `?${paramsString}`;
    }


    return fetch(url, {
        method: "GET"
    });
}

export function getWaitingEvents(address: string){
    let url = baseUrl + `/events/waiting/${address}`;

    return fetch(url, {
        method: "GET"
    });
}

async function sendPinataUrl(formData){
    try{
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Content-Type': "multipart/form-data;",
                Authorization: PINATA_JWT
            }
        });
        return res.data.IpfsHash;
    } catch (error) {
        throw new error;
    }
}

export async function uploadPinataJson(json){
    const formData = new FormData();
    const jsonString = JSON.stringify(json);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });
    formData.append('file', jsonBlob);

    const metadata = JSON.stringify({
        name: `${uuidv4()}.json`,
    });

    formData.append('pinataMetadata', metadata);
    const options = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    return await sendPinataUrl(formData);
}

export async function uploadPinataFile(file){

    let format = null;
    switch (file.type){
        case "image/png":
            format = 'png';
            break;
        case "image/jpeg":
            format = 'jpg';
            break;
    }

    if(!format){
        throw new Error("undefined format");
    }

    const formData = new FormData();

    formData.append('file', file);

    const metadata = JSON.stringify({
        name: `${uuidv4()}.${format}`,
    });

    formData.append('pinataMetadata', metadata);
    const options = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    return await sendPinataUrl(formData);
}