export interface IJwtPayload {
  id: string;
  platformRole: "user" | "admin" | "super_admin";
}