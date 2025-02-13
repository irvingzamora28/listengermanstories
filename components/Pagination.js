import Link from '@/components/Link'

export default function Pagination({ totalPages, currentPage, basePath }) {
  const prevPage = parseInt(currentPage) - 1 > 0
  const nextPage = parseInt(currentPage) + 1 <= parseInt(totalPages)

  return (
    <div className="space-y-2 pb-8 pt-6 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button rel="previous" className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            Previous
          </button>
        )}
        {prevPage && (
          <Link href={currentPage - 1 === 1 ? `/${basePath == 'story' ? 'stories' : 'blogs'}/` : `/${basePath}/page/${currentPage - 1}`} className="cursor-auto disabled:opacity-50" disabled={currentPage - 1 === 1}>
            <button rel="previous">Previous</button>
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button rel="next" className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} className="cursor-auto disabled:opacity-50" disabled={currentPage + 1 > totalPages}>
            <button rel="next">Next</button>
          </Link>
        )}
      </nav>
    </div>
  )
}
