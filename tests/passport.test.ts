import { describe, expect, it } from "vitest";
import { mapPassport } from "@/features/passport/mapper";

const id = "11111111-1111-4111-8111-111111111111";
const instant = "2026-09-09T08:00:00Z";
const input = {
  summary: { totalXp: 250, level: 2, currentLevelThreshold: 100, nextLevelThreshold: 400, currentLevelXp: 150, xpToNextLevel: 150, earnedBadgesCount: 1, passportStampsCount: 1, availableRewardsCount: 1, currentStreak: 2, longestStreak: 4, lastActivityDate: "2026-09-09", updatedAt: instant },
  badges: [{ code: "EXPLORER", name: "Explorateur", description: "Visiter", earned: true, earnedAt: instant }],
  stamps: [{ id, userId: "private-user", destinationId: "place", stampedAt: instant }],
  rewards: [{ id, userId: "private-user", code: "R", title: "Récompense", status: "AVAILABLE", grantedAt: instant, claimedAt: null, source: "level:2" }],
  missions: [{ id, code: "M", title: "Mission", description: "Description", status: "ACTIVE", startsAt: null, endsAt: null, rewardCode: "R", rewardTitle: "Récompense", rewardAmount: 10, objectives: [{ id, label: "Objectif", eventType: "VISIT", metric: "COUNT", target: 2, current: 1, completed: false, ruleKey: "private", ruleValue: "private" }], userStatus: "IN_PROGRESS", completedAt: null }],
  missionRewards: [],
  history: { content: [{ id, points: 10, reason: "VISIT", sourceId: "place", occurredAt: instant }], number: 0, size: 20, last: true },
};

describe("passport mapper", () => {
  it("mappe la projection réelle et retire les champs internes", () => { const passport = mapPassport(input); expect(passport.summary.currentLevelXp).toBe(150); expect(passport.history.hasNext).toBe(false); expect(passport.stamps[0]).not.toHaveProperty("userId"); expect(passport.rewards[0]).not.toHaveProperty("userId"); expect(passport.missions[0].objectives[0]).not.toHaveProperty("ruleKey"); });
  it("refuse une progression incohérente avec le contrat", () => { expect(() => mapPassport({ ...input, summary: { ...input.summary, totalXp: -1 } })).toThrow(); });
});
