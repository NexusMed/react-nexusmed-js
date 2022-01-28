import React, { useState, useEffect } from 'react'
import { consult } from 'nexusmed-js'
import { AnswerInput } from 'nexusmed-js/dist/dts/consult/sdk'
import useLocalStorageState from 'use-local-storage-state'

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

type Answers = {
  [key: string]: Map<number, consult.AnswerInput>
}

export const AnswersProvider: React.FC = ({ children }) => {

  const [answers, _setAnswers] = useLocalStorageState<Answers>('nexus:qans', initialState.answers)

  const setAnswer = (id: string, index: number, answer: AnswerInput) => {
    let ans = answers
    if (!ans[id]) {
      ans[id] = new Map<number, consult.AnswerInput>()
    }
    ans[id].set(index, answer)
    _setAnswers(ans)
  }

  const setAnswers = (id: string, prefilled: consult.AnswerInput[]) => {
    let ans: Map<number, consult.AnswerInput> = new Map<number, consult.AnswerInput>()
    prefilled.forEach((answer, index) => ans.set(index, answer))
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
    } else if (!context.answers[id]?.values) {
      context.setAnswers(id, [])
    }
  }, [])

  if (!context) {
    throw Error("Can't access AnswersContext. Wrap the component with the AnswersProvider")
  }

  return context
}