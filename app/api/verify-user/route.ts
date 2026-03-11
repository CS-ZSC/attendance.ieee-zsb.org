import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: Request) {
  const { email, nationalId } = await req.json();

  await connectDB();
  const user = await User.findOne({ email, national_id: nationalId });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or national ID" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });
}
