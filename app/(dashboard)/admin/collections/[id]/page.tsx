import{CollectionDetail}from"@/features/catalog/components/collections";export default async function Page({params}:{params:Promise<{id:string}>}){return <CollectionDetail id={(await params).id}/>}
