import { useLocation } from "react-router-dom";
import { exceptPathSidebar } from "../app/routes/urls";
import useGetStateFromStore from "./manage/getStateFromStore";

function useRenderLocation(){
const location  = useLocation()
const sideBarDisabled = useGetStateFromStore('sidebar','hide')




var shouldRenderSidebar = !exceptPathSidebar.includes(location.pathname);
if (!shouldRenderSidebar) return shouldRenderSidebar
const similarPath=location.pathname.split('/')[1]

shouldRenderSidebar = !(exceptPathSidebar.map((path)=>path.includes(similarPath))).includes(true)



const render = shouldRenderSidebar && !sideBarDisabled


return render
}



export  default useRenderLocation