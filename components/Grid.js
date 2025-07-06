import React from 'react'

const Grid = ({ columns = 2, children, className = '' }) => {
  return (
    <div
      className={`my-6 grid gap-4 ${
        columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : columns === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export default Grid
