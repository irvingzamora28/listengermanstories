import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="my-4 rounded border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <button className="flex w-full items-center justify-between px-4 py-3 text-left font-semibold text-gray-900 focus:outline-none dark:text-gray-100" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{title}</span>
        {open ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
      </button>
      {open && <div className="px-4 pb-4 pt-1 text-gray-800 dark:text-gray-100">{children}</div>}
    </div>
  )
}

export default Accordion
