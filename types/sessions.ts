export type Session = {
  id: string;
  title: string;
  created_at: string;
  created_by?: string;
};

export type SessionDetails = {
  id: string;
  title: string;
  team: string;
  qr_token: string;
  created_at: string;
};

export type Member = {
  name: string;
  email: string;
  attended: boolean;
};

export type SessionDetailsResponse = {
  session: SessionDetails;
  users: Member[];
};
