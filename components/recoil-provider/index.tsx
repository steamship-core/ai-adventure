"use client";
import { GameState } from "@/lib/game/schema/game_state";
import { ReactNode } from "react";
import { RecoilRoot, SetRecoilState, atom } from "recoil";

export const recoilGameState = atom({
  key: "GameState",
  default: {} as GameState,
});

function initializeState(set: SetRecoilState, gameState: GameState) {
  set(recoilGameState, gameState);
}

function RecoilProvider({
  children,
  gameState,
}: {
  children: ReactNode;
  gameState: GameState;
}) {
  return (
    <RecoilRoot initializeState={({ set }) => initializeState(set, gameState)}>
      {children}
    </RecoilRoot>
  );
}

export default RecoilProvider;
