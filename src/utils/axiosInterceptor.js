import axios from 'axios';

export const axiosInterceptor = axios.create({
    baseURL: `https://findfalcone.herokuapp.com`,
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
});

export const getApi = (dataUrl) => {
    return axiosInterceptor.get(`${dataUrl}`)
}

export const postApi = (dataUrl, data) => {
    return axiosInterceptor.post(`${dataUrl}`, data)
}

const API = {
    getApi,
    postApi
};

export default API;