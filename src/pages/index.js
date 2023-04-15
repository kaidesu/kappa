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
    if (sentence.answers.some((answer) => answer === submission)) {
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
