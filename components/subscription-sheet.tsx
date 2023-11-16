"use client";

import { FlameIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TypographyH1 } from "./ui/typography/TypographyH1";
import { TypographyH3 } from "./ui/typography/TypographyH3";
import { TypographyLead } from "./ui/typography/TypographyLead";
import { TypographyP } from "./ui/typography/TypographyP";

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
      <section className="pt-4">
        <TypographyH3>Subscribe and Save</TypographyH3>
        <TypographyLead>$5.00 / month for 150 Energy / month</TypographyLead>
        {subscriptionState == "loading" && (
          <div>Loading subscription details...</div>
        )}
        {subscriptionState == "error" && (
          <div>
            There was an error loading your subscription details. Please contact
            support@steamship.com.
          </div>
        )}
        {subscriptionState == "true" && (
          <form action="/api/stripe/visit-billing-portal" method="POST">
            <Button id="checkout-button" type="submit" className="mt-2">
              Manage Subscription
            </Button>
          </form>
        )}
        {subscriptionState == "false" && (
          <form action="/api/stripe/visit-checkout-portal" method="POST">
            <Button id="checkout-button" type="submit" className="mt-2">
              Subscribe
            </Button>
          </form>
        )}
      </section>
      <section className="pt-4">
        <TypographyH3>One-time Top Up</TypographyH3>
        <TypographyLead>$5.00 for 100 Energy</TypographyLead>
        <form
          action="/api/stripe/visit-checkout-portal?topUp=true"
          method="POST"
        >
          {" "}
          <Button id="checkout-button" type="submit" className="mt-2">
            Top-Up
          </Button>
        </form>
      </section>
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
    <div className="w-100% h-[100dvh] flex flex-col max-w-4xl mx-auto p-6">
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <TypographyH1 className="flex flex-row items-center text-orange-400">
          <FlameIcon size={64} className="mr-2 text-orange-400" />
          Energy Depot
        </TypographyH1>
        <TypographyP>
          Your player gets XXX Free Energy a month to use on quests.
        </TypographyP>
        <TypographyP>
          Support the <b>open source development</b> of this game by filling up!
        </TypographyP>
        {notification}
        {result}
      </div>
    </div>
  );
};

export default SubscriptionSheet;
