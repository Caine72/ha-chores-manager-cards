import { describe, expect, it, vi } from "vitest";

import { sendMessagePromiseDeduped } from "./websocket";
import type { HomeAssistant } from "./types";

type Connection = NonNullable<HomeAssistant["connection"]>;

describe("WebSocket request coalescing", () => {
  it("shares identical reads while they are in flight", async () => {
    let resolveRequest: ((value: { points: number }) => void) | undefined;
    const pending = new Promise<{ points: number }>((resolve) => {
      resolveRequest = resolve;
    });
    const sendMessagePromise = vi.fn(() => pending);
    const connection = { sendMessagePromise } as Connection;
    const message = { type: "chores_manager/weekly_points", child_id: "kid_1" };

    const first = sendMessagePromiseDeduped(connection, message);
    const second = sendMessagePromiseDeduped(connection, message);

    expect(first).toBe(second);
    expect(sendMessagePromise).toHaveBeenCalledTimes(1);
    resolveRequest?.({ points: 3 });
    await first;

    await sendMessagePromiseDeduped(connection, message);
    expect(sendMessagePromise).toHaveBeenCalledTimes(2);
  });

  it("does not combine different child requests", async () => {
    const sendMessagePromise = vi.fn(async (message: Record<string, unknown>) => message);
    const connection = { sendMessagePromise } as Connection;

    await Promise.all([
      sendMessagePromiseDeduped(connection, {
        type: "chores_manager/current_week_history",
        child_id: "kid_1",
      }),
      sendMessagePromiseDeduped(connection, {
        type: "chores_manager/current_week_history",
        child_id: "kid_2",
      }),
    ]);

    expect(sendMessagePromise).toHaveBeenCalledTimes(2);
  });

  it("evicts failed requests so a retry reaches Home Assistant", async () => {
    const sendMessagePromise = vi
      .fn()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValueOnce({ points: 3 });
    const connection = { sendMessagePromise } as Connection;
    const message = { type: "chores_manager/weekly_points", child_id: "kid_1" };

    await expect(sendMessagePromiseDeduped(connection, message)).rejects.toThrow("temporary");
    await expect(sendMessagePromiseDeduped(connection, message)).resolves.toEqual({ points: 3 });
    expect(sendMessagePromise).toHaveBeenCalledTimes(2);
  });
});
