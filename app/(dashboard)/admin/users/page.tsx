import { Suspense } from "react";
import { PlatformUsersPage } from "@/features/users/components/platform-users-page";
import { AdminSkeleton } from "@/components/admin/ui/admin-foundation";
export default function Page(){return <Suspense fallback={<AdminSkeleton rows={8}/>}><PlatformUsersPage/></Suspense>;}
