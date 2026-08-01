import{PartnerDetail}from"@/features/partners/components/partner-detail";export default async function Page({params}:{params:Promise<{id:string}>}){return <PartnerDetail id={(await params).id}/>}
