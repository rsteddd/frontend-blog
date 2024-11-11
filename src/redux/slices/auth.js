import {createSlice} from "@reduxjs/toolkit";
import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk("auth/fetchUserData", async (params) => {
    const {data} = await axios.post("/auth/login",params);
    return data;
});
export const fetchAuthRegister = createAsyncThunk("auth/fetchAuthRegister", async (params) => {
    const {data} = await axios.post("/auth/register",params);
    return data;
});
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
    const {data} = await axios.get("/auth/me");
    return data;
});

const initialState = {
    data: null,
    status: "loading"
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        logout: (state)=>{
            state.data = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAuth.pending, (state) => {
            state.status = "loading";
            state.data = null
        });
        builder.addCase(fetchAuth.fulfilled, (state, action) => {
            state.status = "loaded";
            state.data = action.payload;

        });
        builder.addCase(fetchAuth.rejected, (state) => {
            state.status = "error";
            state.data = null
        });
        builder.addCase(fetchAuthMe.pending, (state) => {
            state.status = "loading";
            state.data = null
        });
        builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
            state.status = "loaded";
            state.data = action.payload;

        });
        builder.addCase(fetchAuthMe.rejected, (state) => {
            state.status = "error";
            state.data = null
        });
        builder.addCase(fetchAuthRegister.pending, (state) => {
            state.status = "loading";
            state.data = null
        });
        builder.addCase(fetchAuthRegister.fulfilled, (state, action) => {
            state.status = "loaded";
            state.data = action.payload;

        });
        builder.addCase(fetchAuthRegister.rejected, (state) => {
            state.status = "error";
            state.data = null
        });
    }
});

export const {logout} = authSlice.actions
export const selectIsAuth = (state) => Boolean(state.auth.data)
export const authReducer = authSlice.reducer;
