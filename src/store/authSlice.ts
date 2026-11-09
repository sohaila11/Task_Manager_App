import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LoginData , User,  RegisterData } from '../api/auth';
import { FieldErrors } from '../types/api';
import { loginUser , getMe, logout as clearSession, registerUser } from '../api/api';

interface AuthState {
    user: User| null;
    loading: boolean;
    error: string | null;
    fieldErrors: FieldErrors | null;
}

interface LoginFailure {
    status: number | null;
    message: string;
    fields?: FieldErrors;
}

const initialState: AuthState = {
    user: getMe(),
    loading: false,
    error: null,
    fieldErrors: null,
};

export const login = createAsyncThunk<User,LoginData, {rejectValue:LoginFailure}>(
    'auth/login',
    async (data, { rejectWithValue }) => {
        try {
            const respone = await loginUser(data);
            return respone.user;
        } catch (err: any) {
            return rejectWithValue({
                status: err.status ??null,
                message: err.message,
                fields: err.fields,
            });
        }
    }
);

export const register = createAsyncThunk<User, RegisterData , { rejectValue: LoginFailure }>(
    'auth/register',
    async (data, { rejectWithValue }) => {
        try {
            const response = await registerUser(data);
            return response.user;
        } catch (err: any) {
            return rejectWithValue({
                status: err.status ?? null,
                message: err.message,
                fields: err.fields,
            });
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers:{
        logout(state){
            clearSession();
            state.user=null;

        },
        clearError(state){
            state.error = null;
            state.fieldErrors = null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(login.pending, (state)=>{
            state.loading = true;
            state.error=null;
            state.fieldErrors = null;
        })
        builder.addCase(login.fulfilled,(state, action)=>{
            state.loading=false;
            state.user = action.payload;
        })
        builder.addCase(login.rejected,(state,action)=>{
            state.loading=false;
            if (action.payload?.status=== 401) state.error = 'Invalid email or password';
            else if(action.payload?.fields) state.fieldErrors = action.payload.fields;
            else state.error = action.payload?.message || 'Login failed. Please try again';
        });
        builder.addCase(register.pending, (state)=>{
            state.loading = true;
            state.error=null;
            state.fieldErrors = null;
        });
        builder.addCase(register.fulfilled,(state, action)=>{
            state.loading=false;
            state.user = action.payload;
        });
        builder.addCase(register.rejected,(state,action)=>{
            state.loading=false;
            if(action.payload?.fields) state.fieldErrors = action.payload.fields;
            else if (action.payload?.status=== 400) state.error = 'E-mail already exists';
            else state.error = action.payload?.message || 'Registration failed. Please try again';
        });
            
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;