import fs from 'fs'
import PageTitle from '@/components/PageTitle'
import generateRss from '@/lib/generate-rss'
import { MDXLayoutRenderer } from '@/components/MDXComponents'
import { formatSlug, getFileBySlug, getFiles, getFilesFrontMatter } from '@/lib/mdx'

const DEFAULT_LAYOUT = 'PostLayout'

export async function getStaticPaths() {
  const posts = getFiles('stories')
  return {
    paths: posts.map((p) => ({
      params: {
        slug: formatSlug(p).split('/'),
      },
    })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const allPosts = await getFilesFrontMatter('stories')
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === params.slug.join('/'))
  const prev = allPosts[postIndex + 1] || null
  const next = allPosts[postIndex - 1] || null
  const post = await getFileBySlug('stories', params.slug.join('/'))
  const authorList = post.frontMatter.authors || ['default']
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlug('authors', [author])
    return authorResults.frontMatter
  })
  const authorDetails = await Promise.all(authorPromise)

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts)
    fs.writeFileSync('./public/feed.xml', rss)
  }

  return { props: { post, authorDetails, prev, next } }
}

export default function Blog({ post, authorDetails, prev, next }) {
  const { mdxSource, toc, frontMatter } = post

  // Extract all mp3File values from the compiled MDX source string
  const audioPaths = []
  try {
    // Regex for compiled React code
    const regex = /mp3File:"([^"]+)"/g
    let match
    while ((match = regex.exec(mdxSource)) !== null) {
      audioPaths.push(match[1])
    }
  } catch (e) {
    if (typeof window !== 'undefined') {
      console.error('[Blog] Error extracting audioPaths:', e)
    }
  }

  return (
    <>
      {frontMatter.draft !== true ? (
        <MDXLayoutRenderer layout={frontMatter.layout || DEFAULT_LAYOUT} toc={toc} mdxSource={mdxSource} frontMatter={frontMatter} authorDetails={authorDetails} prev={prev} next={next} audioPaths={audioPaths} />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  )
}
