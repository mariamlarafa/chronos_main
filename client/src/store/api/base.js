import Axios from "axios";
import Cookies from "universal-cookie";
/* @Desc
this only servers to abstract the axios package to generate a consistent variable to use during the session of the user
to add authorization token to headers later in not added to each request
*/
const cookie = new Cookies()

const axios = Axios.create({ baseURL: process.env.REACT_APP_API_URL });

axios.interceptors.request.use((config) => {
    // let tokensData = JSON.parse(localStorage.getItem("sessionId"));
    let tokensData = cookie.get('session_token',{doNotParse:true})
    config.headers.setAuthorization( `Bearer ${tokensData}`);
    return config;
  });


export default axios;
