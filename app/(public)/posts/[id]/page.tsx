import type { Metadata } from "next";
import { PostDetail } from "@/features/feed/components/post-detail";
export const metadata: Metadata = { title: "Publication | Yeyamo", description: "Consultez cette publication publique Yeyamo." };
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <div className="yy-feed-page"><PostDetail id={id} /></div>; }
