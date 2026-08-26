import { useQuery } from "@tanstack/react-query";
import { getWorkspaces } from "./api";


export function useWorkspaces(){
    return useQuery({
        queryKey: ["workspaces"],
        queryFn: getWorkspaces
    })
}