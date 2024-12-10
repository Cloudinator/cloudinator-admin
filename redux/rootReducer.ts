import { combineReducers } from '@reduxjs/toolkit'
import { userApi } from './api/userApi'

const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer

