import React from 'react'

export default function Blockquote({ author, children }) {
  return (
    <blockquote className="my-6 border-l-4 border-primary-400 bg-gray-50 p-4 italic text-gray-800 dark:bg-gray-800/60 dark:text-gray-100">
      <div className="mb-2">{children}</div>
      {author && <div className="mt-2 text-right font-semibold text-primary-500 dark:text-primary-400">— {author}</div>}
    </blockquote>
  )
}
