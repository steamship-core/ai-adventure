# AI ADVENTURE ✨✨

A customizable Generative AI Adventure Game.

- 🪄 Everything generated on the fly: story, images, & music
- 🎭 Swappable generative models
- 📱 Mobile-first layout
- 💰 Payment-ready
- 🚀 Sharing-ready -- share generated adventure storybooks on Twitter

This game uses:

1. [Clerk](https://clerk.com/) for authentication
2. [Vercel](https://vercel.com/) for web hosting
3. [Steamship](https://steamship.com/) for AI hosting
4. [Stripe](https://stripe.com/) for payments
5. [FAL.ai](https://fal.ai/) for Stable Diffusion hosting
6. [Civit.ai](https://civit.ai/) for hot-loaded Models & LoRAs
7. [OpenAI](https://openai.com/) for LLM hosting
8. [Replicate](https://replicate.com/) for Music Generation
9. [Shadcn](https://ui.shadcn.com/) for ui

This README contains the following sections:

1. [Deployment](#deployment) - Takes about five minutes to be up and running!
2. [Running on Localhost](#running-on-localhost) - Run the game on localhost.
3. [Customization](#customization) - Skin the game with custom models, prompts, and themes.
4. [Advanced Customization](#advanced-customization) - Modify and re-deploy the game engine itself.
5. [Learn More](#learn-more) - Links to our development community

## Deployment

**Important!** After your initial deployment, you'll need to [configure your database](#configure-postgres)

Once you have access to [the environment variables you'll need](#set-up-environment-variables), deploy the example using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/steamship-core/ai-adventure-game/tree/main&project-name=ai-adventure-game&repository-name=ai-adventure-game&env=CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,NEXT_PUBLIC_CLERK_SIGN_IN_URL,NEXT_PUBLIC_CLERK_SIGN_UP_URL,STEAMSHIP_API_KEY)

## Set up Environment Variables

### Configure Clerk

1. Create an account with [Clerk](https://clerk.com/)
2. Create a new project
3. Set the following env vars in Vercel

```
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### Configure Steamship

1. Create an account with [Steamship](https://steamship.com/)
2. Get your API Key [here](https://www.steamship.com/account/api)
3. Set the following env vars in Vercel:

```
STEAMSHIP_API_KEY=YOUR_API_KEY
```

## Configure PostGres

1. From Vercel, open your new project and select the "Storage" tab
2. Create a new postgres database
3. The environment variables should be automatically set now within vercel. You can verify this by navigating to project settings > environmental variables > looking for postgres related env vars.

More on setting up your database can be found here: https://vercel.com/docs/storage/vercel-postgres/quickstart.

### Configure PostGres Tables

We use prisma to talk to our database.

1. Install the vercel cli `npm i -g vercel`
2. Install repo dependencies `npm i`
3. Connect to Vercel `vercel link`. Follow the prompts to connect to the project you just created
4. Generate the prisma types: `npx prisma generate`

To update the production DB:

1. `vercel pull --environment=production`
2. Create the tables in the DB: `npm run prod:db-push`

TO update the development DB:

1. `vercel pull --environment=development`
2. Create the tables in the DB: `npm run dev:db-push`

### Finally: Redeploy your Application

After configuring your production database. Make sure to re-deploy your project.

You can do that by navigating to your project in Vercel and clicking the redeploy option.

### Optional: Configure Stripe

The game gives each user monthly free "Energy" to quest with, and offers paid plans to get more.

Get a Stripe API Key at [stripe.com](https://stripe.com) and then set the following environment variables:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PRICE_ID` - The Price ID of your monthly subscription plan
- `STRIPE_TOPUP_PRICE_ID` - The Price ID of your one-time top-up item
- `STRIPE_WEBHOOK_SECRET` - The Webhook secret for Stripe Events
- `NEXT_PUBLIC_WEB_BASE_URL` - The base URL of your deployment, without a trailing slash

If you don't set up Stripe, the game will still work, but players will have no way to add energy once it is depleted.

### Optional: Configure Axiom (Logging)

This game uses Axiom for cloud logging.

Get an Axiom API Key at [axiom.co](https://axiom.co) and then set the following environment variables:

- `NEXT_PUBLIC_AXIOM_TOKEN` - Your public Axiom token
- `NEXT_PUBLIC_AXIOM_DATASET` - Your Axiom logging dataset

### Optional: Configure Vercel Analytics

This game uses Vercel Analytics for user tracking.

Get a Vercel Analytics ID from your Vercel project page, and then set the following environment variables:

- `VERCEL_WEB_ANALYTICS_ID` - Your Vercel Analytics ID

## Running on Localhost

To run on localhost:

Install the required dependencies:

```
npm install
```

Make sure your `.env.local` file is set:

TODO(ted) - what's best practice for this?

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customization

### Customizing the Non-Generative Game UI

The non-generative portions of the Game UI are all contained within this NextJS project.

You can start exploring by looking at the pages in `app/pages`.
When running on localhost, your browser will update automatically when you edit and save a file.

## Customizing Game Mechanics

> [!NOTE]  
> We are **very actively** working on a low-code game customization mechanism.
> Please join our [our discord](https://steamship.com/discord) to build-test with us!

To customize the models used to generate camp, profile, quest, and item images, edit the following files:

- `configuration/server_settings.js` - Models and their parameters
- `configuration/camp_image_prompt.js` - Camp image prompt

## Advanced Customization

The generative game engine is a [separate open-source project](https://github.com/steamship-core/ai-adventure-agent) deployed to [Steamship](https://steamship.com). It maintains most of the game state -- this web app is mostly a headless client.

By default, this Vercel project is configured to use Steamship's [officially supported version of the game engine](https://steamship.com/packages/ai-adventure-game).

If the modifications you with to make are beyond the provided settings of the official engine, you can easily fork, change, deploy, and use your own. Just follow these steps:

1. Fork the [game engine repository](https://github.com/steamship-core/ai-adventure-agent)
2. Make any modifications you wish.
3. Deploy it as your own Steamship package (`ship deploy`)
4. Change the `STEAMSHIP_AGENT_VERSION` environment variable in this Vercel project to match your own game engine's handle. If you want to pin it to a specific version, use `handle@version` format.

> [!NOTE]  
> This agent is under **very actively** development. We suggest focusing your changes on `quest_agent.py`
> Please join our [our discord](https://steamship.com/discord) to build-test with us!

## Learn More

This is an open source effort -- come join our quest!

We hang out in the [Steamship Discord](https://steamship.com/discord)

Related Repositories:

- **Web Interface** The web interface is at [steamship-core/ai-adventure-game](https://github.com/steamship-core/ai-adventure-game)
- **Game Engine** The game engine is at [steamship-packages/ai-adventure-game](https://github.com/steamship-packages/ai-adventure-game)
