import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LandingIntro } from "@/components/landing/landing-intro";
import Link from "next/link";

function Page() { return <LandingIntro><main><h1 tabIndex={-1}>Home</h1><Link href="/documentation">Documentation</Link></main></LandingIntro>; }

beforeEach(() => {
  document.cookie = "yeyamo_intro_seen=; Max-Age=0; Path=/";
  history.replaceState(null, "", "/");
  vi.useFakeTimers();
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); document.body.style.overflow = ""; });

describe("homepage introduction", () => {
  it("lets users skip immediately and does not replay during the session", () => {
    const { unmount } = render(<Page />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Passer l’introduction" }));
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(screen.getByRole("heading", { name: "Home" })).toHaveFocus();
    unmount();
    render(<Page />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("honours reduced motion and direct section links", () => {
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    const { unmount } = render(<Page />);
    expect(screen.queryByRole("dialog")).toBeNull();
    unmount();
    vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
    history.replaceState(null, "", "/#top");
    render(<Page />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("unblocks the page even when animations never complete", () => {
    Object.defineProperty(SVGElement.prototype, "getTotalLength", { configurable: true, value: () => 100 });
    Object.defineProperty(SVGElement.prototype, "animate", { configurable: true, value: () => ({ finished: new Promise(() => {}), cancel: vi.fn() }) });
    try {
      render(<Page />);
      act(() => vi.advanceTimersByTime(4400));
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(screen.getByRole("link", { name: "Documentation" })).toBeInTheDocument();
      expect(document.body.style.overflow).toBe("");
    } finally {
      Reflect.deleteProperty(SVGElement.prototype, "getTotalLength");
      Reflect.deleteProperty(SVGElement.prototype, "animate");
    }
  });
});
