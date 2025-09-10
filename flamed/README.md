This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Data accessible in supabase

| Name | Format | type |
|---| ---| --- |
| id | uuid | string |
| name | varchar | string |
| is_active | boolean | boolean |
| created_at | timestamp with time zone | string | 
| updated_at | timestamp with time zone | string |
| external_id | text | string |
| location_id | bigint | number |
| avg_rating | numeric | number |
| review_count | integer | number |
| status | text | string |
| status_text | text | string |
| price_tag | text | string |
| cuisines | text[] | array |
| has_menu | boolean | boolean |
| menu_url | text | string |
| parent_city | text | string |
| hero_img_url | text | string |
| square_img_url | text | string |
| thumbnail_template | text | string |
| review_snippets | jsonb | json |
| raw | jsonb | json |