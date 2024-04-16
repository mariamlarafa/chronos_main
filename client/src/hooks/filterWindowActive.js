import { useEffect, useState } from "react";
import useGetStateFromStore from "./manage/getStateFromStore";


function useCheckFilterWindowActive(){
    const [active, setActive] = useState(false)
    const filterStatus = useGetStateFromStore("manage", "filters");

    useEffect(() => {

        function checkIfAnyFilterWindowActive(){
            const any = filterStatus.filter(filter=>filter.active)
            if (any.length){
                setActive(true)
                return
            }else{
           setActive(false)
                return
            }
        }


        checkIfAnyFilterWindowActive()
    }, [filterStatus])



    return active
}

export default useCheckFilterWindowActive

