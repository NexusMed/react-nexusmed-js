import React, { useState, useEffect } from 'react'
import { consult } from 'nexusmed-js'
import { AnswerInput } from 'nexusmed-js/dist/dts/consult/sdk'

export interface IAnswersContext {
  answers: Map<number, consult.AnswerInput>;
  setAnswers: (answers: AnswerInput[]) => void;
  setAnswer: (index: number, answer: AnswerInput) => void;
  setQuestionnaire: (questionnaire: consult.Questionnaire) => void;
}

const initialState: IAnswersContext = {
  answers: new Map<number, consult.AnswerInput>(),
  setAnswers: () => Promise.resolve(),
  setAnswer: () => Promise.resolve(),
  setQuestionnaire: () => Promise.resolve()
}

const AnswersContext = React.createContext<IAnswersContext>(initialState)


export const AnswersProvider: React.FC = ({ children }) => {
  const [answers, _setAnswers] = useState<Map<number, consult.AnswerInput>>(initialState.answers)
  const [questionnaire, _setQuestionnaire] = useState<consult.Questionnaire>()

  const setAnswer = (index: number, answer: AnswerInput) => {
    _setAnswers(answers.set(index, answer))
  }

  const setAnswers = (prefilled: consult.AnswerInput[]) => {
    let answers: Map<number, consult.AnswerInput> = new Map<number, consult.AnswerInput>()
    prefilled.forEach((answer, index) => answers.set(index, answer))
    _setAnswers(answers)
  }

  const setQuestionnaire = (questionnaire: consult.Questionnaire) => {
    _setQuestionnaire(questionnaire)
  }

  return (
    <AnswersContext.Provider value={{
      answers,
      setAnswers,
      setAnswer,
      setQuestionnaire
    }}>
      {children}
    </AnswersContext.Provider>
  )
}

export const useAnswers = (prefilled?: consult.AnswerInput[]) => {
  const context = React.useContext(AnswersContext)

  useEffect(() => {
    // context.setQuestionnaire(props.questionnaire)
    if (prefilled) {
      context.setAnswers(prefilled)
    }
  }, [])

  if (!context) {
    throw Error("Can't access AnswersContext. Wrap the component with the AnswersProvider")
  }

  return context
}