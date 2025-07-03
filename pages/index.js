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

  return {
    props: {
      popular,
      latest,
      sortedTags,
    },
  }
}

import { useRef, useEffect } from 'react'

function ParallaxHero({ popular }) {
  const bgRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const offset = window.scrollY
        bgRef.current.style.transform = `translateY(${offset * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden bg-black/70 md:h-[400px]">
      <div ref={bgRef} className="absolute inset-0 -z-10 will-change-transform">
        <img src="/static/images/hero-image.webp" alt="German Stories Hero" className="h-full w-full object-cover object-center" style={{ filter: 'brightness(0.95)' }} />
        <div className="absolute inset-0 bg-transparent"></div>
      </div>
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-4 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">Learn German by Reading Engaging Stories</h1>
        <p className="mt-4 text-lg text-gray-200 md:text-xl">Improve your German skills with our collection of fun and engaging stories for all levels.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/stories" className="rounded-md bg-primary-600 px-6 py-3 text-lg font-medium text-white shadow-md hover:bg-primary-700">
            Browse Stories
          </Link>
          {popular && popular.length > 0 && (
            <Link
              href={`/story/${popular[0].slug}`}
              className="rounded-md border border-gray-100 bg-white/90 px-6 py-3 text-lg font-medium text-gray-800 shadow-md hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Start Reading
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Home({ popular, latest }) {
  return (
    <>
      <PageSEO
        title="Learn German with Stories | Improve Your German Language Skills"
        description="Enhance your German language skills through engaging stories. Perfect for beginners to advanced learners. Improve vocabulary, grammar, and comprehension naturally."
        keywords="learn german, german stories, german language learning, german for beginners, german reading practice, german vocabulary, german grammar"
      />
      <section className="flex flex-col">
        {/* HERO SECTION with overlayed content and parallax effect */}
        <ParallaxHero popular={popular} />

        {/* Features Section */}
        <div id="how-it-works" className="py-16">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Learn German with Stories?</h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Our approach makes language learning effective and enjoyable</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Contextual Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">Learn vocabulary and grammar naturally through engaging stories rather than memorizing lists.</p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Cultural Immersion</h3>
                <p className="text-gray-600 dark:text-gray-300">Experience German culture through authentic stories that provide cultural context and insights.</p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Progressive Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">Stories for all levels from beginner to advanced, allowing you to progress at your own pace.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-8 px-4">
          <div className="flex flex-1 flex-col md:flex-row">
            <div className="container__blogs mr-2 flex w-full flex-wrap justify-between md:w-4/5">
              {!popular.length && 'No posts found.'}
              {popular.slice(0, MAX_DISPLAY).map((frontMatter) => {
                const { slug, date, title, summary, tags, images } = frontMatter
                return (
                  <article key={slug} className="mb-4 w-full px-4 md:w-1/3">
                    <div className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow dark:bg-slate-800">
                      {images && images.length > 0 && (
                        <Link href={`/story/${slug}`}>
                          <Image src={images[0]} className="aspect-video w-full object-cover" width={600} height={400} alt="" />
                        </Link>
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
                    const { slug, date, title } = frontMatter
                    return (
                      <li key={slug} className={`mb-4 text-gray-900 ${index < MAX_LATEST - 1 ? 'border-b border-gray-300 pb-4' : ''}`}>
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

        {/* Testimonials Section */}
        <div className="bg-gray-50 py-16 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Our Users Say</h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Join thousands of satisfied German learners</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">"These stories have transformed my German learning journey. I've learned more vocabulary in two months than I did in a year of traditional classes."</p>
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Sarah M.</h4>
                    <p className="text-sm text-gray-500">Beginner Learner</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">"As a beginner, I was intimidated by German grammar. These stories make learning fun and less overwhelming. I look forward to my daily reading!"</p>
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Thomas K.</h4>
                    <p className="text-sm text-gray-500">Beginner Learner</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  "The cultural context in these stories has given me insights into German life that I wouldn't get from a textbook. It's like learning the language and culture simultaneously."
                </p>
                <div className="flex items-center">
                  <div className="mr-4 h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Maria L.</h4>
                    <p className="text-sm text-gray-500">Beginner Learner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-primary-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to improve your German?</h2>
            <p className="mt-4 text-xl text-primary-100">Start reading our stories today and take your language skills to the next level.</p>
            <div className="mt-8">
              <Link href="/stories" className="rounded-md bg-white px-8 py-3 text-lg font-medium text-primary-600 shadow-md hover:bg-gray-100">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>

        {popular.length > MAX_DISPLAY && (
          <div className="container mx-auto mt-8 flex justify-end px-4 text-base font-medium leading-6">
            <Link href="/stories" className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400" aria-label="All stories">
              All stories &rarr;
            </Link>
          </div>
        )}

        {siteMetadata.newsletter.provider !== '' && (
          <div className="container mx-auto mt-16 px-4">
            <div className="rounded-lg bg-gray-100 p-8 dark:bg-gray-800">
              <div className="flex flex-col items-center justify-between md:flex-row">
                <div className="mb-6 md:mb-0 md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Subscribe to our Newsletter</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">Get the latest stories and German learning tips delivered to your inbox.</p>
                </div>
                <div className="w-full md:w-1/3">
                  <NewsletterForm />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
