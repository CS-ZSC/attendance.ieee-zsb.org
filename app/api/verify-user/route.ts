import { NextResponse } from "next/server";
// import { db } from "@/lib/db"; // database connection

const users = [
  {
    id: "1",
    email: "norhan@test.com",
    national_id: "123456",
    name: "Norhan",
    teams: ["T&T"],
  },
  {
    id: "2",
    email: "ali@test.com",
    national_id: "654321",
    name: "Ali",
    teams: ["Media"],
  },
];

export async function POST(req: Request) {
  const { email, nationalId } = await req.json();

  //   const user = await db.user.findFirst({
  //     where: {
  //       email: email,
  //       national_id: nationalId,
  //     },
  //   });
  const user = users.find(
    (u) => u.email === email && u.national_id === nationalId,
  );

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or national ID" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    teams: user.teams,
  });
}
