import {
  renderHook,
  RenderResult,
  act,
} from "@testing-library/react-hooks/dom"
import { consult } from "nexusmed-js"
import { AnswersProvider, IAnswersContext, useAnswers, Answers } from "./Answers"


beforeEach(() => {
  // to fully reset the state between tests, clear the storage
  localStorage.clear();
  // and reset all mocks
  jest.clearAllMocks();

  // clearAllMocks will impact your other mocks too, so you can optionally reset individual mocks instead:
  // localStorage.setItem.mockClear();
})


describe('setPrefilled', () => {

  test('should populate context with prefilled answers', () => {
    const prefilled: consult.AnswerInput[] = [
      { choice: [0] },
      { text: "Test" }
    ]
    const wrapper: React.FC = ({ children }) => <AnswersProvider>{children}</AnswersProvider>
    const { result } = renderHook(() => useAnswers('a', prefilled), { wrapper })
    const expected: Answers = {}
    expected[0] = prefilled[0]
    expected[1] = prefilled[1]
    expect(result.current.answers['a']).toStrictEqual(expected)
  })

})

describe('updateAnswer', () => {
  let wrapper: React.FC
  let ctx: RenderResult<IAnswersContext>

  beforeEach(() => {
    wrapper = ({ children }) => <AnswersProvider>{children}</AnswersProvider>
    ctx = (renderHook(() => useAnswers('b'), { wrapper })).result
  })

  test('should create new answer', () => {
    act(() => {
      ctx.current.setAnswer('b', 0, {
        text: 'test'
      })
    })
    const expected: Answers = { 'b': { 0: { text: 'test' } } }
    expect(ctx.current.answers['b']).toStrictEqual(expected['b'])
  })

  test('should update existing answer', () => {
    act(() => {
      ctx.current.setAnswer('c', 0, { choice: [1] })
    })
    const expected: Answers = { 'c': { 0: { choice: [1] } } }
    expect(ctx.current.answers['c']).toStrictEqual(expected['c'])
    act(() => {
      ctx.current.setAnswer('c', 0, { text: 'test' })
    })
    expected['c'] = { 0: { text: 'test' } }
    expect(ctx.current.answers['c']).toStrictEqual(expected['c'])
  })

  // test('should have safe defaults', () => {
  //   let ans = ctx.current.answers['b']
  //   ans.values()
  // })
})