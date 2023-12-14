import LandingFooter from "@/components/landing/footer";
import Nav from "@/components/landing/nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - AI Adventure",
  description: "See our privacy policy and how it relates to you.",
};

function PrivacyPolicy() {
  return (
    <div className={"space-y-6"}>
      <h1>Privacy Policy</h1>
      <p>
        <strong>PRIVACY NOTICE</strong> <br />
        &nbsp;
        <strong>Last updated 29 Oct 2023</strong> <br /> <br />
        &nbsp;
      </p>
      <div className={"space-y-6"}>
        This privacy notice for Steamship Inc. (&quot;<strong>we</strong>,&quot;
        &quot;
        <strong>us</strong>,&quot; or &quot;<strong>our</strong>&quot;),
        describes how and why we might collect, store, use, and/or share (&quot;
        <strong>process</strong>&quot;) your information when you use our
        services (&quot;<strong>Services</strong>&quot;), such as when you:
        <div className={"space-y-6"}>
          <div>
            <strong>Questions or concerns?&nbsp;</strong>Reading this privacy
            notice will help you understand your privacy rights and choices. If
            you do not agree with our policies and practices, please do not use
            our Services.
          </div>
          <div>
            <strong>SUMMARY OF KEY POINTS</strong>
          </div>
          <div>
            <strong>
              <em>
                This summary provides key points from our privacy notice, but
                you can find out more details about any of these topics by
                clicking the link following each key point or by using our&nbsp;
              </em>
            </strong>
            <a href="#toc" data-custom-class="link">
              <strong>
                <em>table of contents</em>
              </strong>
            </a>
            <strong>
              <em>&nbsp;below to find the section you are looking for.</em>
            </strong>
          </div>
          <div>
            <strong>What personal information do we process?</strong> When you
            visit, use, or navigate our Services, we may process personal
            information depending on how you interact with us and the Services,
            the choices you make, and the products and features you use. Learn
            more about&nbsp;
            <a href="#personalinfo" data-custom-class="link">
              personal information you disclose to us
            </a>
            .
          </div>
          <div>
            <strong>Do we process any sensitive personal information?</strong>{" "}
            We do not process sensitive personal information.
          </div>
          <div>
            <strong>Do we receive any information from third parties?</strong>{" "}
            We may receive information from public databases, marketing
            partners, social media platforms, and other outside sources. Learn
            more about&nbsp;
            <a href="#othersources" data-custom-class="link">
              information collected from other sources
            </a>
            .
          </div>
          <div>
            <strong>How do we process your information?</strong> We process your
            information to provide, improve, and administer our Services,
            communicate with you, for security and fraud prevention, and to
            comply with law. We may also process your information for other
            purposes with your consent. We process your information only when we
            have a valid legal reason to do so. Learn more about&nbsp;
            <a href="#infouse" data-custom-class="link">
              how we process your information
            </a>
            .
          </div>
          <div>
            <strong>
              In what situations and with which parties do we share personal
              information?
            </strong>
            &nbsp; We may share information in specific situations and with
            specific third parties. Learn more about&nbsp;
            <a href="#whoshare" data-custom-class="link">
              when and with whom we share your personal information
            </a>
            .
          </div>
          <div>
            <strong>What are your rights?</strong> Depending on where you are
            located geographically, the applicable privacy law may mean you have
            certain rights regarding your personal information. Learn more
            about&nbsp;
            <a href="#privacyrights" data-custom-class="link">
              your privacy rights
            </a>
            .
          </div>
          <div>
            <strong>How do you exercise your rights?</strong> The easiest way to
            exercise your rights is by submitting a&nbsp;
            <a
              href="https://app.termly.io/notify/265b122e-05d8-44de-8df6-e7daaa5d3026"
              target="_blank"
              rel="noopener noreferrer"
              data-custom-class="link"
            >
              data subject access request
            </a>
            , or by contacting us. We will consider and act upon any request in
            accordance with applicable data protection laws.
          </div>
          <div>
            Want to learn more about what we do with any information we
            collect?&nbsp;
            <a href="#toc" data-custom-class="link">
              Review the privacy notice in full
            </a>
            .
          </div>
          <div>
            <strong>TABLE OF CONTENTS</strong>
          </div>
          <div>
            <a href="#infocollect" data-custom-class="link">
              1. WHAT INFORMATION DO WE COLLECT?
            </a>
          </div>
          <div>
            <a href="#infouse" data-custom-class="link">
              2. HOW DO WE PROCESS YOUR INFORMATION?
            </a>
          </div>
          <div>
            <a href="#whoshare" data-custom-class="link">
              3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </a>
          </div>
          <div>
            <a href="#cookies" data-custom-class="link">
              4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
            </a>
          </div>
          <div>
            <a href="#sociallogins" data-custom-class="link">
              5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?
            </a>
          </div>
          <div>
            <a href="#intltransfers" data-custom-class="link">
              6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
            </a>
          </div>
          <div>
            <a href="#inforetain" data-custom-class="link">
              7. HOW LONG DO WE KEEP YOUR INFORMATION?
            </a>
          </div>
          <div>
            <a href="#infominors" data-custom-class="link">
              8. DO WE COLLECT INFORMATION FROM MINORS?
            </a>
          </div>
          <div>
            <a href="#privacyrights" data-custom-class="link">
              9. WHAT ARE YOUR PRIVACY RIGHTS?
            </a>
          </div>
          <div>
            <a href="#DNT" data-custom-class="link">
              10. CONTROLS FOR DO-NOT-TRACK FEATURES
            </a>
          </div>
          <div>
            <a href="#policyupdates" data-custom-class="link">
              11. DO WE MAKE UPDATES TO THIS NOTICE?
            </a>
          </div>
          <div>
            <a href="#contact" data-custom-class="link">
              12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
            </a>
          </div>
          <div>
            <a href="#request" data-custom-class="link">
              13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM
              YOU?
            </a>
          </div>
          <div>
            <strong>1. WHAT INFORMATION DO WE COLLECT?</strong>
          </div>
          <div>
            <strong>Personal information you disclose to us</strong>
          </div>
        </div>
        <div>
          <strong>
            <em>In Short:</em>
          </strong>
          <strong />
          <em>We collect personal information that you provide to us.</em>
        </div>
      </div>
      <div>
        We collect personal information that you voluntarily provide to us when
        you register on the Services,&nbsp;express an interest in obtaining
        information about us or our products and Services, when you participate
        in activities on the Services, or otherwise when you contact us.
      </div>
      <div>
        <strong>Sensitive Information.</strong> We do not process sensitive
        information.
      </div>
      <div>
        All personal information that you provide to us must be true, complete,
        and accurate, and you must notify us of any changes to such personal
        information.
      </div>
      <div>
        <strong>Information automatically collected</strong>
      </div>
      <div>
        <strong>
          <em>In Short:</em>
        </strong>
        <strong />
        <em>
          Some information — such as your Internet Protocol (IP) address and/or
          browser and device characteristics — is collected automatically when
          you visit our Services.
        </em>
      </div>
      <div>
        We automatically collect certain information when you visit, use, or
        navigate the Services. This information does not reveal your specific
        identity (like your name or contact information) but may include device
        and usage information, such as your IP address, browser and device
        characteristics, operating system, language preferences, referring URLs,
        device name, country, location, information about how and when you use
        our Services, and other technical information. This information is
        primarily needed to maintain the security and operation of our Services,
        and for our internal analytics and reporting purposes.
      </div>
      <div>
        Like many businesses, we also collect information through cookies and
        similar technologies.&nbsp;
      </div>
      <div>
        <strong>2. HOW DO WE PROCESS YOUR INFORMATION?</strong>
      </div>
      <div>
        <strong>
          <em>In Short:&nbsp;</em>
        </strong>
        <em>
          We process your information to provide, improve, and administer our
          Services, communicate with you, for security and fraud prevention, and
          to comply with law. We may also process your information for other
          purposes with your consent.
        </em>
      </div>
      <div>
        <strong>
          We process your personal information for a variety of reasons,
          depending on how you interact with our Services, including:
        </strong>
        <div className={"space-y-6"}>
          <div>
            <strong>
              3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
            </strong>
          </div>
          <div>
            <strong>
              <em>In Short:</em>
            </strong>
            <em>
              &nbsp;We may share information in specific situations described in
              this section and/or with the following third parties.
            </em>
            &nbsp;
          </div>
          <div>
            We may need to share your personal information in the following
            situations:
          </div>
          <ul>
            <li>
              <strong>Business Transfers.</strong>&nbsp; We may share or
              transfer your information in connection with, or during
              negotiations of, any merger, sale of company assets, financing, or
              acquisition of all or a portion of our business to another
              company.
            </li>
          </ul>
          <div>
            <ul>
              <li>
                <strong>Affiliates.&nbsp;</strong>
                We may share your information with our affiliates, in which case
                we will require those affiliates to honor this privacy notice.
                Affiliates include our parent company and any subsidiaries,
                joint venture partners, or other companies that we control or
                that are under common control with us.
              </li>
            </ul>
            <ul>
              <li>
                <strong>Business Partners.</strong>&nbsp; We may share your
                information with our business partners to offer you certain
                products, services, or promotions.
              </li>
            </ul>
            <div className={"space-y-6"}>
              <div className={"space-y-6"}>
                <div>
                  <strong>
                    4. DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES?
                  </strong>
                </div>
                <div>
                  <strong>
                    <em>In Short:</em>
                  </strong>
                  <em>
                    &nbsp;We may use cookies and other tracking technologies to
                    collect and store your information.
                  </em>
                </div>
                <div>
                  We may use cookies and similar tracking technologies (like web
                  beacons and pixels) to access or store information. Specific
                  information about how we use such technologies and how you can
                  refuse certain cookies is set out in our Cookie Notice.
                </div>
                <div>
                  <strong>5. HOW DO WE HANDLE YOUR SOCIAL LOGINS?</strong>
                </div>
                <div className={"space-y-6"}>
                  <strong>
                    <em>In Short:&nbsp;</em>
                  </strong>
                  <em>
                    If you choose to register or log in to our Services using a
                    social media account, we may have access to certain
                    information about you.
                  </em>
                </div>
                <div>
                  Our Services offer you the ability to register and log in
                  using your third-party social media account details (like your
                  Facebook or Twitter logins). Where you choose to do this, we
                  will receive certain profile information about you from your
                  social media provider. The profile information we receive may
                  vary depending on the social media provider concerned, but
                  will often include your name, email address, friends list, and
                  profile picture, as well as other information you choose to
                  make public on such a social media platform.&nbsp;
                </div>
                <div>
                  We will use the information we receive only for the purposes
                  that are described in this privacy notice or that are
                  otherwise made clear to you on the relevant Services. Please
                  note that we do not control, and are not responsible for,
                  other uses of your personal information by your third-party
                  social media provider. We recommend that you review their
                  privacy notice to understand how they collect, use, and share
                  your personal information, and how you can set your privacy
                  preferences on their sites and apps.
                </div>
                <div>
                  <strong>
                    6. IS YOUR INFORMATION TRANSFERRED INTERNATIONALLY?
                  </strong>
                </div>
                <div>
                  <strong>
                    <em>In Short:&nbsp;</em>
                  </strong>
                  <em>
                    We may transfer, store, and process your information in
                    countries other than your own.
                  </em>
                </div>
                <div data-custom-class="body_text">
                  Our servers are located in. If you are accessing our Services
                  from outside, please be aware that your information may be
                  transferred to, stored, and processed by us in our facilities
                  and by those third parties with whom we may share your
                  personal information (see &quot;
                  <a href="#whoshare" data-custom-class="link">
                    WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                  </a>
                  &quot; above), in&nbsp;and other countries.
                </div>
                <div>
                  If you are a resident in the European Economic Area (EEA),
                  United Kingdom (UK), or Switzerland, then these countries may
                  not necessarily have data protection laws or other similar
                  laws as comprehensive as those in your country. However, we
                  will take all necessary measures to protect your personal
                  information in accordance with this privacy notice and
                  applicable law.
                </div>
                <div>
                  <strong>7. HOW LONG DO WE KEEP YOUR INFORMATION?</strong>
                </div>
                <div>
                  <strong>
                    <em>In Short:&nbsp;</em>
                  </strong>
                  <em>
                    We keep your information for as long as necessary to fulfill
                    the purposes outlined in this privacy notice unless
                    otherwise required by law.
                  </em>
                </div>
                <div>
                  We will only keep your personal information for as long as it
                  is necessary for the purposes set out in this privacy notice,
                  unless a longer retention period is required or permitted by
                  law (such as tax, accounting, or other legal requirements).
                </div>
                <div>
                  When we have no ongoing legitimate business need to process
                  your personal information, we will either delete or anonymize
                  such information, or, if this is not possible (for example,
                  because your personal information has been stored in backup
                  archives), then we will securely store your personal
                  information and isolate it from any further processing until
                  deletion is possible.
                </div>
                <div>
                  <strong>8. DO WE COLLECT INFORMATION FROM MINORS?</strong>
                </div>
                <div>
                  <strong>
                    <em>In Short:</em>
                  </strong>
                  <em>
                    &nbsp;We do not knowingly collect data from or market to
                    children under 18 years of age.
                  </em>
                </div>
                <div>
                  We do not knowingly solicit data from or market to children
                  under 18 years of age. By using the Services, you represent
                  that you are at least 18 or that you are the parent or
                  guardian of such a minor and consent to such minor dependent’s
                  use of the Services. If we learn that personal information
                  from users less than 18 years of age has been collected, we
                  will deactivate the account and take reasonable measures to
                  promptly delete such data from our records. If you become
                  aware of any data we may have collected from children under
                  age 18, please contact us at support@steamship.com.
                </div>
                <div>
                  <strong>9. WHAT ARE YOUR PRIVACY RIGHTS?</strong>
                </div>
                <div>
                  <strong>
                    <em>In Short:</em>
                  </strong>
                  <em>
                    &nbsp;&nbsp;You may review, change, or terminate your
                    account at any time.
                  </em>
                </div>
                <div>
                  <strong>
                    <u>Withdrawing your consent:</u>
                  </strong>
                  &nbsp; If we are relying on your consent to process your
                  personal information, which may be express and/or implied
                  consent depending on the applicable law, you have the right to
                  withdraw your consent at any time. You can withdraw your
                  consent at any time by contacting us by using the contact
                  details provided in the section &quot;
                  <a href="#contact" data-custom-class="link">
                    HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                  </a>
                  &quot; below.
                </div>
                <div>
                  However, please note that this will not affect the lawfulness
                  of the processing before its withdrawal nor, when applicable
                  law allows, will it affect the processing of your personal
                  information conducted in reliance on lawful processing grounds
                  other than consent.
                </div>
                <div>
                  <strong>Account Information</strong>
                </div>
                <div>
                  If you would at any time like to review or change the
                  information in your account or terminate your account, you
                  can:
                </div>
                <div>
                  Upon your request to terminate your account, we will
                  deactivate or delete your account and information from our
                  active databases. However, we may retain some information in
                  our files to prevent fraud, troubleshoot problems, assist with
                  any investigations, enforce our legal terms and/or comply with
                  applicable legal requirements.&nbsp;
                </div>
                <div>
                  <strong>10. CONTROLS FOR DO-NOT-TRACK FEATURES</strong>
                </div>
                <div>
                  Most web browsers and some mobile operating systems and mobile
                  applications include a Do-Not-Track (&quot;DNT&quot;) feature
                  or setting you can activate to signal your privacy preference
                  not to have data about your online browsing activities
                  monitored and collected. At this stage no uniform technology
                  standard for recognizing and implementing DNT signals has been
                  finalized. As such, we do not currently respond to DNT browser
                  signals or any other mechanism that automatically communicates
                  your choice not to be tracked online. If a standard for online
                  tracking is adopted that we must follow in the future, we will
                  inform you about that practice in a revised version of this
                  privacy notice.
                </div>
                <div>
                  <strong>11. DO WE MAKE UPDATES TO THIS NOTICE?</strong>
                </div>
                <div>
                  <em>
                    <strong>In Short:&nbsp;</strong>
                    Yes, we will update this notice as necessary to stay
                    compliant with relevant laws.
                  </em>
                </div>
                <div>
                  We may update this privacy notice from time to time. The
                  updated version will be indicated by an updated
                  &quot;Revised&quot; date and the updated version will be
                  effective as soon as it is accessible. If we make material
                  changes to this privacy notice, we may notify you either by
                  prominently posting a notice of such changes or by directly
                  sending you a notification. We encourage you to review this
                  privacy notice frequently to be informed of how we are
                  protecting your information.
                </div>
                <div>
                  <strong>12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</strong>
                </div>
                <div>
                  If you have questions or comments about this notice, you may
                  contact us by post at:
                </div>
                <div>1321 Upland Dr. PMB 19426</div>
                <div>Houston TX 77043</div>
                <div>
                  <strong>
                    13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE
                    COLLECT FROM YOU?
                  </strong>
                </div>
                <div>
                  Based on the applicable laws of your country, you may have the
                  right to request access to the personal information we collect
                  from you, change that information, or delete it. To request to
                  review, update, or delete your personal information, please
                  email a&nbsp; support@steamship.com.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="max-w-2xl mx-auto">
      <Nav />
      <div className="prose dark:prose-invert mx-auto">
        <PrivacyPolicy />
      </div>
      <LandingFooter />
    </div>
  );
}
