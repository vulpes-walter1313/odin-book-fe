export type ErrorResType = {
  success: false;
  error: {
    code: "VALIDATION_ERROR" | "FORBIDDEN" | "BANNED" | "UNAUTHORIZED";
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details: any;
  };
  validationError?: {
    [key: string]: {
      type: string;
      value: string;
      msg: string;
      path: string;
      location: string;
    };
  };
};

export class BannedError extends Error {
  bannedUntil: Date | undefined;
  constructor(msg: string, bannedUntil?: string) {
    super(msg);
    if (bannedUntil) {
      this.bannedUntil = new Date(bannedUntil);
    }
    this.name = "Banned Error";
  }
}

export class NoAccessTokenError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "NoAccessTokenError";
  }
}
