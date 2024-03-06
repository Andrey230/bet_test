import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const baseUrl = import.meta.env.VITE_BACKEND_ENDPOINT;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

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


export function getEvent(address: string){
    let url = baseUrl + `/events/${address}`;

    return fetch(url, {
        method: "GET"
    });
}

export function getTickets(address: string, params = {}){
    let url = baseUrl + `/tickets/${address}`;
    const paramsString = buildQueryString(params);

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

export function checkUser(address: string){
    let url = baseUrl + `/user/check/${address}`;

    return fetch(url, {
        method: "GET"
    });
}

export function saveUser(address: string, user: {}){
    let url = baseUrl + `/user/${address}`;

    return fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
    });
}

export function saveUserAvatar(address: string, path: string){
    let url = baseUrl + `/user/${address}/avatar`;

    return fetch(url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            path: path
        }),
    });
}

export function getProfileEvents(address: string, params = {}){
    let url = baseUrl + `/events/profile/${address}`;

    const paramsString = buildQueryString(params);

    if(paramsString !== ''){
        url = url + `?${paramsString}`;
    }

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

export async function deletePinataFile(uuid){
    try{
        await axios.delete(`https://api.pinata.cloud/pinning/unpin/${uuid}`, {
            headers: {
                accept: "application/json",
                Authorization: PINATA_JWT
            }
        });
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