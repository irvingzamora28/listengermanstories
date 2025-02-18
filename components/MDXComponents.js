/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'
import TextToSpeechPlayer from './TextToSpeechPlayer.js'
import RelatedPost from './RelatedPost'

const FAQ = ({ question, children }) => (
  <div className="faq my-6 rounded-lg border-l-4 border-primary-500 bg-gray-50 p-4">
    <h3 className="mb-2 flex items-center text-lg font-semibold">
      <svg className="mr-2 h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
        <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" />
      </svg>
      {question}
    </h3>
    <div className="pl-7 text-gray-700">{children}</div>
  </div>
)

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  TextToSpeechPlayer: TextToSpeechPlayer,
  BlogNewsletterForm: BlogNewsletterForm,
  FAQ: FAQ,
  RelatedPost: RelatedPost,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
