import { useState, useEffect, useMemo } from 'react'
import AnswerInput from '@/components/answerInput'
import sentences from '@/data/sentences.json'

export default function Home() {
  // new, correct, incorrect
  const [state, setState] = useState('')

  const [sentence, setSentence] = useState({})
  const question = sentence?.question || ''
  const answers = sentence?.answers || []
  const vocabulary = sentence?.vocabulary || []
  const grammar = sentence?.grammar || []

  const handleOnSubmit = (submission) => {
    if (state !== 'new') {
      setState('new')
      return
    }

    // Check if submission is one of the answers
    if (checkAnswer(submission, answers)) {
      setState('correct')
      return
    }

    setState('incorrect')
  }

  const getNewSentence = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length)
    const newSentence = sentences[randomIndex]
    
    if (newSentence === sentence) {
      return getNewSentence()
    }

    setSentence(newSentence)
  }

  // Get random question/answer pair when state is new
  useMemo(() => {
    if (state !== 'new') return

    getNewSentence()
  }, [state])

  useEffect(() => {
    setState('new')
  }, [])

  return (
    <>
      <div className="w-full mb-6 text-center">
        <p className="text-sm mb-1.5">以下を日本語に訳してください。</p>

        <div className="text-3xl">{question}</div>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center">
        <AnswerInput onSubmit={handleOnSubmit} state={state} />

        <div className="h-96 w-full">
          {state === 'correct' && (
            <div className="mt-6 w-full flex flex-1 flex-col items-center p-1 border-2 border-green-400 rounded-md">
              <div className="w-full px-3 py-1.5 rounded bg-green-500 text-green-50 text-center font-bold text-lg">
                正解
              </div>
            </div>
          )}

          {state === 'incorrect' && (
            <div className="mt-6 w-full flex flex-1 flex-col items-center p-1 border-2 border-red-400 rounded-md">
              <div className="w-full px-3 py-1.5 rounded bg-red-500 text-red-50 text-center font-bold text-lg">
                不正解
              </div>
            </div>
          )}

          {state !== 'new' && (
            <div className="mt-6 p-1 w-full flex flex-1 flex-col border-2 rounded-md border-gray-700 space-y-1">
              <div className="p-2 bg-green-800 text-green-50 rounded">
                <ul className="text-lg">
                  {answers.map((sentence, index) => (
                    <li key={index} className="leading-8">{sentence}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="space-y-3">
                  <div className="p-2 bg-sky-800 text-sky-50 rounded">
                    <h2 className="font-bold mb-1.5">Vocabulary</h2>

                    <ul className="text-lg">
                      {vocabulary.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>
                            {item.word}
                            {item.reading && (
                              <span className=" text-sky-200">【{item.reading}】</span>
                            )}
                          </span>
                          <span>{item.meaning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-2 bg-purple-800 text-purple-50 rounded">
                    <h2 className="font-bold mb-1.5">Grammar</h2>

                    <ul className="text-lg">
                      {grammar.map((item, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{item.grammar}</span>
                          <span>{item.meaning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Calculate the similarity between two strings.
function similarity(string1, string2) {
  let longer = string1
  let shorter = string2

  // Determine which string is longer
  if (string1.length < string2.length) {
    longer = string2
    shorter = string1
  }

  const longerLength = longer.length

  // If both strings are empty, they are 100% similar.
  if (longerLength === 0) {
    return 1.0
  }

  // Calculate the Levenshtein distance
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

// Calculate the Levenshtein distance between two strings.
function editDistance(string1, string2) {
  string1 = string1.toLowerCase()
  string2 = string2.toLowerCase()

  const costs = []

  for (let i = 0; i <= string1.length; i++) {
    let lastValue = i

    for (let j = 0; j <= string2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else {
        if (j > 0) {
          let newValue = costs[j - 1]

          // If characters are not the same, increment the cost
          if (string1.charAt(i - 1) !== string2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          }

          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
  }

  return costs[string2.length]
}

function checkAnswer(submission, answers, threshold = 0.5) {
  // Normalize the strings by removing trailing punctuation
  const normalize = (str) => str.replace(/[,.、。!！?？]+$/, '')

  submission = normalize(submission)
  answers = answers.map(normalize)
  
  // Check if submission is one of the answers
  if (answers.some((answer) => answer === submission)) {
    return true
  }

  // Check if submission is empty
  if (submission === '') {
    return false
  }

  // Check if the difference in length between submission and answers is too big
  for (const answer of answers) {
    const lengthDifference = Math.abs(submission.length - answer.length)
    const maxLength = Math.max(submission.length, answer.length)

    if (lengthDifference / maxLength <= (1 - threshold)) {
      if (similarity(submission, answer) >= threshold) {
        return true
      }
    }
  }

  return false
}