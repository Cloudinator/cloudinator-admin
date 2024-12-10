import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import rootReducer from './rootReducer'
import { userApi } from './api/userApi'

export const makeStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(userApi.middleware),
    })

    setupListeners(store.dispatch)

    return store
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']

