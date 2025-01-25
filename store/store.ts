import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './boardSlice'

export const store = configureStore({
  reducer: {
    // Board'ı reducer olarak ekler
    board: boardReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
