import axios from 'axios'

export default class SaveBreakDownService {

    getSaveBreadowns() {
        return axios.get('/api/save-break-down/').then(res => res.data.response);
    }
}