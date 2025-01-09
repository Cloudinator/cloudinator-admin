import { combineReducers } from '@reduxjs/toolkit'
import { userApi } from './api/userApi'
import {projectsApi} from "@/redux/api/projectApi";

const rootReducer = combineReducers({
    [userApi.reducerPath]: userApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer

