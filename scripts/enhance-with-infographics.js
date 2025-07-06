// enhance-with-infographics.js
// Reads a generated MDX blog post and uses the LLM to insert InfographicTable/InfographicChart components ONLY where they add clear value.

const fs = require('fs').promises
const path = require('path')
const { GoogleGenerativeAI } = require('@google/generative-ai')
require('dotenv').config()

if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY environment variable is not set')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function enhanceWithInfographics({ inputPath, outputPath }) {
  try {
    const mdxContent = await fs.readFile(inputPath, 'utf8')

    // LLM prompt: Give the model full documentation and examples for infographic components
    const prompt = `You are an expert content editor for an educational blog. You have access to two custom MDX components for infographics:

---
**InfographicTable**
- Use for complex data, comparisons, or structured information that benefits from a visual table.
- Props:
  - \`title\` (optional): Title above the table
  - \`columns\` (required): Array of column names
  - \`rows\` (required): Array of row arrays (recommended) or row objects
  - \`caption\` (optional): Description below the table
  - \`themeColor\` (optional): Color name (e.g. "blue", "emerald", "purple", "orange", "rose")
  - \`icon\` (optional): Icon name (e.g. "language", "book", "graduate")
- Example usage:
<InfographicTable
  title="German Definite Articles by Case"
  columns={["Case", "Masculine (der)", "Feminine (die)", "Neuter (das)", "Plural (die)"]}
  rows={[
    ["Nominative", "der", "die", "das", "die"],
    ["Accusative", "den", "die", "das", "die"],
    ["Dative", "dem", "der", "dem", "den"],
    ["Genitive", "des", "der", "des", "der"]
  ]}
  caption="Definite articles for each grammatical case in German."
  themeColor="blue"
/>

---
**InfographicChart**
- Use for visualizing statistics, comparisons, or trends where a chart adds clarity.
- Props:
  - \`type\` (required): "bar", "pie", or "line"
  - \`title\` (optional): Title above the chart
  - \`data\` (required): Array of objects (e.g. { name: string, value: number })
  - \`caption\` (optional): Description below the chart
- Example usage:
<InfographicChart
  type="pie"
  title="Vocabulary Types Learned"
  data={[
    { name: "Nouns", value: 40 },
    { name: "Verbs", value: 35 },
    { name: "Adjectives", value: 25 }
  ]}
  caption="Distribution of vocabulary types in beginner German lessons."
/>

---

Your task: Review the following MDX blog post section by section. Insert <InfographicTable /> or <InfographicChart /> components ONLY in sections where a visual infographic would provide significant additional value, such as for complex data, comparisons, or trends that are hard to grasp with text alone. If a section is clear and effective as plain text, DO NOT add any infographic. If no section benefits from an infographic, do not add any. Do NOT add infographics just for decoration or variety. If you add an infographic, ensure it is contextually relevant and not redundant with the surrounding explanation. Use only valid MDX. Do not alter the meaning or structure of the original content except for inserting infographics where appropriate.\n\nHere is the blog post:\n\n${mdxContent}`

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const result = await model.generateContent(prompt)
    let enhancedContent = result.response.text()

    // Clean up markdown code block wrappers if present
    enhancedContent = enhancedContent.replace('```mdx\n---', '---')
    enhancedContent = enhancedContent.replace('```', '')

    await fs.writeFile(outputPath, enhancedContent, 'utf8')
    console.log(`✅ Enhanced blog post with infographics saved to: ${outputPath}`)
  } catch (error) {
    console.error('Error enhancing blog post with infographics:', error)
    process.exit(1)
  }
}

module.exports = { enhanceWithInfographics }

// CLI usage: node enhance-with-infographics.js --input path/to/blog.mdx --output path/to/enhanced-blog.mdx
if (require.main === module) {
  const argv = require('yargs/yargs')(process.argv.slice(2)).argv
  if (!argv.input || !argv.output) {
    console.error('Usage: node enhance-with-infographics.js --input path/to/blog.mdx --output path/to/enhanced-blog.mdx')
    process.exit(1)
  }
  enhanceWithInfographics({ inputPath: argv.input, outputPath: argv.output })
}
