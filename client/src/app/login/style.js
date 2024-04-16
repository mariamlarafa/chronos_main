import { createUseStyles } from "react-jss";

export const styles = createUseStyles({
  loginPage:{
    height:'100%',
	  margin:'auto'
  },
  topLogo:{
    height:60,
    padding:'20px 50px',
    display:'flex',
    justifyContent:'center',
    gap: 30,
    '& img':{
      height:60,
    }
  },
  bgLogo:{
      position:'absolute',
      left: '-5%',
      top: '40%',
      filter:' blur(5px)',
      transform:'rotate(90deg)'
  },
  bg: {
    height: "calc(100% - 40px )",
    display: "flex",
    position:'relative',
    justifyContent:'center',
    alignItems:'center'

  },
  loginBox: {
    width: 400,
    // margin: "auto",
    textAlign: "center",
    border: 'none rgb(230, 235, 241)',
    borderRadius: 4,
    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 1px 4px',
    backgroundColor:'var(--white)',
    padding:40,
  },
  boxTitle:{
    fontSize:32,
    textAlign:'left',
    margin:0,
    marginBottom:5,
    fontWeight:600
  },
  input: {
    width: "100%"
  },
  labels:{
    textAlign:'left',
    width:'100%',
    marginBottom:5,
    fontSize: '0.875rem',
    lineHeight: '1.4375em',

    fontWeight: 400,
    padding: 0,
    position: 'relative',
    display: 'block',
    transformOrigin: 'left top',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    transition: 'color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms, max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms',
    color: 'rgb(89, 89, 89)'
  },
  resetLink:{
    display:'block',
    color:'black',
    width:'100%',
    textAlign:'right',
    textDecoration:'none',
    '&:hover':{
      textDecoration:'underline'
    }
  },
  loginBtn:{
    width:'100%',
    height:50,
    backgroundColor:'var(--light-green)',
    color:'var(--white)',
    fontSize:16,
    fontWeight:500,
    textTransform:'capitalize',
    outline:'none',
    border:'none',
    transition:'all 0.3s ease-in-out',
    borderRadius:4,
    '&:hover':{
    backgroundColor:'var(--dark-green)',
    transform:'scale(1.1)',
    outline:'none',
    border:'none',

    }
  }
});
