import {createSlice} from '@reduxjs/toolkit';
const initialState = {
    isLogin:localStorage.getItem('isLoginv')||false,
    user:JSON.parse(localStorage.getItem('userv')) ||{},
    token:localStorage.getItem('tokenv')||null
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setLogin:(state)=>{
            state.isLogin= !state.isLogin;
        },
        setUser:(state, action)=>{
            state.user = action.payload;
        },
        setToken:(state,action)=>{
            state.token=action.payload;
        }
    }
})

export const {setLogin, setUser, setToken} = userSlice.actions;
export default userSlice.reducer;