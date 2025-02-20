![tailwind-nextjs-banner](/public/static/images/twitter-card.webp)

# Listen German Stories

[![GitHub Repo stars](https://img.shields.io/github/stars/irvingzamora28/listengermanstories?style=social)](https://GitHub.com/irvingzamora28/listengermanstories/stargazers/)
[![GitHub forks](https://img.shields.io/github/forks/irvingzamora28/listengermanstories?style=social)](https://GitHub.com/irvingzamora28/listengermanstories/network/)
[![Twitter URL](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Firvingzamora)](https://twitter.com/irvingzamora)
[![Sponsor](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&link=https://github.com/sponsors/irvingzamora28)](https://github.com/sponsors/irvingzamora28)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/irvingzamora28/listengermanstories)

This is a [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) based platform for learning German through listening to stories. The site features:

- German stories with text and audio
- Vocabulary building through context
- Text-to-speech functionality
- Easy content management with MDX
- Newsletter subscription for new stories

Check out the documentation below to get started.

Facing issues? Check the [FAQ page](https://github.com/irvingzamora28/listengermanstories/wiki) and do a search on past issues. Feel free to open a new issue if none has been posted previously.

Feature request? Check the past discussions to see if it has been brought up previously. Otherwise, feel free to start a new discussion thread. All ideas are welcomed!

## Features

- **Interactive Stories**: Read and listen to German stories with integrated text-to-speech
- **Vocabulary Building**: Learn new words in context
- **Content Management**: Easy to add new stories using MDX format
- **Responsive Design**: Optimized for all devices

## Examples

- [Demo Site](https://listengermanstories.vercel.app/) - this repo

Using the template? Feel free to create a PR and add your blog to this list.

## Motivation

I wanted to create a platform for learning German through listening to stories.

## Quick Start Guide

1. Try installing the starter using the new [Pliny project CLI](https://github.com/timlrx/pliny):

```bash
npm i -g @pliny/cli
pliny new --template=starter-blog my-blog
```

Alternatively to stick with the current version, TypeScript and Contentlayer:

```bash
npx degit 'irvingzamora28/listengermanstories#contentlayer'
```

or JS (official support)

```bash
npx degit https://github.com/irvingzamora28/listengermanstories.git
```

2. Personalize `siteMetadata.js` (site related information)
3. Modify the content security policy in `next.config.js` if you want to use
   any analytics provider or a commenting solution other than giscus.
4. Personalize `authors/default.md` (main author)
5. Modify `projectsData.js`
6. Modify `headerNavLinks.js` to customize navigation links
7. Add stories
8. Deploy on Vercel

## Installation

```bash
npm install
```

## Development

First, run the development server:

```bash
npm start
```

or

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Extend / Customize

`data/siteMetadata.js` - contains most of the site related information which should be modified for a user's need.

`data/authors/default.md` - default author information (required). Additional authors can be added as files in `data/authors`.

`data/projectsData.js` - data used to generate styled card on the projects page.

`data/headerNavLinks.js` - navigation links.

`data/logo.svg` - replace with your own logo.

`data/stories` - replace with your own stories.

`public/static` - store assets such as images and favicons.

`tailwind.config.js` and `css/tailwind.css` - contain the tailwind stylesheet which can be modified to change the overall look and feel of the site.

`css/prism.css` - controls the styles associated with the code blocks. Feel free to customize it and use your preferred prismjs theme e.g. [prism themes](https://github.com/PrismJS/prism-themes).

`components/social-icons` - to add other icons, simply copy an svg file from [Simple Icons](https://simpleicons.org/) and map them in `index.js`. Other icons use [heroicons](https://heroicons.com/).

`components/MDXComponents.js` - pass your own JSX code or React component by specifying it over here. You can then call them directly in the `.mdx` or `.md` file. By default, a custom link and image component is passed.

`layouts` - main templates used in pages.

`pages` - pages to route to. Read the [Next.js documentation](https://nextjs.org/docs) for more information.

`next.config.js` - configuration related to Next.js. You need to adapt the Content Security Policy if you want to load scripts, images etc. from other domains.

## Story

### Frontmatter

Frontmatter follows [Hugo's standards](https://gohugo.io/content-management/front-matter/).

Currently 7 fields are supported.

```
title (required)
date (required)
tags (required, can be empty array)
lastmod (optional)
draft (optional)
summary (optional)
images (optional, if none provided defaults to socialBanner in siteMetadata config)
authors (optional list which should correspond to the file names in `data/authors`. Uses `default` if none is specified)
layout (optional list which should correspond to the file names in `data/layouts`)
canonicalUrl (optional, canonical url for the post for SEO)
```

Here's an example of a story's frontmatter:

```
---
title: 'Die Geschichte von Hans und Anna'
date: '2022-01-01'
lastmod: '2022-01-02'
tags: ['deutsch', 'lernen']
draft: false
summary: 'Eine Geschichte über zwei Freunde, die Deutsch lernen.'
images: ['/static/images/deutsch/berlin.jpg', '/static/images/deutsch/munich.jpg']
authors: ['default']
layout: StoryLayout
canonicalUrl: https://listengermanstories.vercel.app/stories/die-geschichte-von-hans-und-anna
---
```

### Compose

Run `node ./scripts/compose.js` to bootstrap a new story.

Follow the interactive prompt to generate a story with pre-filled front matter.

## Story Generation

Generate German learning stories using AI with this command:

```bash
npm run generate-story -- --title "Your Story Title" --difficulty B1 --paragraphs 5
```

### Parameters:

- `--title`: Required story title
- `--difficulty`: Language level (A2, B1, B2) - Default: B1
- `--paragraphs`: Number of paragraphs - Default: 5

### Features:

- Generates Markdown files in `/data/stories`
- Creates companion vocabulary.json with word definitions
- Uses Google's Gemini 2.0 Flash model
- Automatic date formatting in front matter

## Image Optimization

Optimize and convert images to WebP format using this command:

```bash
node scripts/optimize-images.js --directory "" --quality 85 --width 800
```

### Parameters:

- `--directory` or `-d`: Target subdirectory in `public/static/images` (default: 'blog')
- `--quality` or `-q`: WebP quality (1-100, default: 80)
- `--width` or `-w`: Maximum image width (default: 1200)

### Features:

- Converts images to WebP format for better compression
- Resizes images to specified maximum width
- Preserves aspect ratio
- Shows size savings for each optimized image
- Supports JPG, JPEG, PNG, and GIF formats

## Blog Post Generation

Generate blog posts using AI with this command:

```bash
npm run generate-blog-post -- --title "Your Blog Post Title" --category "language-learning" --keywords "keyword1,keyword2" --useEmojis true --includeFaq true
```

### Parameters:

- `--title` (required): Title of the blog post
- `--category`: Category of the blog post (options: language-learning, german-culture, grammar-tips, vocabulary, learning-methods) - Default: language-learning
- `--keywords`: Comma-separated keywords for SEO
- `--useEmojis`: Include emojis in the blog post - Default: true
- `--includeFaq`: Include a FAQ section in the blog post - Default: true

### Features:

- Generates Markdown files in `/data/blog`
- Uses Google's Gemini AI for content generation
- Automatic date formatting in front matter

## Contributing

We welcome contributions! If you'd like to add a new story or improve the site, please follow these steps:

1. Fork the repository
2. Create a new branch
3. Add your story in the `data/stories` directory using MDX format
4. Submit a pull request

## Deployment

The easiest way to deploy the site is to use the [Vercel Platform](https://vercel.com) from the creators of Next.js. Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## TODOS

#TODO - Remove PNG image after optimize
#TODO - Improve image prompt generated to avoid including details about dialogs
#TODO - Remove `mdx tags` from story generated content
#TODO - Include mp3File attribute in the generated TextToSpeechPlayer component

## Support

Using the template? Support this effort by giving a star on GitHub, sharing your own blog and giving a shoutout on Twitter or becoming a project [sponsor](https://github.com/sponsors/irvingzamora28).

## Licence

[MIT](https://github.com/irvingzamora28/listengermanstories/blob/master/LICENSE) © [Irving Zamora](https://www.irvingzamora.com)
