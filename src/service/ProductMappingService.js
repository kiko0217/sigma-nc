import axios from 'axios'
import saveAs from 'js-file-download'

export default class ProductMappingService {

    getProductMappings() {
        return axios.get('assets/layout/data/product_mapping.json').then(res => res.data.Data);
    }
    getDataFromPdu(filename) {
        return axios.get('assets/layout/data/jsondata/pdu/' + filename).then(res => res.data.Sheet1)
    }
    getDataFromCombiPutra(filename) {
        return axios.get('assets/layout/data/jsondata/ptCombiPutra/' + filename).then(res => res.data.Penjualan)
    }
    getDataFromEmail(){
        return axios.get('http://34.66.31.229:3000/api/temp').then(res => res.data.response)
    }
    downloadFile(name, subject){
        return axios.post('http://34.66.31.229:3000/download',
            {
                name,
                subject
            },
            {
                responseType: 'blob'
            }
            // responseType: 'blob', // important
        ).then(res => saveAs(res.data, name))
    }
    getJsonMapping(tempId){
        return axios.get('http://34.66.31.229:3000/api/convert/unmapping/'+tempId).then(res => res.data)
    }
    getUnmapping(){
        return axios.get('http://34.66.31.229:3000/api/product-map').then(res => res.data.response)
    }
    mapping(tempId){
        return axios.get('http://34.66.31.229:3000/api/product-map/manual/'+tempId).then(res => res.data.message)
    }
    postEdit(productMap){
        // console.log(productMap)
        return axios.post('http://34.66.31.229:3000/api/product-map/edit/'+productMap._id, productMap).then(res => res.data.message)
    }
}