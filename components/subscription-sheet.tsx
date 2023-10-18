"use client";

import { useUser } from "@clerk/nextjs";
import { ActivityIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { TypographyH1 } from "./ui/typography/TypographyH1";
import { TypographyH3 } from "./ui/typography/TypographyH3";
import { TypographyLead } from "./ui/typography/TypographyLead";
import { TypographyP } from "./ui/typography/TypographyP";

const ProductDisplay = () => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <>
      <section className="pt-4">
        <TypographyH3>Subscribe and Save</TypographyH3>
        <TypographyLead>$5.00 / month for 150 Energy / month</TypographyLead>
        <form action="/api/stripe/create-checkout-session" method="POST">
          <Button id="checkout-button" type="submit" className="mt-2">
            Subscribe
          </Button>
        </form>
        <form action="/api/stripe/visit-billing-portal" method="POST">
          <Button id="checkout-button" type="submit" className="mt-2">
            Manage Subscription
          </Button>
        </form>
      </section>
      <section className="pt-4">
        <TypographyH3>One-time Top Up</TypographyH3>
        <TypographyLead>$5.00 for 100 Energy</TypographyLead>
        <form
          action="/api/stripe/create-checkout-session?topUp=true"
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

const SuccessDisplay = ({ sessionId }: { sessionId: string }) => {
  return (
    <section>
      <div className="product Box-root">
        <div className="description Box-root">
          <TypographyH3>Subscription to starter plan successful!</TypographyH3>
        </div>
      </div>
      <p>Check your email for a receipt.</p>
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

  if (!success && message === "") {
    result = <ProductDisplay />;
  } else if (success && session_Id !== "") {
    result = <SuccessDisplay sessionId={session_Id} />;
  } else {
    result = <Message message={message} />;
  }

  return (
    <div className="w-100% h-[100dvh] flex flex-col max-w-4xl mx-auto p-6">
      <div className="flex flex-col space-y-2 text-center sm:text-left">
        <TypographyH1 className="flex flex-row items-center text-indigo-400">
          <ActivityIcon size={64} className="mr-2 text-indigo-400" />
          Energy Depot
        </TypographyH1>
        <TypographyP>
          Your player gets XXX Free Energy a month to use on quests.
        </TypographyP>
        <TypographyP>
          Support the <b>open source development</b> of this game by filling up!
        </TypographyP>
        {result}
      </div>
    </div>
  );
};

export default SubscriptionSheet;
