"use client";

import { CheckCircle2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TypographyH1 } from "./ui/typography/TypographyH1";
import { TypographyH3 } from "./ui/typography/TypographyH3";
import { TypographyLead } from "./ui/typography/TypographyLead";
import { TypographyMuted } from "./ui/typography/TypographyMuted";
const ProductDisplay = () => {
  const [subscriptionState, setSubscriptionState] = useState<
    "loading" | "error" | "true" | "false"
  >("loading");

  useEffect(() => {
    fetch("/api/stripe/get-subscription-status", { method: "POST" }).then(
      (response) => {
        response.json().then(
          (data) => {
            const { hasSubscription } = data;
            if (hasSubscription) {
              setSubscriptionState("true");
            } else {
              setSubscriptionState("false");
            }
          },
          (error) => {
            setSubscriptionState("error");
            console.error(error);
          }
        );
      },
      (error) => {
        setSubscriptionState("error");
        console.error(error);
      }
    );
  }, []);

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 w-full max-w-5xl mx-auto">
        <section
          className={"bg-background rounded-md text-left flex flex-col gap-4"}
        >
          <div className="relative rounded-t-md w-full aspect-video overflow-hidden">
            <Image
              src="/payments/big-chest.png"
              className="object-cover"
              fill
              alt="Chest"
            />
          </div>
          <div className="bg-background p-4 relative rounded-md flex flex-col gap-4">
            {subscriptionState == "true" && (
              <div className="absolute -top-3 right-4">
                <Badge>Active Plan</Badge>
              </div>
            )}
            <div className="flex items-center justify-between">
              <TypographyH3>Adventurer&apos;s Cache</TypographyH3>
              <TypographyMuted>
                <b className="text-white">$5</b> /m
              </TypographyMuted>
            </div>
            <TypographyLead className="flex gap-2 items-center">
              <CheckCircle2Icon />
              Image Generation
            </TypographyLead>
            <TypographyLead className="flex gap-2 items-center">
              <CheckCircle2Icon />
              Audio Generation
            </TypographyLead>
            <TypographyLead className="flex gap-2 items-center">
              <CheckCircle2Icon />
              150 Monthly Energy
            </TypographyLead>
            {subscriptionState == "loading" && (
              <div>Loading subscription details...</div>
            )}
            {subscriptionState == "error" && (
              <div>
                There was an error loading your subscription details. Please
                contact support@steamship.com.
              </div>
            )}
            {subscriptionState == "true" && (
              <form
                action="/api/stripe/visit-billing-portal"
                className="w-full"
                method="POST"
              >
                <Button
                  id="checkout-button"
                  type="submit"
                  className="mt-2 w-full"
                >
                  Manage Subscription
                </Button>
              </form>
            )}
            {subscriptionState == "false" && (
              <form
                action="/api/stripe/visit-checkout-portal"
                className="w-full"
                method="POST"
              >
                <Button
                  id="checkout-button"
                  type="submit"
                  className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </section>
        <section className="bg-background rounded-md text-left flex flex-col gap-4">
          <div className="relative rounded-t-md w-full aspect-video overflow-hidden">
            <Image
              src="/payments/potion.png"
              className="object-cover"
              fill
              alt="Potion"
            />
          </div>
          <div className="bg-background rounded-md p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <TypographyH3>Wanderer&apos;s Boost</TypographyH3>
              <TypographyMuted>
                <b className="text-white">$5</b>
              </TypographyMuted>
            </div>
            <TypographyLead className="flex gap-2 items-center">
              <CheckCircle2Icon />
              Image Generation
            </TypographyLead>
            <TypographyLead className="flex gap-2 items-center">
              <CheckCircle2Icon />
              Audio Generation
            </TypographyLead>
            <TypographyLead className="flex gap-2 items-center">
              <CheckCircle2Icon />
              100 One-Time Energy
            </TypographyLead>
            <form
              action="/api/stripe/visit-checkout-portal?topUp=true"
              method="POST"
              className="w-full"
            >
              <Button
                id="checkout-button"
                type="submit"
                className="mt-2 w-full"
              >
                Purchase Energy
              </Button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

const SuccessDisplay = ({
  message,
  sessionId,
}: {
  message: string;
  sessionId: string;
}) => {
  return (
    <section>
      <TypographyH3>{message}</TypographyH3>
    </section>
  );
};

const Message = ({ message }: { message: string }) => (
  <section>
    <p>{message}</p>
  </section>
);

const SubscriptionSheet = () => {
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [session_Id, setSessionId] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setSuccess(true);
      if (query.get("topUp") === "true") {
        setMessage("Top Up Successful!");
      } else {
        setMessage("Subscription successful!");
      }
      const _s = query.get("session_id");
      if (_s) {
        setSessionId(_s);
      }
    }
    if (query.get("canceled")) {
      setSuccess(false);
      setMessage("Order canceled");
    }
  }, [session_Id]);

  let result = <></>;
  let notification = <></>;

  if (!success && message === "") {
    result = <ProductDisplay />;
  } else if (success && session_Id !== "") {
    notification = <SuccessDisplay message={message} sessionId={session_Id} />;
    result = <ProductDisplay />;
  } else {
    result = <Message message={message} />;
  }

  return (
    <div className="w-full flex flex-col p-6 pt-20">
      <div className="flex flex-col gap-28 text-center">
        <div className="max-w-xl flex mx-auto flex-col gap-16">
          <TypographyH1>Power Up Your Adventure</TypographyH1>
          <TypographyMuted className="text-2xl">
            Unlock extended playtime and enhanced experiences. Choose an option
            that best fits your journey and keeps your adventure going.
          </TypographyMuted>
        </div>
        {notification}
        {result}
      </div>
    </div>
  );
};

export default SubscriptionSheet;
