import Link from './Link'

const RelatedPost = ({ href, title, summary }) => {
  return (
    <div className="my-4">
      <Link href={href} className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
        <h3 className="text-xl font-bold">{title}</h3>
      </Link>
      <p className="mt-1 text-gray-600 dark:text-gray-400">{summary}</p>
    </div>
  )
}

export default RelatedPost
