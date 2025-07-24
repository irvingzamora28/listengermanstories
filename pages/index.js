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
  const contentRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const offset = window.scrollY
        bgRef.current.style.transform = `translateY(${offset * 0.3}px)`
      }
      if (contentRef.current) {
        const offset = window.scrollY
        contentRef.current.style.transform = `translateY(${offset * 0.1}px)`
        contentRef.current.style.opacity = Math.max(1 - offset * 0.002, 0.5)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-black/80 to-black/60 md:h-[600px]">
      {/* German flag-inspired decorative elements */}
      <div className="absolute left-0 top-0 h-2 w-full bg-secondary-600"></div>
      <div className="absolute left-0 top-2 h-2 w-full bg-accent-900"></div>
      <div className="absolute left-0 top-4 h-2 w-full bg-primary-500"></div>

      {/* Background image with parallax effect */}
      <div ref={bgRef} className="absolute inset-0 -z-10 will-change-transform">
        <img src="/static/images/hero-image.webp" alt="German Stories Hero" className="h-full w-full object-cover object-center" style={{ filter: 'brightness(0.85) contrast(1.1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
      </div>

      {/* Hero content with parallax effect */}
      <div ref={contentRef} className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 text-center will-change-transform">
        <div className="mb-6 flex items-center justify-center space-x-2">
          <span className="h-1 w-8 rounded bg-primary-500"></span>
          <span className="font-heading text-sm uppercase tracking-widest text-primary-400">Deutsch Lernen</span>
          <span className="h-1 w-8 rounded bg-primary-500"></span>
        </div>

        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl">
          <span className="text-primary-400">Learn German</span> Through Captivating Stories
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl">Improve your German skills naturally with our collection of engaging stories designed for all proficiency levels.</p>

        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Link href="/stories" className="group relative overflow-hidden rounded-lg bg-primary-600 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-primary-700 hover:shadow-xl">
            <span className="relative z-10">Browse Stories</span>
            <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
          </Link>

          {popular && popular.length > 0 && (
            <Link
              href={`/story/${popular[0].slug}`}
              className="group relative overflow-hidden rounded-lg border-2 border-primary-400 bg-transparent px-8 py-4 text-lg font-medium text-primary-400 shadow-lg transition-all duration-300 hover:bg-primary-400/10 hover:text-white hover:shadow-xl"
            >
              <span className="relative z-10">Start Reading</span>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-primary-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <a href="#how-it-works" className="group flex flex-col items-center text-sm text-gray-300 transition-colors duration-300 hover:text-primary-400" aria-label="Scroll down to learn more">
            <span className="mb-2">Learn More</span>
            <svg className="h-6 w-6 animate-bounce text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
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
        <div id="how-it-works" className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <div className="mb-4 flex items-center justify-center space-x-2">
                <span className="h-1 w-6 rounded bg-primary-500"></span>
                <span className="font-heading text-sm uppercase tracking-wider text-primary-600 dark:text-primary-400">Our Methodology</span>
                <span className="h-1 w-6 rounded bg-primary-500"></span>
              </div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Why Learn German with Stories?</h2>
              <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600 dark:text-gray-300">Our approach makes language learning effective, natural, and enjoyable</p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-100/30 transition-all duration-500 group-hover:bg-primary-100/50 dark:bg-primary-900/20 dark:group-hover:bg-primary-900/30"></div>
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 shadow-inner transition-all duration-300 group-hover:bg-primary-200 dark:bg-primary-900/50 dark:group-hover:bg-primary-900/70">
                    <svg className="h-8 w-8 text-primary-600 transition-all duration-300 group-hover:scale-110 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-4 font-heading text-2xl font-bold text-gray-900 dark:text-white">Contextual Learning</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">Learn vocabulary and grammar naturally through engaging stories, not through rote memorization.</p>
                  <div className="mt-6 h-1 w-12 rounded bg-primary-500 transition-all duration-300 group-hover:w-20"></div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-100/30 transition-all duration-500 group-hover:bg-primary-100/50 dark:bg-primary-900/20 dark:group-hover:bg-primary-900/30"></div>
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 shadow-inner transition-all duration-300 group-hover:bg-primary-200 dark:bg-primary-900/50 dark:group-hover:bg-primary-900/70">
                    <svg className="h-8 w-8 text-primary-600 transition-all duration-300 group-hover:scale-110 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-4 font-heading text-2xl font-bold text-gray-900 dark:text-white">Audio Narration</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">Listen to native speakers narrate the stories to improve your pronunciation and listening skills.</p>
                  <div className="mt-6 h-1 w-12 rounded bg-primary-500 transition-all duration-300 group-hover:w-20"></div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-100/30 transition-all duration-500 group-hover:bg-primary-100/50 dark:bg-primary-900/20 dark:group-hover:bg-primary-900/30"></div>
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-100 shadow-inner transition-all duration-300 group-hover:bg-primary-200 dark:bg-primary-900/50 dark:group-hover:bg-primary-900/70">
                    <svg className="h-8 w-8 text-primary-600 transition-all duration-300 group-hover:scale-110 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="mb-4 font-heading text-2xl font-bold text-gray-900 dark:text-white">Interactive Vocabulary</h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300">Hover over highlighted words to see translations and build your vocabulary effortlessly.</p>
                  <div className="mt-6 h-1 w-12 rounded bg-primary-500 transition-all duration-300 group-hover:w-20"></div>
                </div>
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
              <div className="rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                <div className="mb-4 flex items-center space-x-2">
                  <span className="h-1 w-4 rounded bg-primary-500"></span>
                  <h2 className="font-heading text-xl font-bold text-gray-900 dark:text-white">Recent Stories</h2>
                </div>
                <ul className="space-y-5">
                  {latest.slice(0, MAX_LATEST).map((frontMatter, index) => {
                    const { slug, date, title } = frontMatter
                    return (
                      <li key={slug} className={`group relative ${index < MAX_LATEST - 1 ? 'border-b border-gray-200 pb-5 dark:border-gray-700' : ''}`}>
                        <div className="flex flex-col">
                          <Link href={`/story/${slug}`} className="font-heading text-base font-medium text-gray-900 transition-colors duration-200 hover:text-primary-600 dark:text-gray-100 dark:hover:text-primary-400">
                            {title}
                          </Link>
                          <span className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <svg className="mr-1.5 h-4 w-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            {formatDate(date)}
                          </span>
                          <Link href={`/story/${slug}`} className="mt-2 inline-flex items-center text-sm font-medium text-primary-600 transition-all duration-200 hover:translate-x-1 dark:text-primary-400">
                            Read more
                            <svg className="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 py-24 dark:from-gray-900 dark:to-gray-800">
          {/* Decorative elements */}
          <div className="absolute left-0 top-0 h-2 w-full bg-primary-500 opacity-30"></div>
          <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-primary-100 opacity-50 dark:bg-primary-900 dark:opacity-20"></div>
          <div className="absolute -right-16 bottom-32 h-48 w-48 rounded-full bg-secondary-100 opacity-40 dark:bg-secondary-900 dark:opacity-20"></div>

          <div className="container relative z-10 mx-auto px-4">
            <div className="mb-16 text-center">
              <div className="mb-4 flex items-center justify-center space-x-2">
                <span className="h-1 w-6 rounded bg-primary-500"></span>
                <span className="font-heading text-sm uppercase tracking-wider text-primary-600 dark:text-primary-400">Testimonials</span>
                <span className="h-1 w-6 rounded bg-primary-500"></span>
              </div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-gray-900 dark:text-white">What Our Learners Say</h2>
              <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300">Join thousands of satisfied German learners on their language journey</p>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              <div className="group relative rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
                <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>

                <div className="mb-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="mb-8 text-lg italic text-gray-600 dark:text-gray-300">
                  "I've tried many language learning apps, but nothing has improved my German as much as these stories. The context helps me remember vocabulary much better."
                </p>

                <div className="flex items-center border-t border-gray-100 pt-6 dark:border-gray-700">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-primary-100 ring-2 ring-primary-500 dark:bg-primary-900">
                    <svg className="h-full w-full text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-gray-900 dark:text-white">Sarah M.</h4>
                    <p className="text-primary-600 dark:text-primary-400">Intermediate Learner</p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
                <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                <div className="mb-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="mb-8 text-lg italic text-gray-600 dark:text-gray-300">"The audio narration has been incredibly helpful for my pronunciation. I can now speak with much more confidence after listening to the stories."</p>

                <div className="flex items-center border-t border-gray-100 pt-6 dark:border-gray-700">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-primary-100 ring-2 ring-primary-500 dark:bg-primary-900">
                    <svg className="h-full w-full text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-gray-900 dark:text-white">Thomas K.</h4>
                    <p className="text-primary-600 dark:text-primary-400">Beginner Learner</p>
                  </div>
                </div>
              </div>

              <div className="group relative rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
                <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="mb-6 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="mb-8 text-lg italic text-gray-600 dark:text-gray-300">
                  "The cultural context in these stories has given me insights into German life that I wouldn't get from a textbook. It's like learning the language and culture simultaneously."
                </p>

                <div className="flex items-center border-t border-gray-100 pt-6 dark:border-gray-700">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full bg-primary-100 ring-2 ring-primary-500 dark:bg-primary-900">
                    <svg className="h-full w-full text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading text-lg font-bold text-gray-900 dark:text-white">Maria L.</h4>
                    <p className="text-primary-600 dark:text-primary-400">Beginner Learner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 py-24">
          {/* German flag-inspired decorative elements */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
            <div className="h-1/3 w-full bg-secondary-600"></div>
            <div className="h-1/3 w-full bg-accent-900"></div>
            <div className="h-1/3 w-full bg-primary-400"></div>
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <h2 className="font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">Ready to improve your German?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-primary-100">Start reading our stories today and take your language skills to the next level.</p>
            <div className="mt-10">
              <Link
                href="/stories"
                className="group relative inline-flex items-center overflow-hidden rounded-lg bg-white px-10 py-4 text-lg font-medium text-primary-600 shadow-lg transition-all duration-300 hover:bg-gray-50 hover:shadow-xl"
              >
                <span className="mr-2">Get Started Now</span>
                <svg className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
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
          <div className="container mx-auto mt-24 px-4">
            <div className="rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 p-10 shadow-xl dark:from-accent-900 dark:to-accent-800">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="md:w-2/3">
                  <div className="mb-2 flex items-center space-x-2">
                    <span className="h-1 w-6 rounded bg-primary-500"></span>
                    <span className="font-heading text-sm uppercase tracking-wider text-primary-600 dark:text-primary-400">Stay Updated</span>
                  </div>
                  <h3 className="font-heading text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Subscribe to our Newsletter</h3>
                  <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">Get the latest stories and German learning tips delivered to your inbox.</p>
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
