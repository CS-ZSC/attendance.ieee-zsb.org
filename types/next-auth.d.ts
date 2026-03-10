import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      teams: string[];
    };
  }

  interface User {
    id: string;
    teams: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    teams: string[];
  }
}
