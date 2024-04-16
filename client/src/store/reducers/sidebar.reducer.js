import {createSlice} from '@reduxjs/toolkit'


const initialState ={
    hide:false,
    collapsed:true
}



const sideBarSlice = createSlice({
    name:'sidebar',
    initialState,
    reducers:{
        toggleSideBar :(state,action)=>{
            state.hide = action.payload
        },
        toggleSideBarStatus:(state,action)=>{
            state.collapsed = !state.collapsed
        }
    }
})


export const {toggleSideBar,toggleSideBarStatus} = sideBarSlice.actions

export default sideBarSlice.reducer