import {
  renderHook,
  RenderResult,
  act
} from "@testing-library/react-hooks/dom"
import { consult } from "nexusmed-js"
import { AnswersProvider, useAnswers } from "./Answers"

describe('setPrefilled', () => {

  test('should populate context with prefilled answers', () => {
    const prefilled: consult.AnswerInput[] = [
      { choice: [0] },
      { text: "Test" }
    ]
    const wrapper: React.FC = ({ children }) => <AnswersProvider>{children}</AnswersProvider>
    const { result } = renderHook(() => useAnswers(prefilled), { wrapper })
    expect(result.current.answers).toStrictEqual(prefilled)
  })

})