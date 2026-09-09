import { PublicProfilePage } from "@/features/social/components/profile-pages";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <PublicProfilePage id={(await params).id} />; }
