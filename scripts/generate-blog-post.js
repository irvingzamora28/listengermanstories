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

    // Create a detailed prompt for the AI
    const prompt = `Generate a comprehensive, SEO-optimized blog post about German language learning. 

Format the blog post in MDX format with the following requirements:
1. The content should be engaging, informative, and valuable for German language learners
2. Include proper meta information (title, date, tags, summary)
3. Use markdown formatting for headers, bold text, and lists
4. Include sections for introduction, main content (with multiple subheadings), and conclusion
5. Incorporate these keywords naturally: ${keywords.join(', ')}
6. The content should be factually accurate and helpful for German learners
7. Include at least one example or practical tip in each main section
8. Add relevant internal linking suggestions where appropriate

Topic: ${argv.title}
Category: ${argv.category}

Please structure the response in this format:
---
title: [Title]
date: [Current Date]
lastmod: [Current Date]
tags: [Array of relevant tags]
draft: false
summary: [Compelling summary that includes main keywords]
images: ['/static/images/blog/${filename}-1.png']
---

[Blog content with proper markdown formatting]`

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
