import axios from 'axios'

export default class LogErrorService {

    getLogError() {
        return axios.get('http://34.66.31.229:3000/api/log-error').then(res => res.data.response);
    }
}