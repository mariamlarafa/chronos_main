import {createUseStyles} from 'react-jss'

export const logoutStyle = createUseStyles({
    logoutPage:{
        width:'100%',
        height:'100%',
        display:'flex'
    },
    logoutCard:{
        width:'40%',
        margin:'auto',
        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
        background:'var(--white)',
        height:'30%',
        borderRadius:10,
        textAlign:'center',
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        '& p':{
            marginTop:0
        },
        "& .dot-floating": {
            position: "relative",
            width: "10px",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "var(--orange)",
            color: "var(--orange)",
            animation: "$dotFloating 3s infinite cubic-bezier(0.15, 0.6, 0., 0.1)"
        },
        "& .dot-floating::before, .dot-floating::after": {
            content: "\"\"",
            display: "inline-block",
            position: "absolute",
            top: "0"
        },
        "& .dot-floating::before": {
            right: "-12px",
            width: "10px",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "var(--orange)",
            color: "var(--orange)",
            animation: "$dotFloatingBefore 3s infinite ease-in-out"
        },
        "& .dot-floating::after": {
            right: "-24px",
            width: "10px",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "var(--orange)",
            color: "var(--orange)",
            animation: "$dotFloatingAfter 3s infinite cubic-bezier(0.4, 0, 1, 1)"
        },


    },
    "@keyframes dotFloating": {
        "0%": {
            right: "calc(-50% - 5px)"
        },
        "75%": {
            right: "calc(50% + 105px)"
        },
        "100%": {
            right: "calc(50% + 105px)"
        }
    },
    "@keyframes dotFloatingBefore": {
        "0%": {
            right: "-50px"
        },
        "50%": {
            right: "-12px"
        },
        "75%": {
            right: "-50px"
        },
        "100%": {
            right: "-50px"
        }
    },
    "@keyframes dotFloatingAfter": {
        "0%": {
            right: "-100px"
        },
        "50%": {
            right: "-24px"
        },
        "75%": {
            right: "-100px"
        },
        "100%": {
            right: "-100px"
        }
    },

    cardTitle:{
        display:'flex',
        justifyContent:'center',
        alignItems:'flex-end',
        gap:5,
        marginBottom:'2%',
        '& .title':{
            margin:0,
            lineHeight:'18px',
            textAlign:'center',
            fontWeight:500,
            fontSize:28,
        }
    },
    textPrimary:{
        fontSize:16,
        marginBottom:10,
        fontWeight:400,

    },
    text:{
        fontSize:16,
        fontWeight:600,
        marginBottom:10
    },

})