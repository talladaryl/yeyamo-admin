import{ModerationDetail}from"@/features/moderation/components/moderation";export default async function Page({params}:{params:Promise<{id:string}>}){return <ModerationDetail id={(await params).id}/>}
