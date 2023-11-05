"use client";

import Container from "@/components/Container";
import { Input } from "@/components/input/Input";
import { RadioInput } from "@/components/input/RadioInput";
import { SwitchInput } from "@/components/input/SwitchInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useOverlaySettingsStore } from "@/store/overlaySettingsStore";
import useStore from "@/utils/useStore";
import Link from "next/link";

/**
 * Opens the overlay with the current settings
 *
 * @param settings the settings to pass to the overlay
 */
function goToOverlay(settings: any) {
  window.open(`/overlay?data=${JSON.stringify(settings)}`, "_blank");
}

export default function Analytics() {
  const settingsStore = useStore(useOverlaySettingsStore, (store) => store);
  if (!settingsStore) return null;

  return (
    <main>
      <Container>
        <Card className="mt-2">
          <CardTitle className="p-3">
            <h1>Overlay Builder</h1>
          </CardTitle>

          <CardContent>
            <div className="mb-2">
              <p>
                Confused on how to use this? Check out the{" "}
                <span className="transform-gpu text-pp-blue transition-all hover:opacity-80">
                  <Link href={"https://www.youtube.com/watch?v=IjctLf1nX8w"}>
                    tutorial
                  </Link>
                </span>
                .
              </p>
              <p>
                The overlay requires{" "}
                <span className="transform-gpu text-pp-blue transition-all hover:opacity-80">
                  <Link href={"https://github.com/denpadokei/HttpSiraStatus"}>
                    HttpSiraStatus
                  </Link>
                </span>
              </p>
            </div>

            <Input
              id="ip-address"
              label="IP Address"
              defaultValue={settingsStore.ipAddress}
              onChange={(e) => {
                settingsStore.setIpAddress(e);
              }}
            />
            <Input
              id="account-id"
              label="Account ID"
              defaultValue={settingsStore.accountId}
              onChange={(e) => {
                settingsStore.setAccountId(e);
              }}
            />

            <RadioInput
              id="platform"
              label="Platform"
              defaultValue={settingsStore.platform}
              items={[
                {
                  id: "scoresaber",
                  value: "ScoreSaber",
                },
                {
                  id: "beatleader",
                  value: "BeatLeader",
                },
              ]}
              onChange={(value) => {
                settingsStore.setPlatform(value);
              }}
            />

            <div className="mt-2">
              <Label>Settings</Label>
              <SwitchInput
                id="show-player-stats"
                label="Show Player Stats"
                defaultChecked={settingsStore.settings.showPlayerStats}
                onChange={(value) => {
                  settingsStore.setShowPlayerStats(value);
                }}
              />
              <SwitchInput
                id="show-song-info"
                label="Show Song Info"
                defaultChecked={settingsStore.settings.showSongInfo}
                onChange={(value) => {
                  settingsStore.setShowSongInfo(value);
                }}
              />
              <SwitchInput
                id="show-score-stats"
                label="Show Song Stats"
                defaultChecked={settingsStore.settings.showScoreStats}
                onChange={(value) => {
                  settingsStore.setShowScoreStats(value);
                }}
              />
            </div>

            <Button
              className="mt-3"
              onClick={() => {
                goToOverlay(settingsStore);
              }}
            >
              Open Overlay
            </Button>
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
