import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const createServiceApi = (service: string) => createApi({
    reducerPath: `${service}Api`,
    baseQuery: fetchBaseQuery({ baseUrl: `/${service}` }),
    endpoints: () => ({}),
})

