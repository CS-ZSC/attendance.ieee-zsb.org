import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    teams: string[];
    managedTracks: string[];
    position?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    teams: string[];
    managedTracks: string[];
    position?: string;
  }
}
