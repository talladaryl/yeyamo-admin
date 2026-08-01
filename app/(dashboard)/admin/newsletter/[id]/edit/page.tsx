import{NewsletterEditor}from"@/features/newsletter/components/newsletter";export default async function Page({params}:{params:Promise<{id:string}>}){return <NewsletterEditor id={(await params).id}/>}
