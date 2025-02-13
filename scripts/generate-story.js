#!/usr/bin/env node

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs').promises
const path = require('path')

// Define paths
const storiesDir = path.join(__dirname, '..', 'data', 'stories')
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
date: '2025-02-10'
lastmod: '2025-02-10'
tags: ['Beginner', 'Mystery', 'Magic', 'Key', 'Friendship']
draft: false
summary: 'Leo findet einen magischen Schlüssel, der ihm die Tür zu einem aufregenden Abenteuer mit seiner Freundin Mia öffnet.'
images: ['/static/images/magischer-schluessel-1.png']
---

## Kapitel 1: Das geheimnisvolle Fundstück

import TextToSpeechPlayer from './TextToSpeechPlayer.js'

<TextToSpeechPlayer
  text='Leo fand auf dem **Dachboden** seines **Hauses** einen alten, rostigen **Schlüssel**. Er war neugierig und fragte sich, welches **Schloss** dazu passte.'
  translation='Leo found an old, rusty **key** in the **attic** of his **house**. He was curious and wondered which **lock** it fit.'
  mp3File='/static/audio/magischer-schluessel-1.mp3'
/>

## Kapitel 2: Die beste Freundin

![Leo und Mia](/static/images/magischer-schluessel-2.png)

<TextToSpeechPlayer
  text='Er zeigte den Schlüssel seiner besten **Freundin** Mia. Zusammen beschlossen sie, das **Geheimnis** des Schlüssels zu lüften.'
  translation='He showed the key to his best **friend** Mia. Together, they decided to solve the **mystery** of the key.'
  mp3File='/static/audio/magischer-schluessel-2.mp3'
/>

## Kapitel 3: Die alte Truhe

![Die alte Truhe](/static/images/magischer-schluessel-3.png)

<TextToSpeechPlayer
  text='Auf dem **Spielplatz** entdeckten sie eine alte **Truhe**. Leo probierte den Schlüssel aus, und er passte! Die Truhe öffnete sich.'
  translation='At the **playground**, they discovered an old **chest**. Leo tried the key, and it fit! The chest opened.'
  mp3File='/static/audio/magischer-schluessel-3.mp3'
/>

## Kapitel 4: Ein magisches Buch

<TextToSpeechPlayer
  text='In der Truhe lag ein altes **Buch**. Als sie es öffneten, leuchteten die **Seiten** und zeigten ihnen einen geheimen **Pfad**.'
  translation='Inside the chest was an old **book**. When they opened it, the **pages** lit up and showed them a secret **path**.'
  mp3File='/static/audio/magischer-schluessel-4.mp3'
/>

## Kapitel 5: Das Abenteuer beginnt

![Der geheime Pfad](/static/images/magischer-schluessel-4.png)

<TextToSpeechPlayer
  text='Der Pfad führte sie zu einem verborgenen **Garten**. Dort trafen sie sprechende **Tiere** und magische **Pflanzen**.'
  translation='The path led them to a hidden **garden**. There, they met talking **animals** and magical **plants**.'
  mp3File='/static/audio/magischer-schluessel-5.mp3'
/>

## Kapitel 6: Eine unvergessliche Freundschaft

<TextToSpeechPlayer
  text='Leo und Mia erlebten viele aufregende Abenteuer. Sie lernten, dass **Freundschaft** und **Mut** die grössten **Schätze** sind.'
  translation='Leo and Mia experienced many exciting adventures. They learned that **friendship** and **courage** are the greatest **treasures**.'
  mp3File='/static/audio/magischer-schluessel-6.mp3'
/>

## Vocabulary words (Gender, Word, Translation):

- der **Dachboden** (Attic)
- das **Haus** (House)
- der **Schlüssel** (Key)
- das **Schloss** (Lock)
- die **Freundin** (Friend)
- das **Geheimnis** (Mystery, Secret)
- der **Spielplatz** (Playground)
- die **Truhe** (Chest)
- das **Buch** (Book)
- die **Seiten** (Pages)
- der **Pfad** (Path)
- der **Garten** (Garden)
- die **Tiere** (Animals)
- die **Pflanzen** (Plants)
- die **Freundschaft** (Friendship)
- der **Mut** (Courage)
- der **Schatz** (Treasure)
`

    // Generate story content
    // Define the story requirements with formatting rules
    const storyPrompt = `Create a German learning story in MDX format about ${argv.title} with ${argv.paragraphs} chapters at ${argv.difficulty} level.
    
    Formatting Rules:
    1. Use proper quotes:
       - Single quotes for attributes
       - Double quotes for dialogue
    2. Include natural dialogue
    3. Bold (**) vocabulary
    4. Each chapter needs:
       - Title
       - Image
       - TextToSpeechPlayer
    
    Example:
    <TextToSpeechPlayer
      text='Emma sagte: "Schau mal, eine **Katze**!"'
        translation='Emma said: "Look, a **cat**!"'
      />
      
      Make it engaging for learners.

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

