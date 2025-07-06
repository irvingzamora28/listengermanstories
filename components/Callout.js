import React from 'react'
import { FiInfo, FiAlertTriangle, FiCheckCircle, FiXCircle } from 'react-icons/fi'

const icons = {
  info: FiInfo,
  tip: FiCheckCircle,
  warning: FiAlertTriangle,
  danger: FiXCircle,
}

const colors = {
  info: 'border-blue-400 bg-blue-50 dark:bg-blue-900/30',
  tip: 'border-green-400 bg-green-50 dark:bg-green-900/30',
  warning: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/30',
  danger: 'border-red-400 bg-red-50 dark:bg-red-900/30',
}

const Callout = ({ type = 'info', title, children }) => {
  const Icon = icons[type] || FiInfo
  return (
    <div className={`my-6 flex rounded-lg border-l-4 p-4 ${colors[type] || colors.info}`}>
      <div className="mr-3 mt-1">
        <Icon className={`h-5 w-5 ${type === 'tip' ? 'text-green-500' : type === 'warning' ? 'text-yellow-500' : type === 'danger' ? 'text-red-500' : 'text-blue-500'}`} />
      </div>
      <div>
        {title && <div className="mb-1 font-semibold">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  )
}

export default Callout
