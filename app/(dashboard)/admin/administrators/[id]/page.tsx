import{AdministratorDetail}from"@/features/administrators/components/administrator-detail";
export default async function Page({params}:{params:Promise<{id:string}>}){return <AdministratorDetail id={(await params).id}/>}
