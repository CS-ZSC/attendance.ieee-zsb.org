export type Session = {
  id: string;
  title: string;
  team: string;
  team_slug?: string;
  created_at: string;
  created_by?: string;
  attended?: boolean;
};

export type SessionDetails = {
  id: string;
  title: string;
  team: string;
  qr_token: string;
  created_at: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  attended: boolean;
};

export type SessionDetailsResponse = {
  canEdit?: boolean;
  session: SessionDetails;
  users: Member[];
};
