import React from 'react'
import { FiBookOpen } from 'react-icons/fi'

export default function Glossary({ term, children }) {
  return (
    <div className="my-6 flex items-start rounded-lg border-l-4 border-indigo-400 bg-indigo-50 p-4 dark:bg-indigo-900/30">
      <FiBookOpen className="mr-3 mt-1 h-5 w-5 text-indigo-500" />
      <div>
        <span className="font-semibold text-indigo-800 dark:text-indigo-200">{term}</span>
        <span className="ml-2 text-gray-800 dark:text-gray-100">{children}</span>
      </div>
    </div>
  )
}
