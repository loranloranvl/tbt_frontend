import axios from 'axios';
import Swal from "sweetalert2";

axios.defaults.baseURL = 'http://tbtapi.imztj.cn:4030';
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
axios.defaults.crossDomain = true;
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
    config => {
        // console.log(config);
        return config;
    }, error => {
        console.log(error);
        Swal.showValidationMessage(`${error}`);
        Swal.fire({
            title: `出错了`
        });
        return Promise.reject(error)
    }
)

axios.interceptors.response.use(
    res => {
        console.log(res);
        return Promise.resolve(res.data);
    }, error => {
        console.log(error);
        Swal.fire({
            title: `出错了`
        });
        Swal.showValidationMessage(`${error}`);
        return Promise.reject(error);
    }
)
export default axios
