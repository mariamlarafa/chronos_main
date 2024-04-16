import { createUseStyles } from "react-jss";



export const styles = createUseStyles({
    pageNotFound:{
        height:'100%',
        width:'100%',
        display:'flex'
    },
    box:{
        width:'fit-content',
        margin:'auto',

        display:'flex',
        alignItems:'center',
        height:100,
        '& .number':{
            paddingRight:20,
            fontWeight:600,
            fontSize:28,
        },
        '& .message':{
            paddingLeft:20,
            fontSize:22,
            borderLeft:'1px solid var(--black)'

        },
    },
    imageContainer:{
        width:'100%',
        '& img':{
            width:'100%'
        }
    }
})