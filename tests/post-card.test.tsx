import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PostCard } from "@/features/feed/components/post-card";
import type { FeedItem } from "@/features/feed/types";

const { runProtectedAction, userAuthFetch } = vi.hoisted(() => ({ runProtectedAction: vi.fn(), userAuthFetch: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/features/user-auth/protected-action-context", () => ({ useProtectedAction: () => runProtectedAction }));
vi.mock("@/lib/user-auth/client", () => ({ userAuthFetch }));

const item: FeedItem = { id: "11111111-1111-4111-8111-111111111111", authorId: "42", caption: "Une publication réelle", mediaIds: [], hashtags: [], publishedAt: "2026-09-09T08:00:00Z", stats: { likes: 0, comments: 0, shares: 0 }, referenceType: null, referenceId: null };
function view(value: FeedItem = item) { return render(<QueryClientProvider client={new QueryClient()}><PostCard item={value} /></QueryClientProvider>); }

describe("PostCard", () => {
  beforeEach(() => runProtectedAction.mockReset());
  it("renders text, semantic article, real zero stats and no fake author", () => { const result = view(); expect(screen.getByText("Une publication réelle")).toBeInTheDocument(); expect(screen.getByText("0 j’aime")).toBeInTheDocument(); expect(screen.queryByText(/@/)).not.toBeInTheDocument(); expect(result.container.querySelector("article")).toBeTruthy(); });
  it("does not resolve media identifiers to invented public URLs", () => { view({ ...item, mediaIds: ["33333333-3333-4333-8333-333333333333"] }); expect(screen.getByText(/média associé/)).toBeInTheDocument(); });
  it("expands long text without unsafe HTML", () => { const text = "Culture ".repeat(60); view({ ...item, caption: text }); fireEvent.click(screen.getByRole("button", { name: "Voir plus" })); expect(screen.getByRole("button", { name: "Voir moins" })).toBeInTheDocument(); });
  it("routes Like through ProtectedAction", () => { view(); fireEvent.click(screen.getByRole("button", { name: "Aimer" })); expect(runProtectedAction).toHaveBeenCalledWith(expect.objectContaining({ level: "L1", intent: expect.objectContaining({ type: "LIKE", resourceId: item.id }) })); });
  it("executes the real mutation callback when auth authorizes replay", async () => { const user = userEvent.setup(); runProtectedAction.mockImplementation((request) => request?.run()); view(); await user.click(screen.getByRole("button", { name: "Aimer" })); await vi.waitFor(() => expect(userAuthFetch).toHaveBeenCalledWith(`/api/user/feed/posts/${item.id}/like`, expect.objectContaining({ method: "PUT" }))); });
});
