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
    // Define the story requirements with formatting rules
    const storyPrompt = `Create a German learning story in MDX format about ${argv.title} with ${argv.paragraphs} chapters at ${argv.difficulty} level.\n\nFormatting Rules:\n1. Use proper quotes:\n   - Single quotes for attributes\n   - Double quotes for dialogue\n2. Include natural dialogue\n3. Bold (**) vocabulary\n4. Each chapter needs:\n   - Title\n   - Image\n   - TextToSpeechPlayer\n\nExample:\n<TextToSpeechPlayer\n  text='Emma sagte: "Schau mal, eine **Katze**!"'\n  translation='Emma said: "Look, a **cat**!"'\n/>\n\nMake it engaging for learners.

Example MDX format:
---
title: Der Magische Garten
date: '2024-01-15'
description: 'Eine Geschichte über einen magischen Garten'
difficulty: 'A1'
featuredImage: '/images/stories/der-magische-garten.jpg'
---

# Der Magische Garten

## Kapitel 1: Die Entdeckung

![Ein kleiner Garten](/images/stories/der-magische-garten/chapter1.jpg)

<TextToSpeechPlayer
  text='Lisa entdeckte einen **Garten**. "Wow, was für ein schöner **Garten**!" sagte sie.'
  translation='Lisa discovered a **garden**. "Wow, what a beautiful **garden**!" she said.'
/>

## Vokabeln
- der **Garten** (Garden)
- schön (Beautiful)
- Use double quotes for dialogue
- Bold (**) important vocabulary
- Include dialogue in each chapter

Example format:
<TextToSpeechPlayer
  text='Lisa sagte: "Schau mal, eine **Katze** im **Garten**!"'
  translation='Lisa said: "Look, a **cat** in the **garden**!"'
/>
\n\nKey requirements:\n1. Include natural dialogue in each chapter\n2. Use proper quote formatting:\n   - Single quotes for component attributes\n   - Double quotes for spoken dialogue\n3. Bold (**) all important vocabulary words\n4. Make the story engaging for language learners\n\nIMPORTANT FORMATTING RULES:\n1. Include dialogue in each chapter using proper quotes:\n   - Use single quotes (') around the entire text/translation attribute\n   - Use double quotes (") for dialogue\n   Example:\n   text='Emma fragte: "Wo ist deine **Katze**?" Tom antwortete: "Im **Garten**".'\n\n2. Bold important vocabulary words with ** in both languages\n3. Make sure dialogues are natural and engaging\n4. Never use curly quotes or other special quote characters\n\nIMPORTANT FORMATTING RULES:\n1. In the TextToSpeechPlayer components:\n   - Use single quotes (') for the component attributes\n   - Use double quotes (") for any quoted speech in the text\n   Example:\n   <TextToSpeechPlayer\n     text='Der Junge sagte: "Hallo, wie geht es dir?"'\n     translation='The boy said: "Hello, how are you?"'\n   />\n\n2. Never use curly quotes (‘’) or (“”) - only use straight quotes (' and ")

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
      .replace(/[“”]/g, '"') // Replace curly quotes with straight quotes
      .replace(/[‘’]|„/g, "'") // Replace fancy quotes with straight single quotes
      .replace(/date: '[^']+'/g, `date: '${currentDate}'`)
      .replace(/lastmod: '[^']+'/g, `lastmod: '${currentDate}'`)
      .trim()

    // Extract German text from TextToSpeechPlayer components
    const audioData = {
      language_code: 'de',
      country_code: 'DE',
      data: [],
    }

    // Use regex to find all TextToSpeechPlayer components and extract German text
    const textMatches = cleanedContent.matchAll(/<TextToSpeechPlayer\s+text='([^']+)'[^>]+>/g)
    let chapterNum = 1

    for (const match of textMatches) {
      // Remove bold markers and escape quotes for JSON
      const germanText = match[1]
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/'/g, "'") // Replace single quotes with escaped single quotes
        .replace(/"/g, '"') // Escape double quotes for JSON

      audioData.data.push({
        text: germanText,
        audio_file_name: `${filename}-${chapterNum}.mp3`,
      })
      chapterNum++
    }

    // Write MDX file
    await fs.writeFile(outputPath, cleanedContent, 'utf8')

    // Write audio JSON file
    const audioJsonPath = path.join(__dirname, '..', 'data', 'audio', `${filename}.json`)
    await fs.mkdir(path.dirname(audioJsonPath), { recursive: true })
    await fs.writeFile(audioJsonPath, JSON.stringify(audioData, null, 2), 'utf8')

    console.log(`\nStory generated successfully! 📚`)
    console.log(`MDX file saved to: ${outputPath}`)
    console.log(`Audio JSON file saved to: ${audioJsonPath}`)
    console.log(`File saved to: ${outputPath}`)
    console.log('\nNext steps:')
    console.log('1. Add the corresponding images to /static/images/')
    console.log('2. Generate audio files for each chapter')
    console.log('3. Review and edit the content as needed')

    console.log('\nNext steps:')
    console.log('1. Add images to /static/images/')
    console.log('2. Use the generated JSON file to create audio files')
    console.log('3. Review and edit the content as needed')
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
