import axios from 'axios';

export const axiosInterceptor = axios.create({
    baseURL: `https://findfalcone.herokuapp.com`
});

export const getApi = (dataUrl) => {
    return axiosInterceptor.get(`${dataUrl}`)
}

const API = {
    getApi
};

export default API;