import type { HomeAssistant } from "./types";

type Connection = NonNullable<HomeAssistant["connection"]>;

const inFlightRequests = new WeakMap<Connection, Map<string, Promise<unknown>>>();

export function sendMessagePromiseDeduped<T>(
  connection: Connection,
  message: Record<string, unknown>,
): Promise<T> {
  let requests = inFlightRequests.get(connection);
  if (!requests) {
    requests = new Map<string, Promise<unknown>>();
    inFlightRequests.set(connection, requests);
  }

  const key = JSON.stringify(message);
  const existing = requests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }

  const request = connection.sendMessagePromise<T>(message);
  requests.set(key, request);
  const clear = () => {
    if (requests?.get(key) === request) {
      requests.delete(key);
      if (!requests.size) {
        inFlightRequests.delete(connection);
      }
    }
  };
  void request.then(clear, clear);
  return request;
}
