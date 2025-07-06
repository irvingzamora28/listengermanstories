import React from 'react'
import { FaTable, FaBookOpen, FaUserGraduate, FaLanguage, FaGraduationCap, FaChartLine, FaCalendarAlt, FaStar, FaGlobe } from 'react-icons/fa'

// Enhanced theme map with language learning appropriate colors
const themeMap = {
  blue: {
    from: 'from-blue-500',
    to: 'to-indigo-600',
    text: 'text-white',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200',
    row: 'bg-blue-50/80 dark:bg-blue-900/20',
    shadow: 'shadow-blue-200/50 dark:shadow-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    accent: 'text-blue-600 dark:text-blue-400',
  },
  emerald: {
    from: 'from-emerald-500',
    to: 'to-teal-600',
    text: 'text-white',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200',
    row: 'bg-emerald-50/80 dark:bg-emerald-900/20',
    shadow: 'shadow-emerald-200/50 dark:shadow-emerald-900/30',
    border: 'border-emerald-200 dark:border-emerald-800',
    accent: 'text-emerald-600 dark:text-emerald-400',
  },
  purple: {
    from: 'from-purple-500',
    to: 'to-violet-600',
    text: 'text-white',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200',
    row: 'bg-purple-50/80 dark:bg-purple-900/20',
    shadow: 'shadow-purple-200/50 dark:shadow-purple-900/30',
    border: 'border-purple-200 dark:border-purple-800',
    accent: 'text-purple-600 dark:text-purple-400',
  },
  orange: {
    from: 'from-orange-500',
    to: 'to-amber-600',
    text: 'text-white',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/70 dark:text-orange-200',
    row: 'bg-orange-50/80 dark:bg-orange-900/20',
    shadow: 'shadow-orange-200/50 dark:shadow-orange-900/30',
    border: 'border-orange-200 dark:border-orange-800',
    accent: 'text-orange-600 dark:text-orange-400',
  },
  rose: {
    from: 'from-rose-500',
    to: 'to-pink-600',
    text: 'text-white',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/70 dark:text-rose-200',
    row: 'bg-rose-50/80 dark:bg-rose-900/20',
    shadow: 'shadow-rose-200/50 dark:shadow-rose-900/30',
    border: 'border-rose-200 dark:border-rose-800',
    accent: 'text-rose-600 dark:text-rose-400',
  },
}

const iconMap = {
  table: FaTable,
  book: FaBookOpen,
  graduate: FaUserGraduate,
  language: FaLanguage,
  graduation: FaGraduationCap,
  chart: FaChartLine,
  calendar: FaCalendarAlt,
  star: FaStar,
  globe: FaGlobe,
}

export default function InfographicTable({ title, columns, rows, caption, themeColor = 'blue', icon = 'language', showRowNumbers = false, hoverable = true, compact = false }) {
  const theme = themeMap[themeColor] || themeMap.blue
  const Icon = iconMap[icon] || iconMap.language

  return (
    <div className="mx-auto my-8 max-w-6xl">
      <div
        className={`
          rounded-2xl border ${theme.border} 
          bg-white shadow-2xl 
          dark:bg-gray-900 ${theme.shadow}
          hover:shadow-3xl overflow-hidden backdrop-blur-sm
          transition-all
          duration-300
        `}
        style={{
          boxShadow: '0 20px 40px -12px rgba(0,0,0,0.08), 0 8px 16px -8px rgba(0,0,0,0.06)',
        }}
      >
        {/* Enhanced Header */}
        {title && (
          <div
            className={`
            relative bg-gradient-to-r px-8 
            py-6 ${theme.from} ${theme.to} 
            ${theme.text}
            overflow-hidden
          `}
          >
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute left-0 top-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-white"></div>
              <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-20 translate-y-20 rounded-full bg-white"></div>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/30 bg-white/20 backdrop-blur-sm">
                <Icon className="text-2xl text-white drop-shadow-sm" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight drop-shadow-sm">{title}</h2>
                <div className="mt-1 flex items-center gap-2 opacity-90">
                  <div className="h-1 w-1 rounded-full bg-white"></div>
                  <span className="text-sm font-medium">
                    {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-800/50">
                {showRowNumbers && (
                  <th className="px-4 py-4 text-left">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">#</span>
                  </th>
                )}
                {columns.map((col, i) => (
                  <th
                    key={col}
                    className={`
                      px-6 py-4 text-left
                      ${compact ? 'py-3' : 'py-4'}
                    `}
                  >
                    <div
                      className={`
                      inline-flex items-center gap-2 rounded-lg px-3 
                      py-1.5 ${theme.badge}
                      border border-black/5 text-sm
                      font-semibold tracking-wide shadow-sm dark:border-white/10
                    `}
                    >
                      <div className={`h-2 w-2 rounded-full bg-current opacity-60`}></div>
                      {col}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rows.map((row, idx) => {
                const isEven = idx % 2 === 0

                return (
                  <tr
                    key={idx}
                    className={`
                      ${isEven ? theme.row : 'bg-transparent'}
                      ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
                      group transition-all duration-200
                      ${hoverable ? 'hover:shadow-sm' : ''}
                    `}
                  >
                    {showRowNumbers && (
                      <td className={`px-4 ${compact ? 'py-3' : 'py-4'}`}>
                        <div
                          className={`
                          h-8 w-8 rounded-full ${theme.badge}
                          flex items-center justify-center
                          text-xs font-bold
                          shadow-sm
                        `}
                        >
                          {idx + 1}
                        </div>
                      </td>
                    )}

                    {Array.isArray(row) ? (
                      // Handle array rows
                      row.map((cell, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`
                            px-6 ${compact ? 'py-3' : 'py-4'}
                            font-medium text-gray-900
                            dark:text-gray-100
                            ${hoverable ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200' : ''}
                            transition-colors duration-200
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {cellIdx === 0 && <div className={`h-3 w-3 rounded-full ${theme.accent} opacity-60`}></div>}
                            <span className={cellIdx === 0 ? 'font-semibold' : ''}>{cell}</span>
                          </div>
                        </td>
                      ))
                    ) : (
                      // Handle object rows (legacy support)
                      <>
                        <td className={`px-6 ${compact ? 'py-3' : 'py-4'}`}>
                          <div
                            className={`
                            inline-flex items-center gap-3 rounded-xl px-4 
                            py-2 ${theme.badge}
                            border border-black/5
                            font-semibold shadow-sm dark:border-white/10
                          `}
                          >
                            <FaBookOpen className="text-sm opacity-80" />
                            {row.label}
                          </div>
                        </td>
                        {columns.slice(1).map((col) => (
                          <td
                            key={col}
                            className={`
                              px-6 ${compact ? 'py-3' : 'py-4'}
                              font-medium text-gray-900
                              dark:text-gray-100
                              ${hoverable ? 'group-hover:text-gray-700 dark:group-hover:text-gray-200' : ''}
                              transition-colors duration-200
                            `}
                          >
                            {row[col.toLowerCase()]}
                          </td>
                        ))}
                      </>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Enhanced Caption */}
        {caption && (
          <div className="border-t border-gray-200 bg-gray-50/50 px-8 py-4 dark:border-gray-700 dark:bg-gray-800/30">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className={`h-2 w-2 rounded-full ${theme.accent} opacity-60`}></div>
              <span className="font-medium">{caption}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
