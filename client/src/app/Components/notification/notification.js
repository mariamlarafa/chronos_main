import { toast } from "react-toastify"



export const notify =(state,message)=>{
    const style={
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: state==='error'?"colored":"light"
    }

    return toast[state](message,style)
}