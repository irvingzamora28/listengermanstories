import React, { useState } from 'react'
import { FaBook, FaLightbulb, FaEye, FaEyeSlash, FaChevronDown, FaChevronUp, FaCheckCircle, FaTimesCircle, FaArrowRight, FaGraduationCap, FaCog, FaLayerGroup, FaKey, FaRandom } from 'react-icons/fa'

const caseColors = {
  nominativ: 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200 border-blue-300 dark:border-blue-700',
  akkusativ: 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-200 border-red-300 dark:border-red-700',
  dativ: 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200 border-green-300 dark:border-green-700',
  genitiv: 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200 border-purple-300 dark:border-purple-700',
}

const genderColors = {
  der: 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400',
  die: 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400',
  das: 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400',
}

export default function GermanGrammarExplorer({ title, concept, difficulty = 'intermediate', examples = [], rules = [], exceptions = [], tips = [], practice = [], showAnswers = false, interactive = true }) {
  const [activeTab, setActiveTab] = useState('examples')
  const [showTranslations, setShowTranslations] = useState(false)
  const [showPracticeAnswers, setShowPracticeAnswers] = useState(false)
  const [expandedRules, setExpandedRules] = useState(new Set())
  const [completedPractice, setCompletedPractice] = useState(new Set())
  const [selectedAnswers, setSelectedAnswers] = useState({})

  const toggleRule = (index) => {
    const newExpanded = new Set(expandedRules)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRules(newExpanded)
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }))
  }

  const checkAnswer = (questionIndex, selectedAnswer, correctAnswer) => {
    return selectedAnswer === correctAnswer
  }

  const difficultyConfig = {
    beginner: { color: 'text-green-600 dark:text-green-400', icon: FaGraduationCap, label: 'Anfänger' },
    intermediate: { color: 'text-orange-600 dark:text-orange-400', icon: FaCog, label: 'Mittelstufe' },
    advanced: { color: 'text-red-600 dark:text-red-400', icon: FaKey, label: 'Fortgeschritten' },
  }

  const DifficultyIcon = difficultyConfig[difficulty].icon

  const tabs = [
    { id: 'examples', label: 'Beispiele', icon: FaBook },
    { id: 'rules', label: 'Regeln', icon: FaLayerGroup },
    { id: 'tips', label: 'Tipps', icon: FaLightbulb },
    { id: 'practice', label: 'Übung', icon: FaRandom },
  ]

  return (
    <div className="mx-auto my-8 max-w-5xl">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6 text-white">
          {/* German flag colors pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 h-1/3 w-full bg-black"></div>
            <div className="absolute left-0 top-1/3 h-1/3 w-full bg-red-600"></div>
            <div className="absolute left-0 top-2/3 h-1/3 w-full bg-yellow-400"></div>
          </div>

          <div className="relative">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇩🇪</span>
                <div className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">Deutsch</div>
              </div>
              <div className="flex items-center gap-2">
                <DifficultyIcon className={`text-xl ${difficultyConfig[difficulty].color}`} />
                <span className="text-sm font-medium opacity-90">{difficultyConfig[difficulty].label}</span>
              </div>
            </div>

            <h1 className="mb-2 text-3xl font-bold">{title}</h1>
            <p className="text-lg text-white/90">{concept}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm
                    font-medium transition-all duration-200
                    ${activeTab === tab.id ? 'border-orange-500 bg-white text-orange-600 dark:bg-gray-900 dark:text-orange-400' : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}
                  `}
                >
                  <Icon className="text-sm" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Beispiele</h3>
                <button
                  onClick={() => setShowTranslations(!showTranslations)}
                  className="flex items-center gap-2 rounded-lg bg-orange-100 px-4 py-2 text-orange-800 transition-colors duration-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-200 dark:hover:bg-orange-900/50"
                >
                  {showTranslations ? <FaEyeSlash /> : <FaEye />}
                  {showTranslations ? 'Übersetzung verstecken' : 'Übersetzung zeigen'}
                </button>
              </div>

              <div className="grid gap-4">
                {examples.map((example, index) => (
                  <div
                    key={index}
                    className={`
                      rounded-xl border-2 p-6 transition-all duration-300
                      ${example.gender ? genderColors[example.gender] : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">{index + 1}</div>
                          {example.case && <span className={`rounded-full border px-2 py-1 text-xs font-medium ${caseColors[example.case.toLowerCase()]}`}>{example.case}</span>}
                          {example.gender && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">{example.gender}</span>}
                        </div>
                        <p className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">{example.german}</p>
                        {showTranslations && <p className="mb-2 text-lg italic text-gray-600 dark:text-gray-400">{example.english}</p>}
                        {example.note && <p className="rounded-lg bg-gray-100 p-2 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-500">💡 {example.note}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Grammatikregeln</h3>

              {rules.map((rule, index) => (
                <div key={index} className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <button onClick={() => toggleRule(index)} className="flex w-full items-center justify-between bg-gray-50 px-6 py-4 transition-colors duration-200 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">{index + 1}</div>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{rule.title}</span>
                    </div>
                    {expandedRules.has(index) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>

                  {expandedRules.has(index) && (
                    <div className="bg-white p-6 dark:bg-gray-900">
                      <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{rule.description}</p>

                      {rule.examples && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">Beispiele:</h4>
                          {rule.examples.map((ex, exIndex) => (
                            <div key={exIndex} className="border-l-2 border-orange-300 pl-4 dark:border-orange-700">
                              <p className="font-medium text-gray-900 dark:text-gray-100">{ex.german}</p>
                              <p className="text-sm italic text-gray-600 dark:text-gray-400">{ex.english}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {rule.exceptions && rule.exceptions.length > 0 && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                          <h4 className="mb-2 font-semibold text-red-800 dark:text-red-200">⚠️ Ausnahmen:</h4>
                          <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
                            {rule.exceptions.map((exception, excIndex) => (
                              <li key={excIndex}>• {exception}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-gray-100">Lerntipps</h3>

              {tips.map((tip, index) => (
                <div key={index} className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                      <FaLightbulb className="text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">{tip.title}</h4>
                      <p className="leading-relaxed text-yellow-700 dark:text-yellow-300">{tip.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Practice Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Übungen</h3>
                <button
                  onClick={() => setShowPracticeAnswers(!showPracticeAnswers)}
                  className="flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-800 transition-colors duration-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50"
                >
                  {showPracticeAnswers ? <FaEyeSlash /> : <FaEye />}
                  {showPracticeAnswers ? 'Antworten verstecken' : 'Antworten zeigen'}
                </button>
              </div>

              {practice.map((question, index) => (
                <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-800 dark:bg-orange-900/50 dark:text-orange-200">{index + 1}</span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{question.type}</span>
                    </div>
                    <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{question.question}</p>
                  </div>

                  {question.options && (
                    <div className="mb-4 space-y-2">
                      {question.options.map((option, optIndex) => (
                        <button
                          key={optIndex}
                          onClick={() => handleAnswerSelect(index, option)}
                          className={`
                            w-full rounded-lg border p-3 text-left transition-all duration-200
                            ${
                              selectedAnswers[index] === option
                                ? 'border-orange-500 bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
                                : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800'
                            }
                          `}
                        >
                          <span className="font-medium">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {showPracticeAnswers && (
                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                      <div className="flex items-start gap-2">
                        <FaCheckCircle className="mt-0.5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">Antwort: {question.answer}</p>
                          {question.explanation && <p className="mt-1 text-sm text-green-700 dark:text-green-300">{question.explanation}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedAnswers[index] && showPracticeAnswers && (
                    <div className="mt-2">
                      {checkAnswer(index, selectedAnswers[index], question.answer) ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                          <FaCheckCircle />
                          <span className="text-sm font-medium">Richtig!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <FaTimesCircle />
                          <span className="text-sm font-medium">Falsch. Versuche es nochmal!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
