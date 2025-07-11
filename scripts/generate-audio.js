#!/usr/bin/env node

require('dotenv').config()

const { GoogleGenAI } = require('@google/genai')
const fs = require('fs').promises
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// CLI configuration
const argv = yargs(hideBin(process.argv))
  .option('inputFile', {
    alias: 'i',
    description: 'Path to the JSON file containing audio prompts',
    type: 'string',
    demandOption: true,
  })
  .help()
  .alias('help', 'h').argv

// PCM to WAV conversion function
function pcmToWav(pcmData, sampleRate = 24000, numChannels = 1) {
  const bitsPerSample = 16
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
  const blockAlign = (numChannels * bitsPerSample) / 8

  const buffer = Buffer.alloc(44 + pcmData.length)

  // RIFF header
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + pcmData.length, 4)
  buffer.write('WAVE', 8)

  // fmt subchunk
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16) // Subchunk1Size
  buffer.writeUInt16LE(1, 20) // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(byteRate, 28)
  buffer.writeUInt16LE(blockAlign, 32)
  buffer.writeUInt16LE(bitsPerSample, 34)

  // data subchunk
  buffer.write('data', 36)
  buffer.writeUInt32LE(pcmData.length, 40)

  // PCM data
  pcmData.copy(buffer, 44)

  return buffer
}

async function generateAudio(text) {
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' })
  const response = await genAI.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  })
  const audioPart = response.candidates?.[0]?.content?.parts?.[0]
  if (!audioPart?.inlineData?.data) {
    throw new Error('No audio data in response')
  }
  return audioPart.inlineData.data
}

const ffmpeg = require('fluent-ffmpeg')
const os = require('os')

async function saveMp3File(base64Audio, outputPath) {
  const pcmData = Buffer.from(base64Audio, 'base64')
  if (pcmData.length === 0) throw new Error('Generated audio is empty')
  // Convert PCM to WAV
  const wavBuffer = pcmToWav(pcmData)

  // Temp WAV path
  const tempDir = os.tmpdir()
  const tempWavPath = path.join(tempDir, `tts_temp_${Date.now()}.wav`)

  // Ensure output directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  // Write temp WAV file
  await fs.writeFile(tempWavPath, wavBuffer)

  // Convert WAV to MP3
  await new Promise((resolve, reject) => {
    ffmpeg(tempWavPath).audioCodec('libmp3lame').audioBitrate(128).on('end', resolve).on('error', reject).save(outputPath)
  })

  // Remove temp WAV
  await fs.unlink(tempWavPath)
}

async function processAudioPrompts() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('Error: GEMINI_API_KEY environment variable is not set')
      process.exit(1)
    }
    const audioData = JSON.parse(await fs.readFile(argv.inputFile, 'utf8'))
    const { data } = audioData
    if (!Array.isArray(data)) {
      throw new Error('Input JSON does not have a data array')
    }
    console.log(`Processing ${data.length} audio entries...`)
    for (const [idx, entry] of data.entries()) {
      const { text, audio_file_name } = entry
      if (!text || !audio_file_name) {
        console.warn(`Skipping entry ${idx}: missing text or audio_file_name`)
        continue
      }
      console.log(`\n[${idx + 1}/${data.length}] Generating audio for: ${audio_file_name}`)
      try {
        const base64Audio = await generateAudio(text)
        const fileName = audio_file_name.replace(/\.wav$/i, '.mp3')
        const outputPath = path.join(process.cwd(), 'public', 'static', 'audio', fileName)
        await saveMp3File(base64Audio, outputPath)
        console.log(`Audio saved to ${outputPath}`)

        // --- Update the corresponding .mdx file ---
        const audioPrefix = fileName
          .replace(/\d+\.mp3$/, '')
          .replace(/\.mp3$/, '')
          .replace(/-\$/, '')
          .replace(/_\$/, '')
        const mdxDir = path.join(process.cwd(), 'data', 'stories')
        const mdxFiles = await fs.readdir(mdxDir)
        const targetMdx = mdxFiles.find((f) => f.endsWith('.mdx') && f.startsWith(audioPrefix))

        if (targetMdx) {
          const mdxPath = path.join(mdxDir, targetMdx)
          let mdxContent = await fs.readFile(mdxPath, 'utf8')
          let changed = false

          const correctMp3Path = `/static/audio/${fileName}`
          // Robustly match all <TextToSpeechPlayer ... /> blocks, even multi-line
          const ttsBlockRegex = /<TextToSpeechPlayer[\s\S]*?\/>/g
          let ttsBlocks = [...mdxContent.matchAll(ttsBlockRegex)]
          const matchNum = fileName.match(/(\d+)\.mp3$/)
          if (matchNum) {
            const blockIndex = parseInt(matchNum[1], 10) - 1
            if (blockIndex >= 0 && blockIndex < ttsBlocks.length) {
              const originalBlock = ttsBlocks[blockIndex][0]
              // Replace or insert mp3File property (handles single/double quotes, any order)
              let newBlock
              if (/mp3File\s*=/.test(originalBlock)) {
                // Replace the mp3File property value (single/double quotes, with or without braces)
                newBlock = originalBlock.replace(/mp3File\s*=\s*(?:\{)?(['"])[^'"}]*\1(\})?/, `mp3File='${correctMp3Path}'`)
              } else {
                // Insert mp3File property before closing
                newBlock = originalBlock.replace(/\/>$/, ` mp3File='${correctMp3Path}' />`)
              }
              if (originalBlock !== newBlock) {
                mdxContent = mdxContent.replace(originalBlock, newBlock)
                changed = true
              }
            }
          }

          if (changed) {
            await fs.writeFile(mdxPath, mdxContent, 'utf8')
            console.log(`[AUDIO-DEBUG] Updated mp3File property in ${mdxPath}`)
          }
        }
      } catch (err) {
        console.error(`Failed to generate audio for ${audio_file_name}:`, err.message)
      }
    }
    console.log('\nAudio generation complete!')
  } catch (error) {
    console.error('Error processing audio prompts:', error)
    process.exit(1)
  }
}

// Run the script
processAudioPrompts()
