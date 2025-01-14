"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Briefcase,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Power,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCountAllServicesQuery,
  useCountAllSubWorkspaceQuery,
  useDisableWorkspaceMutation,
  useEnableWorkspaceMutation,
  useGetAllWorkSpacesQuery,
} from "@/redux/api/projectApi";
import Link from "next/link";
import Loading from "../Loading";
import { EmptyState } from "./EmptyState";
import { useToast } from "@/hooks/use-toast";

type Workspace = {
  uuid: string;
  name: string;
  isActive: boolean;
};

type Workspaces = Workspace[];

// Reusable StatsCard Component
const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  progress,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  progress?: number;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-purple-500 font-bold">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {progress !== undefined && <Progress value={progress} className="mt-2" />}
    </CardContent>
  </Card>
);

// Reusable WorkspaceTable Component
const WorkspaceTable = ({
  workspaces,
  onToggleStatus,
  loadingWorkspace,
}: {
  workspaces: Workspace[];
  onToggleStatus: (workspace: Workspace) => void;
  loadingWorkspace: string | null;
}) => (
  <div className="rounded-md border flex-1 overflow-y-auto">
    <Table>
      <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10">
        <TableRow>
          <TableHead className="text-purple-500 font-semibold pl-3">
            Workspace
          </TableHead>
          <TableHead className="text-center text-purple-500 font-semibold">
            Status
          </TableHead>
          <TableHead className="text-right pr-5 text-purple-500 font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workspaces.map((workspace) => (
          <TableRow
            key={workspace.uuid}
            className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() =>
              (window.location.href = `/workspace/${workspace.name}`)
            } // Make the row clickable
          >
            <TableCell className="font-medium">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback>{workspace.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                {workspace.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <Badge
                  variant={workspace.isActive ? "default" : "secondary"}
                  className={
                    workspace.isActive
                      ? "bg-green-500 hover:bg-green-600 text-white "
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }
                >
                  {workspace.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </TableCell>
            <TableCell className="text-right">
              {/* View Workspace Detail Button */}
              <Link href={`/workspace/${workspace.name}`} passHref>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the button
                >
                  <Eye className="h-4 w-4 text-purple-500" />
                </Button>
              </Link>

              {/* Enable/Disable Workspace */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={loadingWorkspace === workspace.uuid}
                    onClick={(e) => e.stopPropagation()} // Prevent row click when clicking the button
                  >
                    {loadingWorkspace === workspace.uuid ? (
                      <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    ) : (
                      <Power
                        className={`h-4 w-4 ${workspace.isActive ? "text-red-500" : "text-green-500"}`}
                      />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-purple-500 font-semibold">
                      {workspace.isActive ? "Disable" : "Enable"} Workspace
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to{" "}
                      {workspace.isActive ? "disable" : "enable"} the workspace
                      &#34;{workspace.name}&#34;?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click when clicking the action
                        onToggleStatus(workspace);
                      }}
                      className={
                        workspace.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }
                    >
                      {workspace.isActive ? "Disable" : "Enable"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

interface ErrorResponse {
  status?: string;
  originalStatus?: number;
  data?: {
    message?: string;
  };
}

export function WorkspaceManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const workspacesPerPage = 8;

  const [enableWorkspace] = useEnableWorkspaceMutation();
  const [disableWorkspace] = useDisableWorkspaceMutation();
  const [loadingWorkspace, setLoadingWorkspace] = useState<string | null>(null);

  const {
    data: workspaces,
    isLoading,
    refetch,
  } = useGetAllWorkSpacesQuery() as {
    data: Workspaces | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const { data: countService } = useCountAllServicesQuery();
  const { data: countSubWorkspaces } = useCountAllSubWorkspaceQuery();

  const filteredWorkspaces = useMemo(() => {
    return (
      workspaces?.filter((workspace) =>
        workspace.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ) || []
    );
  }, [workspaces, searchTerm]);

  const indexOfLastWorkspace = currentPage * workspacesPerPage;
  const indexOfFirstWorkspace = indexOfLastWorkspace - workspacesPerPage;
  const currentWorkspaces = filteredWorkspaces.slice(
    indexOfFirstWorkspace,
    indexOfLastWorkspace,
  );
  const totalPages = Math.ceil(filteredWorkspaces.length / workspacesPerPage);

  const totalWorkspaces = workspaces?.length || 0;
  const activeWorkspaces = workspaces?.filter((w) => w.isActive).length || 0;
  const total_projects =
    Number(countService || 0) + Number(countSubWorkspaces || 0);

  // Handle workspace status toggle with toast notifications
  const handleToggleWorkspaceStatus = async (workspace: Workspace) => {
    setLoadingWorkspace(workspace.uuid); // Set loading state for the specific workspace

    try {
      if (workspace.isActive) {
        await disableWorkspace({ name: workspace.name }).unwrap();
      } else {
        await enableWorkspace({ name: workspace.name }).unwrap();
      }

      toast({
        title: "Success",
        description: `Workspace "${workspace.name}" has been ${workspace.isActive ? "disabled" : "enabled"} successfully.`,
        variant: "success",
        duration: 3000,
      });

      refetch();
    } catch (err) {
      const error = err as ErrorResponse;

      if (error?.status === "PARSING_ERROR" && error?.originalStatus === 200) {
        toast({
          title: "Success",
          description:
            error?.data?.message ||
            `Workspace "${workspace.name}" has been ${workspace.isActive ? "disabled" : "enabled"} successfully.`,
          variant: "success",
          duration: 3000,
        });
        refetch();
      } else {
        toast({
          title: "Error",
          description:
            error?.data?.message ||
            `Failed to ${workspace.isActive ? "disable" : "enable"} workspace. Please try again.`,
          variant: "error",
          duration: 5000,
        });
      }
    } finally {
      setLoadingWorkspace(null); // Clear loading state
    }
  };

  // Loading state
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <Loading />
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg transform transition-all  hover:shadow-xl">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Workspace Management{" "}
          <span className="text-purple-200 font-bold hover:text-purple-300 transition-colors duration-300"></span>
          <span role="img" aria-label="wave" className="animate-wave">
            ☁️
          </span>
        </h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Workspaces"
          value={totalWorkspaces}
          icon={Briefcase}
          description={`${activeWorkspaces} active, ${totalWorkspaces - activeWorkspaces} inactive`}
          progress={
            totalWorkspaces > 0 ? (activeWorkspaces / totalWorkspaces) * 100 : 0
          }
        />
        <StatsCard
          title="Total Members"
          value="-"
          icon={Users}
          description="Data not available"
        />
        <StatsCard
          title="Total Projects"
          value={total_projects}
          icon={Briefcase}
          description="Across all workspaces"
        />
        <StatsCard
          title="Avg Projects/Workspace"
          value={
            totalWorkspaces > 0
              ? (total_projects / totalWorkspaces).toFixed(2)
              : "N/A"
          }
          icon={Calendar}
          description={
            totalWorkspaces > 0
              ? "Average across all workspaces"
              : "No workspaces available"
          }
        />
      </div>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="w-full bg-purple-50 p-1 rounded-lg">
          <TabsTrigger
            value="all"
            className="w-full text-purple-500 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-md transition-colors"
          >
            All Workspaces
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="w-full text-purple-500 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-md transition-colors"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="w-full text-purple-500 data-[state=active]:bg-purple-500 data-[state=active]:text-white rounded-md transition-colors"
          >
            Inactive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="flex justify-between">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workspaces..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <WorkspaceTable
            workspaces={currentWorkspaces}
            onToggleStatus={handleToggleWorkspaceStatus}
            loadingWorkspace={loadingWorkspace}
          />
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {indexOfFirstWorkspace + 1} to{" "}
              {Math.min(indexOfLastWorkspace, filteredWorkspaces.length)} of{" "}
              {filteredWorkspaces.length} workspaces
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {filteredWorkspaces.filter((workspace) => workspace.isActive).length >
          0 ? (
            <WorkspaceTable
              workspaces={filteredWorkspaces.filter(
                (workspace) => workspace.isActive,
              )}
              onToggleStatus={handleToggleWorkspaceStatus}
              loadingWorkspace={loadingWorkspace}
            />
          ) : (
            <div className="h-[600px] w-full grid place-content-center">
              <EmptyState message="No active workspaces found." />
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {filteredWorkspaces.filter((workspace) => !workspace.isActive)
            .length > 0 ? (
            <WorkspaceTable
              workspaces={filteredWorkspaces.filter(
                (workspace) => !workspace.isActive,
              )}
              onToggleStatus={handleToggleWorkspaceStatus}
              loadingWorkspace={loadingWorkspace}
            />
          ) : (
            <div className="h-[600px] w-full grid place-content-center">
              <EmptyState message="No inactive workspaces found." />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
