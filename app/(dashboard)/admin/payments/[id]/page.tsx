import{PaymentDetail}from"@/features/finance/components/payments";export default async function Page({params}:{params:Promise<{id:string}>}){return <PaymentDetail id={(await params).id}/>}
