import { useState, useEffect, useMemo } from 'react'
import AnswerInput from '@/components/answerInput'
import sentences from '@/data/sentences.json'

export default function Home() {
  // new, correct, incorrect
  const [state, setState] = useState('')
  
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState([])
  const [submission, setSubmission] = useState('')

  const handleOnSubmit = (submission) => {
    setSubmission(submission)

    if (state !== 'new') {
      setState('new')
      return
    }

    // Check if submission is one of the answers
    if (answers.some((answer) => answer === submission)) {
      setState('correct')
      return
    }

    setState('incorrect')
  }

  const getNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * sentences.length)
    const newQuestion = sentences[randomIndex].question
    const newAnswers = sentences[randomIndex].answers

    if (newQuestion === question) {
      return getNewQuestion()
    }

    setQuestion(newQuestion)
    setAnswers(newAnswers)
  }

  // Get random question/answer pair when state is new
  useMemo(() => {
    if (state !== 'new') return

    getNewQuestion()
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
            <div className="mt-6 w-full flex flex-1 flex-col items-center">
              <div className="w-full px-3 py-1.5 rounded-md bg-green-500 text-white text-center font-bold text-lg">
                正解
              </div>

              <ul className="mt-2 text-lg text-green-400 list-[circle]">
                {answers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
          )}

          {state === 'incorrect' && (
            <div className="mt-6 w-full flex flex-1 flex-col items-center">
              <div className="w-full px-3 py-1.5 rounded-md bg-red-500 text-white text-center font-bold text-lg">
                不正解
              </div>

              <ul className="mt-2 text-lg text-red-400 list-[circle]">
                {answers.map((answer, index) => (
                  <li key={index}>{answer}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
