import { createServiceApi } from './baseApi'

interface User {
    username: string,
    email: string,
    profileImage: string,
    isEnabled: boolean,
    roles: string[],
}

const identityApi = createServiceApi('identity')

export const userApi = identityApi.injectEndpoints({
    endpoints: (builder) => ({
        getMe: builder.query<User, void>({
            query: () => 'api/v1/users/me',
        }),

        countUser : builder.query<number, void>({
            query: () => 'api/v1/users/count',
        }),

        getAllUserProfile : builder.query<User[], void>({
            query: () => 'api/v1/users/get-all-users-details',
        }),

        disableUser: builder.mutation<void, { username: string }>({
            query: ({ username }) => ({
                url: `api/v1/users/disable/${username}`,
                method: 'POST'
            })
        }),


        enableUser: builder.mutation<void, {username:string}>({
            query: ({username}) => ({
                url: `api/v1/users/enable/${username}`,
                method: 'POST'
            })
        }),

        deleteUser: builder.mutation<void, { username: string }>({
            query: ({ username }) => ({
                url: `api/v1/users/${username}`,
                method: 'DELETE',
            }),
        }),


        testMethod: builder.mutation<void, { username: string }>({
            query: ({ username }) => ({
                url: `api/v1/users/test-method/${username}`,
                method: 'POST',
            }),
        }),

    }),
})

export const { useGetMeQuery,useCountUserQuery,useGetAllUserProfileQuery,useDisableUserMutation,useEnableUserMutation,useTestMethodMutation,useDeleteUserMutation} = userApi

