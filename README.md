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

## Customization

### Customizing the Non-Generative Game UI

The non-generative portions of the Game UI are all contained within this NextJS project.

### Customizing Generated Images

To customize the models used to generate camp, profile, quest, and item images, edit the following files:

- `configuration/server_settings.js` - Models and their parameters
- `configuration/camp_image_prompt.js` - Camp image prompt
- `configuration/item_image_prompt.js` - Item image prompt
- `configuration/profile_image_prompt.js` - Profile image prompt
- `configuration/quest_background_image_prompt.js` - Quest background prompt

New games will automatically adopt these new settings.
To reset your running game to see these changes, click on your profile image and then click "Reset Game".

### Customizing Music

To customize the models used to generate music, edit the following files:

- `configuration/server_settings.js` - Models and their parameters
- `configuration/music_prompt.js` - Music prompt

New games will automatically adopt these new settings.
To reset your running game to see these changes, click on your profile image and then click "Reset Game".

### Customizing Generated Storyline

To customize the quest storyline, edit the following files:

- `configuration/server_settings.js` - Models and their parameters

New games will automatically adopt these new settings.
To reset your running game to see these changes, click on your profile image and then click "Reset Game".

## Advanced Customization

The generative game engine is a [separate open-source project](https://github.com/steamship-packages/ai-adventure-game) deployed to [Steamship](https://steamship.com). It maintains most of the game state -- this web app is mostly a headless client.

By default, this Vercel project is configured to use Steamship's [officially supported version of the game engine](https://steamship.com/packages/ai-adventure-game).

If the modifications you with to make are beyond the provided settings of the official engine, you can easily fork, change, deploy, and use your own. Just follow these steps:

1. Fork the [game engine repository](https://github.com/steamship-packages/ai-adventure-game)
2. Make any modifications you wish
3. Deploy it as your own Steamship package (`ship deploy`)
4. Change the `STEAMSHIP_AGENT_VERSION` environment variable in this Vercel project to match your own game engine's handle. If you want to pin it to a specific version, use `handle@version` format.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
