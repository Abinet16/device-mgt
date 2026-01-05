export type JwtPayload = {
  userId: string;
  role: "ADMIN" | "MANAGER" | "VIEWER";
  orgId: string;
};
