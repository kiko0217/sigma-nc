import axios from 'axios'

export default class SaveBreakDownService {

    getSaveBreadowns() {
        return axios.get('http://34.66.31.229:3000/api/save-break-down/').then(res => res.data.response);
    }
}