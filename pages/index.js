import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { getFilesFrontMatter, sortPostsByDate, sortPostsByPopularity } from '@/lib/mdx'
import formatDate from '@/lib/utils/formatDate'

import NewsletterForm from '@/components/NewsletterForm'
import Image from 'next/image'
import { getAllTags } from '@/lib/tags'
import kebabCase from '@/lib/utils/kebabCase'

const MAX_DISPLAY = 10
const MAX_LATEST = 5
const MAX_TAGS = 5

export async function getStaticProps() {
  const posts = await getFilesFrontMatter('stories')
  const popular = await sortPostsByPopularity(posts.slice(0, MAX_DISPLAY))
  const latest = await sortPostsByDate(posts)
  const tags = await getAllTags('stories')
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a])

  console.log(popular)
  return {
    props: {
      popular,
      latest,
      sortedTags,
    },
  }
}

export default function Home({ popular, latest, sortedTags }) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <section className="flex flex-col">
        <div className="flex flex-col">
          <div className="flex flex-col items-center p-4 md:flex-row md:justify-between">
            <div className="mb-2 flex w-full items-center overflow-x-auto md:mb-0 md:w-4/5">
              <div className="flex flex-nowrap">
                {Object.keys(sortedTags).length === 0 && 'No tags found.'}
                {sortedTags.slice(0, MAX_TAGS).map((t) => {
                  return (
                    <div key={t} className="mb-2 mr-5 mt-2">
                      <Link href={`/tags/${kebabCase(t)}`} className="text-sm font-semibold uppercase text-gray-600 dark:text-gray-300">
                        <Tag text={t} />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col md:flex-row">
            {!popular.length && 'No posts found.'}
            <div className="container__blogs mr-2 flex w-full flex-wrap justify-between md:w-4/5">
              {popular.slice(0, MAX_DISPLAY).map((frontMatter) => {
                const { slug, date, title, summary, tags, popularity, images, authors } = frontMatter
                return (
                  <article key={slug} className="mb-4 w-full px-4 md:w-1/3">
                    <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800">
                      {images && images.length > 0 && (
                        <>
                          <Link href={`/story/${slug}`}>
                            <Image src={images[0]} className="aspect-video w-full object-cover" width={600} height={400} alt="" />
                          </Link>
                        </>
                      )}
                      <div className="p-4">
                        <p className="mb-1 text-sm text-primary-500">
                          Max Müller
                          <time dateTime={date} className="tex-base float-right font-medium leading-6 text-gray-500 dark:text-gray-400">
                            {formatDate(date)}
                          </time>
                        </p>
                        <Link href={`/story/${slug}`}>
                          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-400">{title}</h3>
                        </Link>
                        <p className="mt-1 text-gray-500 dark:text-gray-200">{summary}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Tag key={tag} text={tag} />
                          ))}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          <Link href={`/story/${slug}`} className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400" aria-label={`Read "${title}"`}>
                            Read more &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="container__latest-posts ml-2 w-full px-4 md:w-1/5">
              <div className="mb-4">
                <h2 className="mb-2 text-lg font-medium text-gray-800">Recent stories</h2>
                <ul>
                  {latest.slice(0, MAX_LATEST).map((frontMatter, index) => {
                    const { slug, date, title, summary, tags } = frontMatter
                    return (
                      <li key={slug} className={`mb-4 text-gray-900 ${index < MAX_DISPLAY - 1 ? 'border-b border-gray-300 pb-4' : ''}`}>
                        <div className="flex flex-col">
                          <div>
                            <Link href={`/story/${slug}`}>{title}</Link>
                            <span className="block text-sm text-gray-500">Published on {formatDate(date)}</span>
                          </div>
                          <div>
                            <Link href={`/story/${slug}`} className="float-right ml-4 mt-2 rounded bg-primary-500 px-3 py-2 text-sm font-semibold leading-none text-white transition-colors duration-200 hover:bg-primary-600">
                              Read more
                            </Link>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {popular.length > MAX_DISPLAY && (
          <div className="flex justify-end text-base font-medium leading-6">
            <Link href="/stories" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400" aria-label="All stories">
              All stories &rarr;
            </Link>
          </div>
        )}
        {siteMetadata.newsletter.provider !== '' && (
          <div className="flex items-center justify-center pt-4">
            <NewsletterForm />
          </div>
        )}{' '}
      </section>
    </>
  )
}
