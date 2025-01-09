import {createServiceApi} from "@/redux/api/baseApi";

const projectApi = createServiceApi('project')

type BuildAnalysis = {
    success: number,
    fail: number,
    data: string,
}

type BuildHistory = {
    jobName: string,
    buildNumber: string,
    status: string,
    timeSince: string,
}

type Workspace = {
    uuid: string,
    name: string,
    IsActive: boolean,
}

export type Service = {
    uuid: string,
    name: string,
    gitUrl: string,
    branch: string,
    subdomain: string,
    type: string,
    status: boolean
}

export const projectsApi = projectApi.injectEndpoints({
    endpoints: (builder) => ({

        countProjects: builder.query<number, void>({
            query: () => 'api/v1/deploy-service/count-all-services',
        }),

        countSubWorkspaces: builder.query<number, void>({
            query: () => 'api/v1/sub-workspace/count',
        }),

        getBuildAnalysis: builder.query<BuildAnalysis, void>({
            query: () => 'api/v1/deploy-service/get-all-build-analytics',
        }),

        getBuildHistory: builder.query<BuildHistory, void>({
            query: () => 'api/v1/deploy-service/get-build-history',
        }),

        getAllWorkSpaces: builder.query<Workspace, void>({
            query: () => 'api/v1/workspace/all',
        }),

        countAllServices: builder.query<number, void>({
            query: () => 'api/v1/deploy-service/count-all',
        }),

        countAllSubWorkspace: builder.query<number, void>({
            query: () => 'api/v1/sub-workspace/count-all',
        }),

        enableWorkspace: builder.mutation<void, { name: string }>({
            query: ({ name }) => ({
                url: `api/v1/workspace/enable/${name}`,
                method: 'POST',
            }),
        }),

        disableWorkspace: builder.mutation<void, { name: string }>({
            query: ({name}) => ({
                url: `api/v1/workspace/disable/${name}`,
                method: 'POST',
            }),
        }),

        getWorkSpaceByUserName: builder.query<Workspace, { username: string }>({
            query: ({ username }) => `api/v1/workspace/by-user/${username}`,
        }),

        getServiceDeployment: builder.query<Service[], { workspaceName: string,size: number,page:number }>({
            query: ({ workspaceName,size,page }) => `api/v1/deploy-service/${workspaceName}?size=${size}&page=${page}`,
        }),

        getSubWorkspaces: builder.query<Service[], { workspaceName: string,size: number,page:number }>({
            query: ({ workspaceName,size,page }) => `api/v1/sub-workspace/${workspaceName}?size=${size}&page=${page}`,
        }),

        deleteServiceDeployment: builder.mutation<void, {name:string}>({
            query: ({name}) => ({
                url: `api/v1/deploy-service/delete-service/${name}`,
                method: 'DELETE',
            }),
        }),

        stopServiceDeployment: builder.mutation<Service, { name: string }>({
            query: ({ name }) => ({
                url: `api/v1/deploy-service/stop-service/${name}`,
                method: 'POST',
            }),
        }),

        startServiceDeployment: builder.mutation<Service, { name: string }>({
            query: ({ name }) => ({
                url: `api/v1/deploy-service/restart-service/${name}`,
                method: 'POST',
            }),
        }),


    }),
})

export const {useCountProjectsQuery,useCountSubWorkspacesQuery,useGetBuildAnalysisQuery,useGetBuildHistoryQuery,useGetAllWorkSpacesQuery,useCountAllServicesQuery,useCountAllSubWorkspaceQuery,useDisableWorkspaceMutation,useEnableWorkspaceMutation,useGetWorkSpaceByUserNameQuery,useGetServiceDeploymentQuery,useGetSubWorkspacesQuery,useDeleteServiceDeploymentMutation,useStartServiceDeploymentMutation,useStopServiceDeploymentMutation} = projectsApi