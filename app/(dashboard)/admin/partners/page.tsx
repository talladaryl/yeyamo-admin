import { Suspense } from "react";
import { PartnersPage } from "@/features/partners/components/partners-page";
import { AdminSkeleton } from "@/components/admin/ui/admin-foundation";
export default function Page(){return <Suspense fallback={<AdminSkeleton rows={8}/>}><PartnersPage/></Suspense>;}
