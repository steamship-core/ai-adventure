import LandingFooter from "@/components/landing/footer";
import Nav from "@/components/landing/nav";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Copyright Policy - AI Adventure",
  description: "See our copyright policy and how it relates to you.",
};

function Copyright() {
  return (
    <div className="space-y-6">
      <h1>Copyright Policy</h1>
      <p className="italic">Last Updated: April 2, 2023</p>
      <p>
        Steamship respects intellectual property rights and expects its users to
        do the same.
      </p>

      <p>
        If you are a copyright holder, or its agent, and you believe that any
        text, graphics, photos, audio, videos or other materials or works
        uploaded, downloaded or appearing on the Steamship Services have been
        copied in a way that constitutes infringement of your copyrighted work,
        you may submit a notification to our copyright agent in accordance with
        17 USC 512(c) of the Digital Millennium Copyright Act (the “DMCA”), by
        providing the following information in writing, in as much detail as
        possible:
      </p>
      <div className="ml-5 space-y-6">
        <p>
          <span className="font-bold">(a)</span> identification of the
          copyrighted work that is claimed to be infringed;
        </p>
        <p>
          <span className="font-bold">(b)</span> identification of the allegedly
          infringing material that is requested to be removed, including a
          description of where it is located on the Service;
        </p>
        <p>
          <span className="font-bold">(c)</span> information for our copyright
          agent to contact you, such as an address, telephone number and e-mail
          address;
        </p>
        <p>
          <span className="font-bold">(d)</span> a statement that you have a
          good faith belief that the identified, allegedly infringing use is not
          authorized by the copyright owners, its agent or the law;
        </p>
        <p>
          <span className="font-bold">(e)</span> a statement that the
          information above is accurate, and under penalty of perjury, that you
          are the copyright owner or the authorized person to act on behalf of
          the copyright owner; and
        </p>
        <p>
          <span className="font-bold">(f)</span> the physical or electronic
          signature of a person authorized to act on behalf of the owner of the
          copyright or of an exclusive right that is allegedly infringed.
        </p>
      </div>
      <p>Notices of copyright infringement claims should be sent by mail to:</p>
      <div className="ml-5">
        Steamship, Attn: Copyright
        <br />
        1321 Upland Dr. PMB 19426
        <br />
        Houston, TX 77043
        <br />
        United States
      </div>
      <p>
        or by e-mail to:{" "}
        <Link href="mailto:copyright@steamship.com">
          copyright@steamship.com
        </Link>
        .
      </p>
      <p>
        It is our policy, in appropriate circumstances and at our discretion, to
        disable or terminate the accounts of users who repeatedly infringe
        copyrights or intellectual property rights of others.
      </p>
      <p>
        A user of the Services who has uploaded or posted materials identified
        as infringing as described above may supply a counter-notification
        pursuant to sections 512(g)(2) and (3) of the DMCA. When we receive a
        counter-notification, we may reinstate the posts or material in
        question, in our sole discretion. To file a counter-notification with
        us, you must provide a written communication (by fax or regular mail or
        by email) that sets forth all of the items required by sections
        512(g)(2) and (3) of the DMCA. Please note that you will be liable for
        damages if you materially misrepresent that content or an activity is
        not infringing the copyrights of others.
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto">
      <Nav />
      <div className="prose dark:prose-invert mx-auto">
        <Copyright />
      </div>
      <LandingFooter />
    </div>
  );
}
