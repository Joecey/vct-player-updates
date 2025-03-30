export type StaffProperties = {
  ign: string;
  region: "AMERICAS" | "EMEA" | "CN" | "PACIFIC";
  team: string;
  teamTag: string;
  role: "PLAYER" | "HEAD COACH" | "ADDITIONAL STAFF";
  firstName: string;
  lastName: string;
  endYear: number;
  active: boolean;
};

export type TableResult = {
  metadata: {
    playersMap: Map<string, StaffProperties>;
    staffCount: number;
    rowEntriesLength: number;
    skipped: number;
  };
};

export type KnownError = {
  message: string;
};
