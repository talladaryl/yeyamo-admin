import { EventDetailPage } from "@/features/explorer/components/detail-pages";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <EventDetailPage id={(await params).id} />; }
