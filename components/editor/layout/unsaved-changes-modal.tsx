"use client";

import {
  recoilUnsavedChangesExist,
  recoilUnsavedDepartureUrl,
} from "@/components/providers/recoil";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRecoilState } from "recoil";

const EditorUnsavedChangesModal = () => {
  const [unsavedDepartureUrl, setUnsavedDepartureUrl] = useRecoilState(
    recoilUnsavedDepartureUrl
  );
  const [, setUnsavedChangesExist] = useRecoilState(recoilUnsavedChangesExist);

  return (
    <Dialog open={typeof unsavedDepartureUrl != "undefined"}>
      <DialogContent showClose={false}>
        <DialogHeader>
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            Are you sure you want to navigate away before saving?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {unsavedDepartureUrl && (
            <Link
              href={unsavedDepartureUrl!}
              onClick={(e) => {
                setUnsavedDepartureUrl(undefined);
                setUnsavedChangesExist(false);
              }}
            >
              <Button>Yes</Button>
            </Link>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              setUnsavedDepartureUrl(undefined);
            }}
          >
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditorUnsavedChangesModal;
