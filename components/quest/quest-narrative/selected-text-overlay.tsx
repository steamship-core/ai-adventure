import { createSnippet } from "@/app/actions/snippet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TypographyMuted } from "@/components/ui/typography/TypographyMuted";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

function useSelectedText(divId: string) {
  const [selectedText, setSelectedText] = useState<string | undefined>();

  useEffect(() => {
    function handleMouseUp(event: any) {
      let isWithinDialog = false;
      let currentElement = event.target;
      while (currentElement) {
        if (currentElement.getAttribute("role") === "dialog") {
          isWithinDialog = true;
          break;
        }
        currentElement = currentElement.parentElement;
      }
      let isWithinInput;

      // Verify that the mouse up event is not within a text input
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        isWithinDialog = true;
      }

      if (!(isWithinDialog || isWithinInput)) {
        const text = window.getSelection()?.toString().trim();
        setSelectedText(text);
      } else {
        setSelectedText("");
      }
    }

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [divId]);

  return { selectedText, setSelectedText };
}

const SelectedTextOverlay = ({
  divId,
  adventureId,
}: {
  divId: string;
  adventureId: string;
}) => {
  const { toast } = useToast();

  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedText, setSelectedText } = useSelectedText(divId);
  // Only enabel this for logged in users
  const user = useUser();
  const shareSnippet = async (e: any) => {
    if (!selectedText) return null;
    if (!user) return null;
    setIsLoading(true);
    const snippet = await createSnippet(selectedText, adventureId);
    setIsLoading(false);
    setIsSharing(false);
    toast({
      title: "Shared Snippet",
      description: <span className="line-clamp-2">{snippet.text}</span>,
      variant: "success",
      duration: 2000,
    });
    setSelectedText("");
  };

  if (!selectedText) return null;
  if (!user) return null;

  return (
    <>
      <div className="absolute top-0 left-0 w-full z-50 px-2">
        <div className="flex flex-col gap-2 rounded-md bg-foreground p-2 text-background">
          <TypographyMuted>Share snippet</TypographyMuted>
          <Button variant="secondary" onClick={() => setIsSharing(true)}>
            <span className=" line-clamp-1">
              Share: &quot;{selectedText}&quot;
            </span>
          </Button>
        </div>
      </div>
      <AlertDialog
        open={isSharing}
        onOpenChange={(o) => {
          setIsSharing(o);
          if (!o) {
            setSelectedText("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              Share Snippet
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Share snippets with the community. Snippets are a great way to
              share your favorite parts of an adventure with others.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="border rounded-md text-muted-foreground italic p-3 text-sm flex">
            <span className="line-clamp-5">{selectedText}</span>
          </div>
          <Button type="button" onClick={shareSnippet} disabled={isLoading}>
            {isLoading ? "Sharing..." : "Share Snippet"}
          </Button>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SelectedTextOverlay;
