import { PlaceDetailPage } from "@/features/explorer/components/detail-pages";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <PlaceDetailPage id={(await params).id} />; }
