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
import ResponsiveImage from './ResponsiveImage'
import FAQ from './FAQ'
import Callout from './Callout'
import Blockquote from './Blockquote'
import Glossary from './Glossary'
import StepList from './StepList'
import ResourceCard from './ResourceCard'
import Accordion from './Accordion'
import InfographicTable from './InfographicTable'
import InfographicChart from './InfographicChart'
import Grid from './Grid'
import GermanGrammarExplorer from './GermanGrammarExplorer'

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  TextToSpeechPlayer: TextToSpeechPlayer,
  BlogNewsletterForm: BlogNewsletterForm,
  FAQ: FAQ,
  RelatedPost: RelatedPost,
  ResponsiveImage: ResponsiveImage,
  Callout: Callout,
  Blockquote: Blockquote,
  Glossary: Glossary,
  StepList: StepList,
  ResourceCard: ResourceCard,
  InfographicTable: InfographicTable,
  InfographicChart: InfographicChart,
  GermanGrammarExplorer: GermanGrammarExplorer,
  Accordion: Accordion,
  Grid: Grid,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = require(`../layouts/${layout}`).default
    return <Layout {...rest} />
  },
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout layout={layout} components={MDXComponents} {...rest} />
}
