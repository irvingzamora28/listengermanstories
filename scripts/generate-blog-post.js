#!/usr/bin/env node

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs').promises
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const matter = require('gray-matter')

// Define paths
const blogDir = path.join(__dirname, '..', 'data', 'blog')

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// CLI configuration
const argv = yargs(hideBin(process.argv))
  .option('title', {
    alias: 't',
    description: 'Title of the blog post',
    type: 'string',
    demandOption: true,
  })
  .option('category', {
    alias: 'c',
    description: 'Category of the blog post',
    type: 'string',
    choices: ['language-learning', 'german-culture', 'grammar-tips', 'vocabulary', 'learning-methods'],
    default: 'language-learning',
  })
  .option('keywords', {
    alias: 'k',
    description: 'Comma-separated keywords for SEO',
    type: 'string',
  })
  .option('useEmojis', {
    alias: 'e',
    description: 'Whether to include emojis in the generated blog post',
    type: 'boolean',
    default: true,
  })
  .option('includeFaq', {
    alias: 'f',
    description: 'Whether to include a FAQ section in the generated blog post',
    type: 'boolean',
    default: true,
  })
  .help()
  .alias('help', 'h').argv

async function findBlogForBacklink(currentFilename, category, keywords) {
  const files = await fs.readdir(blogDir)
  let randomPost
  const blogPosts = []

  let totalPosts = 0
  let randomPostIndex = null

  for (const file of files) {
    if (file.endsWith('.mdx') && file !== currentFilename) {
      totalPosts++
    }
  }

  randomPostIndex = Math.floor(Math.random() * totalPosts)

  let currentIndex = 0
  for (const file of files) {
    if (file.endsWith('.mdx') && file !== currentFilename) {
      const content = await fs.readFile(path.join(blogDir, file), 'utf8')
      const { data, content: blogContent } = matter(content)

      if (currentIndex === randomPostIndex) {
        randomPost = {
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          summary: data.summary,
          content: blogContent,
          category: data.category,
          tags: data.tags || [],
        }
      }

      // Calculate relevance score based on matching category and tags
      const hasMatchingCategory = data.category === category
      const matchingTags = (data.tags || []).filter((tag) => keywords.some((keyword) => tag.toLowerCase().includes(keyword.toLowerCase()))).length

      // Higher score for matching category and tags
      const relevanceScore = (hasMatchingCategory ? 2 : 0) + matchingTags

      if (relevanceScore > 0) {
        // Only include posts with some relevance
        blogPosts.push({
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          summary: data.summary,
          content: blogContent,
          category: data.category,
          tags: data.tags || [],
          relevanceScore,
        })
      }
      currentIndex++
    }
  }

  // Sort by relevance score and pick the most relevant one
  // If no relevant posts found, return a random post
  return blogPosts.length > 0 ? blogPosts.sort((a, b) => b.relevanceScore - a.relevanceScore)[0] : randomPost
}

async function findRelatedPosts(tags, category, currentFilename) {
  const files = await fs.readdir(blogDir)
  const relatedPosts = []

  for (const file of files) {
    if (file.endsWith('.mdx') && file !== currentFilename) {
      const content = await fs.readFile(path.join(blogDir, file), 'utf8')
      const { data } = matter(content)

      // Check if the post shares tags or category
      const hasMatchingTags = tags.some((tag) => data.tags?.some((postTag) => postTag.toLowerCase().includes(tag.toLowerCase())))
      const hasMatchingCategory = data.category === category

      if (hasMatchingTags || hasMatchingCategory) {
        relatedPosts.push({
          title: data.title,
          slug: file.replace(/\.mdx$/, ''),
          summary: data.summary,
          matchScore: (hasMatchingTags ? 1 : 0) + (hasMatchingCategory ? 1 : 0),
        })
      }
    }
  }

  // Sort by match score and return top 3
  return relatedPosts.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3)
}

