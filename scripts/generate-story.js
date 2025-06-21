#!/usr/bin/env node

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const yaml = require('js-yaml')
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
const currentDate = new Date().toISOString().split('T')[0]

function escapeTextAndTranslation(content) {
  return content.replace(/(text|translation)=([^\n]*)/g, (_, prop, value) => {
    const trimmed = value.trim()
    // Remove surrounding quotes (only one level)
    const unquoted = trimmed.replace(/^['"]|['"]$/g, '')
    // Escape only double quotes
    const escaped = unquoted.replace(/"/g, '\\"')
    return `${prop}={"${escaped}"}`
  })
}

async function generateStory() {
  try {
    console.log('Starting story generation process...')
    const filename = argv.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const outputPath = path.join(__dirname, '..', 'data', 'stories', `${filename}.mdx`)

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const exampleStory = `---
title: 'Der magische Schlüssel'
date: '2025-02-10'
lastmod: '2025-02-10'
tags: ['Beginner', 'Mystery', 'Magic', 'Key', 'Friendship']
draft: false
summary: 'Leo findet einen magischen Schlüssel, der ihm die Tür zu einem aufregenden Abenteuer mit seiner Freundin Mia öffnet.'
images: ['/static/images/magischer-schluessel-1.webp']
---

## Kapitel 1: Das geheimnisvolle Fundstück

import TextToSpeechPlayer from './TextToSpeechPlayer.js'

<TextToSpeechPlayer
  text="Leo fand auf dem **Dachboden** seines **Hauses** einen alten, rostigen **Schlüssel**. Er war neugierig und fragte sich, welches **Schloss** dazu passte."
  translation="Leo found an old, rusty **key** in the **attic** of his **house**. He was curious and wondered which **lock** it fit."
  mp3File='/static/audio/magischer-schluessel-1.mp3'
/>

## Kapitel 2: Die beste Freundin

![Leo und Mia](/static/images/magischer-schluessel-2.webp)

<TextToSpeechPlayer
  text="Er zeigte den Schlüssel seiner besten **Freundin** Mia. Zusammen beschlossen sie, das **Geheimnis** des Schlüssels zu lüften."
  translation="He showed the key to his best **friend** Mia. Together, they decided to solve the **mystery** of the key."
  mp3File='/static/audio/magischer-schluessel-2.mp3'
/>

## Kapitel 3: Die alte Truhe

![Die alte Truhe](/static/images/magischer-schluessel-3.webp)

<TextToSpeechPlayer
  text="Auf dem **Spielplatz** entdeckten sie eine alte **Truhe**. Leo probierte den Schlüssel aus, und er passte! Die Truhe öffnete sich."
  translation="At the **playground**, they discovered an old **chest**. Leo tried the key, and it fit! The chest opened."
  mp3File='/static/audio/magischer-schluessel-3.mp3'
/>

## Kapitel 4: Ein magisches Buch

<TextToSpeechPlayer
  text="In der Truhe lag ein altes **Buch**. Als sie es öffneten, leuchteten die **Seiten** und zeigten ihnen einen geheimen **Pfad**."
  translation="Inside the chest was an old **book**. When they opened it, the **pages** lit up and showed them a secret **path**."
  mp3File='/static/audio/magischer-schluessel-4.mp3'
/>

## Kapitel 5: Das Abenteuer beginnt

![Der geheime Pfad](/static/images/magischer-schluessel-4.webp)

<TextToSpeechPlayer
  text="Der Pfad führte sie zu einem verborgenen **Garten**. Dort trafen sie sprechende **Tiere** und magische **Pflanzen**."
  translation="The path led them to a hidden **garden**. There, they met talking **animals** and magical **plants**."
  mp3File='/static/audio/magischer-schluessel-5.mp3'
/>

## Kapitel 6: Eine unvergessliche Freundschaft

<TextToSpeechPlayer
  text="Leo und Mia erlebten viele aufregende Abenteuer. Sie lernten, dass **Freundschaft** und **Mut** die grössten **Schätze** sind."
  translation="Leo and Mia experienced many exciting adventures. They learned that **friendship** and **courage** are the greatest **treasures**."
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
    Each paragraph should be about 10-15 sentences long.
    
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
    5. **IMPORTANT:** In the frontmatter, add a 'characters' array listing all main characters. For each character, provide a DETAILED, canonical description in ENGLISH, including their physical appearance, clothing, and personality traits. Do not write the descriptions in German. Be specific and vivid. For example:
characters:
  - name: Kokosnuss
    description: "Kokosnuss is a small, bright red dragon with shimmering scales, large emerald-green eyes, and a pair of expressive, bushy eyebrows. He wears a vibrant blue scarf wrapped twice around his neck, which stands out against his red skin. His wings are slightly undersized, giving him a comically endearing appearance, and he often has a wide, friendly smile showing two small fangs. Kokosnuss is curious, adventurous, and always eager to help his friends, radiating warmth and positivity."
  - name: Matilda
    description: "Matilda is an intelligent porcupine with soft brown quills, neatly brushed and tipped with white. She wears oversized, perfectly round glasses with thin silver frames perched on her nose, and a flowing purple dress decorated with tiny yellow stars. Her eyes are gentle and observant, and she carries herself with calm confidence. Matilda is thoughtful, supportive, and always ready with a clever idea or a comforting word for her friends."
  - name: Oskar
    description: "Oskar is a plump, orange-scaled dragon with a big round belly that wobbles when he laughs. He has short, stubby legs, tiny wings that can barely lift him off the ground, and a perpetual look of cheerful hunger in his deep brown eyes. Oskar often wears a green backpack stuffed with snacks, and his laughter is loud and infectious. He is loyal, good-natured, and always thinking about his next meal, but he would never let his friends go hungry."

    **IMPORTANT MDX/JSX FORMATTING:**
    - Always use double quotes for all attribute values in JSX/MDX components, e.g. <TextToSpeechPlayer text="..." translation="..." />.
    - If the text contains a double quote, escape it as " (e.g., text="Kokosnuss says: "Hallo!"").
    - Apostrophes (single quotes) do NOT need to be escaped inside double-quoted values.
    - Example:

<TextToSpeechPlayer
  text="Kokosnuss says: "Hallo!" That's his favorite word."
  translation="Kokosnuss sagt: "Hallo!" Das ist sein Lieblingswort."
/>

All character descriptions must be in ENGLISH, even if the rest of the story is in German.

    Example:
    <TextToSpeechPlayer
      text="Emma sagte: "Schau mal, eine **Katze**!""
        translation="Emma said: "Look, a **cat**!""
/>
      />
      
      Make it engaging for learners.

Example MDX format:
---
title: Der Magische Garten
date: '2024-01-15'
description: 'Eine Geschichte über einen magischen Garten'
difficulty: 'A1'
featuredImage: '/images/stories/der-magische-garten.jpg'
characters:
  - name: Lisa
    description: "Lisa, a curious girl with brown hair and green eyes."
  - name: Felix
    description: "Felix, a clever cat with gray fur and a playful attitude."
---

# Der Magische Garten

## Kapitel 1: Die Entdeckung

![Ein kleiner Garten](/images/stories/der-magische-garten/chapter1.jpg)

<TextToSpeechPlayer
  text="Lisa entdeckte einen **Garten**. "Wow, was für ein schöner **Garten**!" sagte sie."
  translation="Lisa discovered a **garden**. "Wow, what a beautiful **garden**!" she said."
/>

Example format:
<TextToSpeechPlayer
  text="Lisa sagte: "Schau mal, eine **Katze** im **Garten**!""
  translation="Lisa said: "Look, a **cat** in the **garden**!""
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
        text="Der Junge sagte: "Hallo, wie geht es dir?""
              translation="The boy said: "Hello, how are you?""
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

    console.log('mdxContent', mdxContent)

    const cleanedContent = escapeTextAndTranslation(
      mdxContent
        .replace(/^```mdx\s*/, '')
        .replace(/```$/, '')
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]|„/g, "'")
        .replace(/date: '[^']+'/g, `date: '${currentDate}'`)
        .replace(/lastmod: '[^']+'/g, `lastmod: '${currentDate}'`)
        .trim()
    )

    console.log('cleanedContent', cleanedContent)

    // Generate image prompts
    const imagePromptData = {
      story_title: argv.title,
      images: [],
    }

    const chapters = []
    const rawChapters = cleanedContent.split('## Kapitel').slice(1) // ignore intro

    for (const raw of rawChapters) {
      const numberMatch = raw.match(/^ (\d+): (.+?)\n/)
      const imageMatch = raw.match(/!\[([^\]]+)\]\(([^)]+)\)/)
      const textMatch = raw.match(/text=\{\s*"([\s\S]*?)"\s*\}/)
      const translationMatch = raw.match(/translation=\{\s*"([\s\S]*?)"\s*\}/)

      if (numberMatch && imageMatch && textMatch && translationMatch) {
        const chapter = {
          number: numberMatch[1],
          title: numberMatch[2],
          imageAlt: imageMatch[1],
          imagePath: imageMatch[2],
          germanText: textMatch[1].replace(/\\/g, ''),
          englishText: translationMatch[1].replace(/\\/g, ''),
        }
        chapters.push(chapter)
        console.log('Chapter:', chapter)
      }
    }

    // Extract frontmatter and parse characters
    const frontmatterMatch = cleanedContent.match(/^---([\s\S]*?)---/)
    let frontmatter = {}
    let characterReferenceText = ''
    if (frontmatterMatch) {
      frontmatter = yaml.load(frontmatterMatch[1])
      if (frontmatter && Array.isArray(frontmatter.characters)) {
        characterReferenceText = 'Character Reference:\n' + frontmatter.characters.map((c) => `${c.name}: ${c.description}`).join('\n') + '\n'
      }
    }

    // Create a prompt for generating image descriptions
    const imagePrompt = `Create a detailed image prompt for a 3D animated scene from a children's story. This prompt will be used to generate an image using Gemini. The scene details are:\n\n$CHARACTER_REFERENCE\nChapter Title: $CHAPTER_TITLE\nScene Description: $GERMAN_TEXT\n\nRequirements:\n1. Style: 3D Animation similar to modern Pixar or Disney movies\n2. Lighting: Bright and cheerful\n3. Detail: Include specific details about characters, expressions, and environment\n4. Mood: Friendly and inviting for children\n5. Color: Vibrant and engaging color palette\n\nProvide only the image description, no additional text.`

    // Prepare canonical character descriptions
    const characterDescriptions = frontmatter && Array.isArray(frontmatter.characters) ? frontmatter.characters.map((c) => `${c.name}: ${c.description}`).join('\n') : ''

    // Generate image prompts for each chapter using Gemini for detailed, vivid prompts
    for (const chapter of chapters) {
      // Compose the LLM prompt for image description
      const promptForLLM = `You are an expert visual storyteller for children's books. Given the following information, generate a vivid, detailed, and visually descriptive prompt for a 3D animated scene that can be used for AI image generation. The prompt should be in English, richly describing the scene, characters, setting, actions, mood, and important visual details. Do NOT invent new characters or change their appearance—use only the canonical descriptions provided.

Character Reference:
${characterDescriptions}

Chapter Title: ${chapter.title}
Scene Description (in German): ${chapter.germanText}

Requirements:
- Style: 3D Animation similar to modern Pixar or Disney movies
- Lighting: Bright and cheerful
- Detail: Include specific details about characters, expressions, and environment
- Mood: Friendly and inviting for children
- Color: Vibrant and engaging color palette

Provide only the image prompt in English, no additional explanation or text.`

      // Generate the detailed image prompt using Gemini
      let imagePromptText = ''
      try {
        const result = await model.generateContent(promptForLLM)
        imagePromptText = `Character Reference:
        ${characterDescriptions}
        ${result.response.text().trim()}`
      } catch (err) {
        console.error('Error generating image prompt for chapter', chapter.number, err)
        imagePromptText = '[ERROR: Failed to generate image prompt]'
      }

      imagePromptData.images.push({
        chapter_number: chapter.number,
        chapter_title: chapter.title,
        image_path: chapter.imagePath,
        image_alt: chapter.imageAlt,
        german_text: chapter.germanText,
        english_text: chapter.englishText,
        prompt: imagePromptText,
      })
    }

    // Create images directory if it doesn't exist
    const imagesDir = path.join(__dirname, '..', 'data', 'images')
    try {
      await fs.mkdir(imagesDir, { recursive: true })
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }

    // Save image prompts to JSON file
    const imagePromptsPath = path.join(__dirname, '..', 'data', 'images', `${filename}-image-prompts.json`)

    await fs.writeFile(imagePromptsPath, JSON.stringify(imagePromptData, null, 2))

    // Extract German text from TextToSpeechPlayer components
    const audioData = {
      language_code: 'de',
      country_code: 'DE',
      data: [],
    }

    // Use regex to find all TextToSpeechPlayer components and extract German text
    for (const chapter of chapters) {
      // Remove bold markers and escape quotes for JSON
      const germanText = chapter.germanText.replace(/\*\*/g, '') // Remove bold markers

      audioData.data.push({
        text: germanText,
        audio_file_name: `${filename}${chapter.number}.mp3`,
      })
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
    console.log(`Image prompts saved to: ${imagePromptsPath}`)
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
