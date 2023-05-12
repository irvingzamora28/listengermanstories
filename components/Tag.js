import Link from 'next/link'
import kebabCase from '@/lib/utils/kebabCase'

const Tag = ({ text }) => {
  return (
    <Link passHref={true} href={`/tags/${kebabCase(text)}`}>
      <span className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-primary-50 px-2 py-2 text-xs font-semibold text-primary-600">{text}</span>
    </Link>
  )
}

export default Tag
