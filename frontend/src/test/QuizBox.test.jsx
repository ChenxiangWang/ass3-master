import React from 'react';
import { render, screen } from '@testing-library/react';
import QuizBox from '../component/QuizBox';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../store';
import { fakeQuestionsMap, fakeQuiz } from '../store/QuizReducer/fake';
// import { BrowserRouter as Router, Route } from 'react-router-dom';

describe('Test QuizBox Component', () => {
  test('test QuizBox Snapshot', () => {
    const quiz = fakeQuiz
    console.log(typeof fakeQuiz)
    console.log(fakeQuiz.id);
    const questions = fakeQuestionsMap;
    render(
            <BrowserRouter>
                <Provider store={store}>
                    <QuizBox quiz={quiz} key={0} questions={questions}/>
                </Provider>
            </BrowserRouter>
    );
    const textFieldElement = screen.getByText(/questions/i);
    expect(textFieldElement).toBeInTheDocument();
  });

  test('test QuizBox start function', () => {
    const quiz = fakeQuiz
    console.log(typeof fakeQuiz)
    console.log(fakeQuiz.id);
    const questions = fakeQuestionsMap;
    render(
            <BrowserRouter>
                <Provider store={store}>
                    <QuizBox quiz={quiz} key={0} questions={questions}/>
                </Provider>
            </BrowserRouter>
    );
    const textFieldElement = screen.getByText(/questions/i);
    expect(textFieldElement).toBeInTheDocument();
  });

  test('test QuizBox copy function', () => {
    const quiz = fakeQuiz
    console.log(typeof fakeQuiz)
    console.log(fakeQuiz.id);
    const questions = fakeQuestionsMap;
    render(
            <BrowserRouter>
                <Provider store={store}>
                    <QuizBox quiz={quiz} key={0} questions={questions}/>
                </Provider>
            </BrowserRouter>
    );
    const textFieldElement = screen.getByText(/questions/i);
    expect(textFieldElement).toBeInTheDocument();
  });

  test('test QuizBox advance function', () => {
    const quiz = fakeQuiz
    console.log(typeof fakeQuiz)
    console.log(fakeQuiz.id);
    const questions = fakeQuestionsMap;
    render(
            <BrowserRouter>
                <Provider store={store}>
                    <QuizBox quiz={quiz} key={0} questions={questions}/>
                </Provider>
            </BrowserRouter>
    );
    const textFieldElement = screen.getByText(/questions/i);
    expect(textFieldElement).toBeInTheDocument();
  });

  test('test QuizBox stop function', () => {
    const quiz = fakeQuiz
    console.log(typeof fakeQuiz)
    console.log(fakeQuiz.id);
    const questions = fakeQuestionsMap;
    render(
            <BrowserRouter>
                <Provider store={store}>
                    <QuizBox quiz={quiz} key={0} questions={questions}/>
                </Provider>
            </BrowserRouter>
    );
    const textFieldElement = screen.getByText(/questions/i);
    expect(textFieldElement).toBeInTheDocument();
  });

  test('test ', () => {
    const func = (a, b) => {
      return a + b;
    };
    expect(func(1, 2)).toBe(3);
  });
});