Example format:
<TextToSpeechPlayer
  text='Lisa sagte: "Schau mal, eine **Katze** im **Garten**!"'
  translation='Lisa said: "Look, a **cat** in the **garden**!"'
/>


Key requirements:
1. Include natural dialogue in each chapter
2. Use proper quote formatting:
   - Single quotes for component attributes
   - Double quotes for spoken dialogue
3. Bold (**) all important vocabulary words
4. Make the story engaging for language learners
   
IMPORTANT FORMATTING RULES:
1. Include dialogue in each chapter using proper quotes:
  - Use single quotes (') around the entire text/translation attribute
  - Use double quotes (") for dialogue
  Example:
      text='Emma fragte: "Wo ist deine **Katze**?" Tom antwortete: "Im **Garten**".'
  
2. Bold important vocabulary words with ** in both languages
3. Make sure dialogues are natural and engaging
4. Never use curly quotes or other special quote characters
      
IMPORTANT FORMATTING RULES:
1. In the TextToSpeechPlayer components:
  - Use single quotes (') for the component attributes
  - Use double quotes (") for any quoted speech in the text
      Example:
      <TextToSpeechPlayer
        text='Der Junge sagte: "Hallo, wie geht es dir?"'
              translation='The boy said: "Hello, how are you?"'
            />
2. Never use curly quotes (‘’) or (“”) - only use straight quotes (' and ")
3. The text attribute MUST always be a single quoted string
4. The translation attribute MUST always be a single quoted string

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

    // Generate image prompts
    const imagePromptData = {
      story_title: argv.title,
      images: [],
    }

    // Extract chapter titles, text content, and generate image prompts
    const chapters = []
    /* eslint-disable no-useless-escape */
    const chapterRegex = /## ([^\n]+)\n\n!\[([^\]]+)\]\(([^\)]+)\)\n\n<TextToSpeechPlayer\s+text='([^']+)'\s+translation='([^']+)'/g
    let match

    while ((match = chapterRegex.exec(cleanedContent)) !== null) {
      chapters.push({
        title: match[1],
        imageAlt: match[2],
        imagePath: match[3],
        germanText: match[4].replace(/\*\*/g, ''), // Remove bold markers
        englishText: match[5].replace(/\*\*/g, ''), // Remove bold markers
      })
    }

    let chapterNum = 1

    // Create a prompt for generating image descriptions
    const imagePrompt = `Create a detailed image prompt for a 3D animated scene from a children's story. The scene details are:

Chapter Title: $CHAPTER_TITLE
Scene Description (German): $GERMAN_TEXT
Scene Description (English): $ENGLISH_TEXT

Requirements:
1. Style: 3D Animation similar to modern Pixar or Disney movies
2. Lighting: Bright and cheerful
3. Detail: Include specific details about characters, expressions, and environment
4. Mood: Friendly and inviting for children
5. Color: Vibrant and engaging color palette

Provide only the image description, no additional text.`

    // Generate image prompts for each chapter
    for (const chapter of chapters) {
      // Replace placeholders in prompt
      const promptText = imagePrompt.replace('$CHAPTER_TITLE', chapter.title).replace('$GERMAN_TEXT', chapter.germanText).replace('$ENGLISH_TEXT', chapter.englishText)

      // Generate image prompt using Gemini
      const result = await model.generateContent(promptText)
      const imagePromptText = result.response.text()

      imagePromptData.images.push({
        chapter_number: chapterNum,
        chapter_title: chapter.title,
        image_path: chapter.imagePath,
        image_alt: chapter.imageAlt,
        german_text: chapter.germanText,
        english_text: chapter.englishText,
        prompt: `3D Animated Scene: ${imagePromptText.trim()}`,
      })

      chapterNum++
    }

    // Create images directory if it doesn't exist
    const imagesDir = path.join(storiesDir, 'images')
    try {
      await fs.mkdir(imagesDir, { recursive: true })
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }

    // Save image prompts to JSON file
    const imagePromptsPath = path.join(imagesDir, `${filename}-image-prompts.json`)
    await fs.writeFile(imagePromptsPath, JSON.stringify(imagePromptData, null, 2))

    // Reset chapter number for audio data
    chapterNum = 1

    // Extract German text from TextToSpeechPlayer components
    const audioData = {
      language_code: 'de',
      country_code: 'DE',
      data: [],
    }

    // Use regex to find all TextToSpeechPlayer components and extract German text
    const textMatches = cleanedContent.matchAll(/<TextToSpeechPlayer\s+text='([^']+)'[^>]+>/g)
    chapterNum = 1
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
