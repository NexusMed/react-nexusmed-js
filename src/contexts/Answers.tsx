import React, { useState, useEffect } from 'react'
import { consult } from 'nexusmed-js'
import { AnswerInput } from 'nexusmed-js/dist/dts/consult/sdk'

interface IAnswersContext {
  answers: consult.AnswerInput[];
  setPrefilled: (answers: AnswerInput[]) => void;
}

const initialState: IAnswersContext = {
  answers: [],
  setPrefilled: () => Promise.resolve()
}

const AnswersContext = React.createContext<IAnswersContext>(initialState)


export const AnswersProvider: React.FC = ({ children }) => {
  const [answers, setAnswers] = useState<consult.AnswerInput[]>(initialState.answers)

  const setPrefilled = (prefilled: consult.AnswerInput[]) => {
    setAnswers(prefilled)
  }

  return (
    <AnswersContext.Provider value={{
      answers,
      setPrefilled
    }}>
      {children}
    </AnswersContext.Provider>
  )
}

export const useAnswers = (prefilled?: consult.AnswerInput[] | undefined) => {
  const context = React.useContext(AnswersContext)

  useEffect(() => {
    if (prefilled) {
      context.setPrefilled(prefilled)
    }
  }, [])

  if (!context) {
    throw Error("Can't access AnswersContext. Wrap the component with the AnswersProvider")
  }

  return context
}