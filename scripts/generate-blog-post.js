#!/usr/bin/env node

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs').promises
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

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
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Prepare keywords for the prompt
    const keywords = argv.keywords ? argv.keywords.split(',').map((k) => k.trim()) : []

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

      **Content and Structure:**
      *   Include a compelling introduction, well-structured main content with multiple subheadings, and a satisfying conclusion.
      *   Break up large blocks of text with lists, tables, and visuals to improve readability.
      *   **Actively use tables and lists (both ordered and unordered) to organize ideas and information clearly. Aim to have at least one table or list in each major section of the blog post.**
      *   Incorporate the following keywords naturally for SEO optimization: ${keywords.join(', ')}.
      *   Provide factually accurate and helpful information for German learners of all levels.
      *   Include practical tips, actionable advice, and concrete examples in each main section.
      *   Suggest relevant internal links to other blog posts on the site where appropriate.
      *   Offer diverse resources (websites, apps, books, podcasts) that can help learners on their journey
      *   Highlight the benefits of using various methods

      **FAQ Section (Conditionally Included):**
      *   **${argv.includeFaq ? 'Include a FAQ section at the end with at least 3-5 frequently asked questions related to the topic. Provide clear and concise answers.' : 'Do not include a FAQ section.'}**
      *   Structure each FAQ item using this format (replace content with questions related to blog post topic):
      \`\`\`
      <FAQ question="[Question]">Answer to the question.</FAQ>
      \`\`\`

      **Topic:** ${argv.title}
      **Category:** ${argv.category}

      **Example of Excellent Blog Post Structure:** (Follow this structure, but don't copy the content)
      ---
      title: "[Title]"
      date: "${currentDate}"
      lastmod: "${currentDate}"
      tags: [Array of relevant tags]
      draft: false
      summary: [Compelling summary that includes main keywords]
      images: ['/static/images/blog/${filename}-1.png']
      ---

      ## Introduction

      [Engaging introduction paragraph(s)]

      ## Section 1: [Main Point]

      [Detailed explanation with examples and practical tips. Include a table or list here.]

      ## Section 2: [Another Main Point]

      [Detailed explanation with examples and practical tips. Include a table or list here.]

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
    const blogContent = result.response.text()

    // Write the content to the file
    await fs.mkdir(blogDir, { recursive: true })
    await fs.writeFile(outputPath, blogContent, 'utf8')

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
