import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db";
import { saveGameState } from "@/lib/game/game-state.server";
import { GameState } from "@/lib/game/schema/game_state";
import { completeOnboarding } from "@/lib/game/onboarding";
import { clerkIdToSteamshipHandle, getSteamshipClient } from "@/lib/utils";

export async function POST(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!process.env.STEAMSHIP_AGENT_VERSION) {
    return NextResponse.json(
      { error: "Please set the STEAMSHIP_AGENT_VERSION environment variable." },
      { status: 404 }
    );
  }

  var [_package, _version] = process.env.STEAMSHIP_AGENT_VERSION.split("@");

  console.log(
    `Creating instance of Steamship Package ${_package} at version ${_version}`
  );

  const config = await request.json();

  try {
    // Create a new agent instance.
    const steamship = getSteamshipClient();

    // Switch into the web user's workspace.
    const workspaceHandle = clerkIdToSteamshipHandle(userId);

    steamship.switchWorkspace({ workspace: workspaceHandle });

    console.log(`Switching to workspace: ${userId}`);

    const packageInstance = await steamship.package.createInstance({
      package: _package,
      version: _version,
      handle: workspaceHandle,
    });

    console.log(`New agent package instance: ${packageInstance}`);

    const agentUrl = await steamship.package.getBaseUrl(packageInstance);

    console.log(`New agent URL: ${agentUrl}`);

    const agent = await prisma.agents.create({
      data: {
        ownerId: userId!,
        agentUrl: agentUrl,
      },
    });

    await saveGameState(agent.agentUrl, config as GameState);
    await completeOnboarding(agent.agentUrl);
    return NextResponse.json({ agent }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create agent." },
      { status: 404 }
    );
  }
}
