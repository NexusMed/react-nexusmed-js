import React, { useEffect } from 'react'
import { consult } from 'nexusmed-js'
import { AnswerInput } from 'nexusmed-js/dist/dts/consult/sdk'
import useLocalStorage from '../hooks/useLocalStorage';

export interface IAnswersContext {
  answers: Answers;
  setAnswers: (id: string, answers: AnswerInput[]) => void;
  setAnswer: (id: string, index: number, answer: AnswerInput) => void;
}

const initialState: IAnswersContext = {
  answers: {},
  setAnswers: () => Promise.resolve(),
  setAnswer: () => Promise.resolve(),
}

const AnswersContext = React.createContext<IAnswersContext>(initialState)

export type Answers = {
  [key: string]: { [index: number]: consult.AnswerInput }
}

export const AnswersProvider: React.FC = ({ children }) => {

  const [answers, _setAnswers] = useLocalStorage<Answers>('answers', {
    defaultValue: initialState.answers
  })

  const setAnswer = (id: string, index: number, answer: AnswerInput) => {
    let ans = answers
    if (!ans[id]) {
      ans[id] = {}
    }
    ans[id][index] = answer
    _setAnswers(ans)
  }

  const setAnswers = (id: string, prefilled: consult.AnswerInput[]) => {
    let ans: Answers = {}
    prefilled.forEach((answer, index) => ans[index] = answer)
    let newAns = answers
    newAns[id] = ans
    _setAnswers(newAns)
  }

  return (
    <AnswersContext.Provider value={{
      answers,
      setAnswers,
      setAnswer,
    }}>
      {children}
    </AnswersContext.Provider>
  )
}

export const useAnswers = (id: string, prefilled?: consult.AnswerInput[]) => {
  const context = React.useContext(AnswersContext)

  useEffect(() => {
    if (prefilled) {
      context.setAnswers(id, prefilled)
    }
  }, [])

  if (!context) {
    throw Error("Can't access AnswersContext. Wrap the component with the AnswersProvider")
  }

  return context
}