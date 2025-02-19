#!/usr/bin/env node

require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai')
const fs = require('fs').promises
const sharp = require('sharp')
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const imageModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

// CLI configuration
const argv = yargs(hideBin(process.argv))
  .option('promptFile', {
    alias: 'p',
    description: 'Path to the JSON file containing image prompts',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h').argv

async function saveBase64Image(base64Data, outputPath) {
  try {
    // Remove the data:image/... prefix if present
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '')

    const imageBuffer = Buffer.from(base64Image, 'base64')

    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath)
    await fs.mkdir(outputDir, { recursive: true })

    // Use sharp to convert to webp format
    await sharp(imageBuffer).webp({ quality: 80 }).toFile(outputPath)

    console.log(`Image saved successfully to ${outputPath}`)
    return true
  } catch (error) {
    console.error('Error saving image:', error)
    return false
  }
}

async function generateImage(prompt) {
  try {
    console.log('Attempting to generate image with prompt:', prompt)

    const result = await imageModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
    })

    const response = await result.response
    console.log('Response received from Gemini API \n')

    console.log(response)
    console.log('\n\n\n ------------------------------- \n\n\n')
    console.log(response.text())
    console.log('\n\n\n ------------------------------- \n\n\n')
    console.log(response.candidates)

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error('No candidates received in response')
    }

    const candidate = response.candidates[0]
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error('Invalid content structure in response')
    }

    const part = candidate.content.parts[0]
    if (!part.inlineData || !part.inlineData.data) {
      console.error('Response structure:', JSON.stringify(response, null, 2))
      throw new Error('No image data found in response. You may need to request access to the image generation feature.')
    }

    return part.inlineData.data
  } catch (error) {
    console.error('Error generating image:', error)
    return null
  }
}

async function processImagePrompts() {
  try {
    // Read and parse the prompts file
    const promptsData = JSON.parse(await fs.readFile(argv.promptFile, 'utf8'))

    const { story_title, images } = promptsData
    console.log(`Processing images for story: ${story_title}`)

    // Process each image prompt
    for (const imageData of images) {
      const { chapter_number, prompt, image_path } = imageData
      console.log(`\nGenerating image for Chapter ${chapter_number}...`)

      // Generate the image
      const base64Image = await generateImage('generate an image using the following prompt: ' + prompt)
      if (!base64Image) {
        console.error(`Failed to generate image for Chapter ${chapter_number}`)
        continue
      }

      // Save the image
      const outputPath = path.join(process.cwd(), 'public', image_path)
      await saveBase64Image(base64Image, outputPath)
    }

    console.log('\nImage generation complete!')
  } catch (error) {
    console.error('Error processing image prompts:', error)
    process.exit(1)
  }
}

// Check for API key
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is not set')
  process.exit(1)
}

// Run the script
processImagePrompts()
