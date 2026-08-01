import{MissionDetail}from"@/features/gamification/components/gamification";export default async function Page({params}:{params:Promise<{id:string}>}){return <MissionDetail id={(await params).id}/>}
