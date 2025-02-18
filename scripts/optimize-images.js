#!/usr/bin/env node

const sharp = require('sharp')
const fs = require('fs').promises
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// Define paths
const publicDir = path.join(__dirname, '..', 'public')
const staticImagesDir = path.join(publicDir, 'static', 'images')

// CLI configuration
const argv = yargs(hideBin(process.argv))
  .option('directory', {
    alias: 'd',
    description: 'Directory containing images to optimize (relative to public/static/images)',
    type: 'string',
    default: 'blog',
  })
  .option('quality', {
    alias: 'q',
    description: 'WebP quality (1-100)',
    type: 'number',
    default: 80,
  })
  .option('width', {
    alias: 'w',
    description: 'Maximum width of the output image',
    type: 'number',
    default: 1200,
  })
  .help()
  .alias('help', 'h').argv

async function optimizeImage(inputPath, outputPath, options) {
  try {
    await sharp(inputPath)
      .resize(options.width, null, {
        // null height maintains aspect ratio
        withoutEnlargement: true, // don't enlarge if image is smaller
        fit: 'inside',
      })
      .webp({ quality: options.quality })
      .toFile(outputPath)

    const inputStats = await fs.stat(inputPath)
    const outputStats = await fs.stat(outputPath)
    const savings = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(2)

    console.log(`✅ Optimized: ${path.basename(inputPath)}`)
    console.log(`   Original size: ${(inputStats.size / 1024).toFixed(2)} KB`)
    console.log(`   Optimized size: ${(outputStats.size / 1024).toFixed(2)} KB`)
    console.log(`   Saved: ${savings}%\n`)
  } catch (error) {
    console.error(`❌ Error optimizing ${inputPath}:`, error.message)
  }
}

async function optimizeImagesInDirectory() {
  try {
    const targetDir = path.join(staticImagesDir, argv.directory)

    // Ensure target directory exists
    await fs.access(targetDir)

    // Get all image files in the directory
    const files = await fs.readdir(targetDir)
    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))

    if (imageFiles.length === 0) {
      console.log('No images found to optimize.')
      return
    }

    console.log(`Found ${imageFiles.length} images to optimize...\n`)

    // Process each image
    for (const file of imageFiles) {
      const inputPath = path.join(targetDir, file)
      const outputPath = path.join(targetDir, path.basename(file, path.extname(file)) + '.webp')

      await optimizeImage(inputPath, outputPath, {
        quality: argv.quality,
        width: argv.width,
      })
    }

    console.log('🎉 Image optimization complete!')
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Directory not found: ${path.join(staticImagesDir, argv.directory)}`)
    } else {
      console.error('Error optimizing images:', error.message)
    }
    process.exit(1)
  }
}

// Run the optimization
optimizeImagesInDirectory()
