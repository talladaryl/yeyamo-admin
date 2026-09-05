import{ImportDetail}from"@/features/catalog/components/imports";export default async function Page({params}:{params:Promise<{id:string}>}){return <ImportDetail id={(await params).id}/>}
