import { createUseStyles } from "react-jss";


export const toolbarStyle= createUseStyles({
    toolbarContainer:{
        background: 'var(--light-green)',
        padding: '0 1% !important',
        '& button':{
            color:'var(--white)'
        }
    }
})