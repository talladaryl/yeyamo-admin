import{NewsletterDetail}from"@/features/newsletter/components/newsletter";export default async function Page({params}:{params:Promise<{id:string}>}){return <NewsletterDetail id={(await params).id}/>}
