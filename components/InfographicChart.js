import React from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from 'recharts'
import { FaChartBar, FaChartPie, FaChartLine } from 'react-icons/fa'

const chartIcons = {
  bar: FaChartBar,
  pie: FaChartPie,
  line: FaChartLine,
}

const defaultColors = ['#2563eb', '#10b981', '#f59e42', '#e11d48', '#a21caf', '#0ea5e9', '#fbbf24']

export default function InfographicChart({ type = 'bar', data = [], dataKey, title, colors = defaultColors, caption, width = '100%', height = 360, pieKey = 'value', barKey = 'value', lineKey = 'value' }) {
  const Icon = chartIcons[type] || FaChartBar

  const containerHeight = typeof height === 'number' ? height : 360

  return (
    <div className="mx-auto my-20 max-w-2xl rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950" style={{ width: width, height: containerHeight + 80 }}>
      {title && (
        <div className="flex items-center gap-3 rounded-t-3xl bg-gradient-to-r from-blue-400 to-cyan-400 px-8 py-5 text-xl font-extrabold text-blue-900 drop-shadow dark:text-blue-200">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-2xl dark:bg-gray-950/70">
            <Icon />
          </span>
          <span>{title}</span>
        </div>
      )}
      <div className="rounded-b-3xl bg-gradient-to-b from-white to-blue-50 px-6 py-4 dark:from-gray-950 dark:to-blue-950">
        <div style={{ width: width, height: containerHeight }}>
          {type === 'bar' && (
            <BarChart data={data} width={600} height={containerHeight}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={barKey}>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          )}
          {type === 'pie' && (
            <PieChart width={600} height={containerHeight}>
              <Tooltip />
              <Legend />
              <Pie data={data} dataKey={pieKey} nameKey={dataKey || 'name'} cx="50%" cy="50%" outerRadius={100} label>
                {data.map((_, idx) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          )}
          {type === 'line' && (
            <LineChart data={data} width={600} height={containerHeight}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={dataKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey={lineKey} stroke={colors[0]} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          )}
        </div>
        {caption && <div className="mt-3 text-center text-sm text-gray-600 dark:text-gray-400">{caption}</div>}
      </div>
    </div>
  )
}