async function generateBlogPost() {
  try {
    console.log('Starting blog post generation process...')
    const filename = argv.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const outputPath = path.join(blogDir, `${filename}.mdx`)
    const currentDate = new Date().toISOString().split('T')[0]

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Prepare keywords for the prompt
    const keywords = argv.keywords ? argv.keywords.split(',').map((k) => k.trim()) : []

    // Find a blog post to use for backlinking
    const blogForBacklink = await findBlogForBacklink(`${filename}.mdx`, argv.category, keywords)
    console.log(blogForBacklink)

    const backlinkPrompt = blogForBacklink
      ? `
      **Blog Post for Contextual Backlinking:**
      Title: ${blogForBacklink.title}
      Summary: ${blogForBacklink.summary}
      Link Format: [text to display](/blog/${blogForBacklink.slug})
      
      Instructions for Backlinking:
      1. Read through the blog post summary above
      2. Find a natural place in your content where this blog post would be relevant
      3. Add a contextual link using the format provided
      4. Do not force the link if it doesn't fit the content naturally
      `
      : ''

    const prompt = `
      Generate a comprehensive and engaging blog post about German language learning, following these guidelines:

      **Overall Tone:**
      *   Write in a friendly, encouraging, and informative style.
      *   Emphasize the benefits and enjoyment of learning German.
      *   Use a conversational tone that resonates with language learners.
      *   **${argv.useEmojis ? 'Incorporate relevant emojis throughout the post to emphasize points, add visual interest, and improve readability.' : 'Do not use emojis.'}**

      **MDX Format Requirements:**
      *   Use MDX (Markdown with JSX) for the blog post structure.
      *   Ensure proper meta information in the frontmatter (title, date, lastmod, tags, summary, images).
      *   Surround all frontmatter values with double quotes.
      *   Use clear and concise markdown formatting for headings, lists (numbered and bulleted), bold text, and tables.
      *   The following custom components are available to enrich the post. Only use them when they are relevant, add value, and make sense in context. Do NOT force every component into every section.
      *   Example usages are provided below. Use these components naturally, where appropriate:

      **Component Usage Examples:**

      - <Callout type="info" title="Did you know?">German is the most widely spoken native language in Europe!</Callout>
      - <Callout type="tip" title="Tip">Practice a little every day for the best results.</Callout>
      - <Callout type="warning" title="Warning">Don't skip pronunciation practice!</Callout>
      - <Callout type="danger" title="Common Mistake">Avoid direct translation from your native language.</Callout>
      - <Blockquote author="Goethe">Wer nichts für andere tut, tut nichts für sich.</Blockquote>
      - <ResourceCard title="Duolingo" url="https://duolingo.com" image="/static/images/blog/duolingo.png" description="A fun and gamified way to learn German." />
      - <Glossary term="Akkusativ">The accusative case, used for direct objects in German.</Glossary>
      - <StepList steps={["Download a language app.", "Practice daily.", "Join a language exchange."]} />
      - <FAQ question="What is the best way to practice speaking?">Try language exchange meetups or online partners.</FAQ>
      - <Accordion title="What is the Akkusativ case?">The Akkusativ is the accusative case in German, used for direct objects...</Accordion>
      - <Grid columns={2}>
          <div>Practice speaking German every day, even if just to yourself.</div>
          <ResourceCard ... />
          <Callout type="info" title="Did you know?">You can combine normal text and different components inside a grid for a more dynamic layout.</Callout>
          <ul><li>Listen to German podcasts</li><li>Watch German movies</li></ul>
        </Grid>

      *   Do not use all components in every section. Use them only where they fit the content and enhance clarity or engagement.
      *   The Grid component is a flexible layout tool—use it to arrange any combination of components (ResourceCard, Callout, StepList, Blockquote, etc.) and/or normal text (paragraphs, lists, tips, etc.) in a visually appealing grid, not just components.

      **Content and Structure:**
      *   Include a compelling introduction, well-structured main content with multiple subheadings, and a satisfying conclusion.
      *   Break up large blocks of text with lists, visuals, and custom components to improve readability.
      *   **Actively use the provided custom components (Callout, Blockquote, ResourceCard, Glossary, StepList, Tip, FAQ) and lists (both ordered and unordered) to organize ideas and information clearly. Aim to include at least one of these components in each major section of the blog post.**
      *   Incorporate the following keywords naturally for SEO optimization: ${keywords.join(', ')}.
      *   Provide factually accurate and helpful information for German learners of all levels.
      *   Include practical tips, actionable advice, and concrete examples in each main section.
      *   Suggest relevant internal links to other blog posts on the site where appropriate.
      *   Offer diverse resources (websites, apps, books, podcasts) that can help learners on their journey.
      *   Highlight the benefits of using various methods.

      **FAQ Section (Conditionally Included):**
      *   **${
        argv.includeFaq
          ? `Include a FAQ section at the end with at least 3-5 frequently asked questions related to the topic. Provide clear and concise answers.
      *   Structure each FAQ item using this format (replace content with questions related to blog post topic):
      <FAQ question="[Question]">Answer to the question.</FAQ>
      `
          : 'Do not include a FAQ section.'
      }

      **Topic:** ${argv.title}
      **Category:** ${argv.category}
      ${backlinkPrompt}

      **Example of Excellent Blog Post Structure:** (Follow this structure, but don't copy the content)
      ---
      title: "[Title]"
      date: "${currentDate}"
      lastmod: "${currentDate}"
      tags: [Array of relevant tags]
      category: "[Category]"
      draft: false
      summary: [Compelling summary that includes main keywords]
      images: ['/static/images/blog/${filename}-1.webp']
      ---

      ## Introduction

      [Engaging introduction paragraph(s)]

      ## Section 1: [Main Point]

      [Detailed explanation with examples and practical tips. Use custom components only where relevant.]

      ## Section 2: [Another Main Point]

      [Detailed explanation with examples and practical tips.]

      ... (More sections as needed)

      ## Conclusion

      [Summarizing conclusion paragraph(s)]

      ${
        argv.includeFaq
          ? `## FAQ

        <FAQ question="[Question 1]">Answer 1.</FAQ>
        <FAQ question="[Question 2]">Answer 2.</FAQ>
        <FAQ question="[Question 3]">Answer 3.</FAQ>`
          : ''
      }

      Structure the response in a complete, ready-to-use MDX format.
    `

    // Generate the blog post content
    const result = await model.generateContent(prompt)
    let blogContent = result.response.text()

    // Find related posts based on tags and category
    const relatedPosts = await findRelatedPosts(keywords, argv.category, `${filename}.mdx`)
    console.log('Related posts:', relatedPosts)

    const relatedPostsSection =
      relatedPosts.length > 0
        ? `

## Related Posts

${relatedPosts.map((post) => `<RelatedPost href="/blog/${post.slug}" title="${post.title}" summary="${post.summary}" />`).join('\n')}`
        : ''

    // Write the content to the file with related posts appended
    await fs.mkdir(blogDir, { recursive: true })

    // Remove ```mdx from the beginning of the content and ``` from the end
    blogContent = blogContent.replace('```mdx\n---', '---')
    blogContent = blogContent.replace('```', '')
    await fs.writeFile(outputPath, blogContent + relatedPostsSection, 'utf8')

    console.log(`✅ Blog post generated successfully at: ${outputPath}`)
  } catch (error) {
    console.error('Error generating blog post:', error)
    process.exit(1)
  }
}

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is not set')
  process.exit(1)
}

generateBlogPost()
