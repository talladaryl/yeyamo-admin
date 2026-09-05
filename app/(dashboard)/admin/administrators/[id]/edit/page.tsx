import{AdministratorEditor}from"@/features/administrators/components/administrator-editor";
export default async function Page({params}:{params:Promise<{id:string}>}){return <AdministratorEditor id={(await params).id}/>}
