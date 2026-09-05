import { PlatformUserDetailPage } from "@/features/users/components/platform-user-detail";
export default async function Page({params}:{params:Promise<{id:string}>}){return <PlatformUserDetailPage id={(await params).id}/>;}
