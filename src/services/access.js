export class AccessRequestUnavailableError extends Error {
  constructor() {
    super("Access request endpoint is not configured.");
    this.name = "AccessRequestUnavailableError";
  }
}

export async function submitAccessRequest() {
  throw new AccessRequestUnavailableError();
}
