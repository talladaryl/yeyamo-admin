import{CampaignDetail}from"@/features/campaigns/components/campaigns";export default async function Page({params}:{params:Promise<{id:string}>}){return <CampaignDetail id={(await params).id}/>}
