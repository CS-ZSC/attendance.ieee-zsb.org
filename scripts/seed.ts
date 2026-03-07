import "dotenv/config";
import { readFileSync } from "fs";
import { join } from "path";
import mongoose from "mongoose";
import { Team } from "../models/Team";
import { User } from "../models/User";

// Load extracted data
const dataPath = join(__dirname, "data.json");
const { teams: teamNames, members } = JSON.parse(readFileSync(dataPath, "utf-8")) as {
    teams: string[];
    members: { name: string; email: string; phone: string; national_id: string; position: string; teams: string[] }[];
};

async function seed() {
    const uri = process.env.DATABASE_URL;
    if (!uri) {
        console.error("DATABASE_URL is not set in .env");
        process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    // Clear old data
    await User.deleteMany({});
    await Team.deleteMany({});

    // Insert teams
    const teams = await Team.insertMany(teamNames.map((name) => ({ name })));
    const teamMap = new Map(teams.map((t) => [t.name, t._id]));

    // Insert users
    const docs = members.map((m) => ({
        name: m.name,
        email: m.email,
        phone: m.phone,
        national_id: m.national_id,
        position: m.position,
        teams: m.teams.map((t) => teamMap.get(t)).filter(Boolean),
    }));

    await User.insertMany(docs);
    console.log(`Seeded ${teams.length} teams and ${docs.length} users`);

    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
