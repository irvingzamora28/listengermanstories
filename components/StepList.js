import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

export default function StepList({ steps = [] }) {
  return (
    <ol className="my-6 list-decimal space-y-3 pl-6">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start">
          <FiCheckCircle className="mr-2 mt-1 h-5 w-5 text-primary-500 dark:text-primary-400" />
          <span>{step}</span>
        </li>
      ))}
    </ol>
  )
}
