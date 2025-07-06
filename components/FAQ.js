/* FAQ component extracted from MDXComponents.js */
import React from 'react'
import { FiHelpCircle } from 'react-icons/fi'

const FAQ = ({ question, children }) => (
  <div className="faq my-6 rounded-lg border-l-4 border-primary-500 bg-gray-50 p-4 dark:border-primary-400 dark:bg-gray-800">
    <h3 className="mb-2 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
      <FiHelpCircle className="mr-2 h-5 w-5 text-primary-500 dark:text-primary-400" />
      {question}
    </h3>
    <div className="pl-7 text-gray-700 dark:text-gray-300">{children}</div>
  </div>
)

export default FAQ
