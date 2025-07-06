import React from 'react'
import { FiExternalLink } from 'react-icons/fi'

export default function ResourceCard({ title, url, image, description }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="my-4 block rounded-lg border border-gray-200 bg-white p-4 shadow transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center">
        {image && <img src={image} alt={title} className="mr-4 h-12 w-12 rounded bg-gray-100 object-contain dark:bg-gray-800" />}
        <div className="flex-1">
          <div className="flex items-center text-lg font-bold text-primary-600 dark:text-primary-400">
            {title} <FiExternalLink className="ml-2 inline-block h-4 w-4" />
          </div>
          <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">{description}</div>
        </div>
      </div>
    </a>
  )
}
