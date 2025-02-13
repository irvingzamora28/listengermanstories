// components/RelatedContent.js
import Link from 'next/link'

export default function RelatedContent({ posts }) {
  return (
    <section className="mt-16 border-t pt-8">
      <h2 className="mb-6 text-2xl font-semibold">More Learning Resources</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="group relative">
            <Link href={`/blog/${post.slug}`}>
              <a className="block rounded-lg bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-primary-600">{post.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{post.summary}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary-600">
                  <span>Read article</span>
                  <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
