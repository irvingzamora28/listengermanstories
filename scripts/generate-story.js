#!/usr/bin/env node

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs').promises
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

// CLI configuration
const argv = yargs(hideBin(process.argv))
  .option('title', {
    alias: 't',
    description: 'Title of the story',
    type: 'string',
    demandOption: true,
  })
  .option('difficulty', {
    alias: 'd',
    description: 'Difficulty level (A1, A2, B1, B2)',
    type: 'string',
    choices: ['A1', 'A2', 'B1', 'B2'],
    default: 'A1',
  })
  .option('paragraphs', {
    alias: 'p',
    description: 'Number of paragraphs',
    type: 'number',
    default: 6,
  })
  .help()
  .alias('help', 'h').argv

async function generateStory() {
  try {
    console.log('Starting story generation process...')
    const filename = argv.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const outputPath = path.join(__dirname, '..', 'data', 'stories', `${filename}.mdx`)
    const currentDate = new Date().toISOString().split('T')[0]

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const exampleStory = `---
title: 'Der magische Schlüssel'
date: '${currentDate}'
lastmod: '${currentDate}'
tags: ['Beginner', 'Mystery', 'Magic', 'Key', 'Friendship']
draft: false
summary: 'Leo findet einen magischen Schlüssel, der ihm die Tür zu einem aufregenden Abenteuer mit seiner Freundin Mia öffnet.'
images: ['/static/images/magischer-schluessel-1.png']
---

import TextToSpeechPlayer from './TextToSpeechPlayer.js'

## Kapitel 1: Das geheimnisvolle Fundstück

![Der Dachboden](/static/images/magischer-schluessel-1.png)

<TextToSpeechPlayer
  text='Leo fand auf dem **Dachboden** seines **Hauses** einen alten, rostigen **Schlüssel**. Er war neugierig und fragte sich, welches **Schloss** dazu passte.'
  translation='Leo found an old, rusty **key** in the **attic** of his **house**. He was curious and wondered which **lock** it fit.'
  mp3File='/static/audio/magischer-schluessel-1.mp3'
/>

## Vocabulary words (Gender, Word, Translation):

- der **Dachboden** (Attic)
- das **Haus** (House)
- der **Schlüssel** (Key)
- das **Schloss** (Lock)`

    // Generate story content
    const storyPrompt = `Create a German learning story in MDX format. Use this example as a template, but create a new story about ${argv.title} with ${argv.paragraphs} chapters at ${argv.difficulty} level.

Example MDX format:
${exampleStory}

Requirements:
1. Follow the exact MDX format shown above
2. Include proper frontmatter with title, date, tags, and summary
3. Create numbered chapters with images
4. Each chapter should have:
   - A heading (## Kapitel N: Title)
   - An image reference
   - A TextToSpeechPlayer component with German text and English translation
   - Key words in **bold** in both languages
5. End with a vocabulary list showing gender, word, and translation
6. Use appropriate ${argv.difficulty} level German
7. Make the story engaging for language learners

Generate the complete MDX file content following this format exactly.`

    console.log('Generating story...')
    const storyResult = await model.generateContent(storyPrompt)
    let storyContent = storyResult.response.text()

    console.log('Generating story...')
    const result = await model.generateContent(storyPrompt)
    const mdxContent = result.response.text()

    // Clean up the content
    const cleanedContent = mdxContent
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/"/g, "'") // Use single quotes for consistency
      .replace(/date: '[^']+'/g, `date: '${currentDate}'`)
      .replace(/lastmod: '[^']+'/g, `lastmod: '${currentDate}'`)
      .trim()

    // Write to file
    await fs.writeFile(outputPath, cleanedContent, 'utf8')

    console.log(`\nStory generated successfully! 📚`)
    console.log(`File saved to: ${outputPath}`)
    console.log('\nNext steps:')
    console.log('1. Add the corresponding images to /static/images/')
    console.log('2. Generate audio files for each chapter')
    console.log('3. Review and edit the content as needed')

    console.log(`\nStory generated successfully! 📚`)
    console.log(`File saved to: ${outputPath}`)
    console.log('\nNext steps:')
    console.log('1. Add images to /static/images/')
    console.log('2. Generate audio files for each paragraph')
    console.log('3. Review and edit the generated content')
  } catch (error) {
    console.error('Error generating story:', error.message)
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is not set')
  process.exit(1)
}

generateStory()
