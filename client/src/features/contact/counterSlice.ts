import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
    data: number;
    title: string
}

const initialState: CounterState = {
    data: 42,
    title: "hello world with Redux Toolkit"
}

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.data += action.payload
        },
        decrement: (state, action) => {
            state.data -= action.payload
        },
    }
})

export const {increment, decrement} = counterSlice.actions;