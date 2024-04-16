import { createUseStyles } from "react-jss";


export const style = createUseStyles({
    loaderContainer:{
        display:'flex',
        width:'100%',
        justifyContent:'center',
        margin:'auto',
    }
})




export const projectsSkeleton = createUseStyles({
    container:{
        height:'100%',
        display: 'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        padding:'0px 20px',
    },
    row:{
        height:'40px !important',
    }
})
