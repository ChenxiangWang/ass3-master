import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { createExprLogger } from '../util/logger';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { getSessionResult } from '../store/GameReducer/action';
import ResultTable from '../component/ResultTable';
// import { fakeQuestionsMap } from '../store/QuizReducer/fake';
// import { fakeSessionResults } from '../store/GameReducer/fake';
import { getSessionQuizMap, getUser } from '../util/userControl';
import { fetchQuizzes, updateSessionQuizMap } from '../store/QuizReducer/action';
import { ajaxGet } from '../util/ajax';
const Width = document.documentElement.clientWidth;

// const data = {
//   labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
//   datasets: [
//     {
//       label: 'average response time',
//       backgroundColor: ['purple', 'blue', 'yellow', 'green', 'pink'],
//       borderColor: 'black',
//       borderWidth: 1,
//       hoverBackgroundColor: 'red',
//       hoverBorderColor: 'red',
//       data: [65, 59, 80, 81, 56],
//       fill: 'red',
//     },
//   ],
// };

const emptyFormatted = {
  labels: [],
  datasets: [
    {
      label: 'average response time',
      backgroundColor: [],
      borderColor: 'black',
      borderWidth: 1,
      hoverBackgroundColor: 'red',
      hoverBorderColor: 'red',
      data: [],
      fill: 'red',
    },
  ],
};

const logger = createExprLogger('ChartScreen @ ');

ChartScreen.propTypes = {
  result: PropTypes.object,
  token: PropTypes.string,
  sessionQuizMap: PropTypes.object,
  quizQuestionMap: PropTypes.object,
  getSessionResult: PropTypes.func,
  fetchQuizzes: PropTypes.func,
};

function ChartScreen (props) {
  const sessionId = useParams().id;
  const [sessionRes, setSessionRes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [barData, setBarData] = useState(emptyFormatted);
  const [lineData, setLineData] = useState(emptyFormatted);
  const [playerCount, setplayerCount] = useState({});
  const [sessionResults, setSessionResults] = useState([]);
  const [questions, setQuestions] = useState([]);

  Chart.register(CategoryScale);

  useEffect(() => {
    props.getSessionResult(sessionId, (sessionResponse) => {
      ajaxGet('admin/quiz', {}, getUser()).then(quizResponse => {
        if (quizResponse.quizzes) {
          updateSessionQuizMap(quizResponse.quizzes)
          setSessionRes(sessionResponse.results)
        } else {
          console.log('error',)
        }
      }).catch(error => {
        console.log(error);
      })
    });
  }, []);

  useEffect(() => {
    const sessionQuizMap = getSessionQuizMap();
    logger('getSessionQuizMap --> ' + JSON.stringify(sessionQuizMap));
    const quisID = sessionQuizMap[`${sessionId}`];
    logger('quizID --> ' + quisID);
    // setQuestions(props.quizQuestionMap[quisID])
    ajaxGet(`admin/quiz/${quisID}`, {}, getUser())
      .then((questionRes) => {
        setQuestions(questionRes.questions);
        setSessionResults(sessionRes);
        // setQuestions(fakeQuestionsMap[`${sessionId}`])
        // setSessionResults(fakeSessionResults)
        setplayerCount(sessionResults?.length || 0);
        produceTableData(sessionResults);
        produceBarLineData(sessionResults);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sessionRes, sessionResults]);

  const getQuestionPoints = () => {
    const points = [];
    questions.forEach((element) => {
      points.push(element.points);
    });
    return points;
  };

  const getPersionAnsersTF = (personAnswers) => {
    const ansersTF = [];
    personAnswers.forEach((item) => {
      ansersTF.push(item.correct);
    });
    return ansersTF;
  };

  const getPersionAnsersTFNumber = (personAnswers) => {
    const ansersTF = [];
    personAnswers.forEach((item) => {
      ansersTF.push(item.correct ? 1 : 0);
    });
    return ansersTF;
  };

  const getRightCount = (questions, sessionRes) => {
    const names = [];
    const rightCountMap = {};
    const rightScoreMap = {};
    questions.forEach((question, questionIdx) => {
      names.push(question.body);
      rightCountMap[question.body] = 0;
      rightScoreMap[question.body] = 0;
      sessionRes.forEach((player) => {
        rightCountMap[question.body] += getPersionAnsersTFNumber(player.answers)[questionIdx];
        rightScoreMap[question.body] += getPersionAnsersTFNumber(player.answers)[questionIdx] * question.points;
      });
    });
    const rightCountRate = [];
    const avgScore = [];
    names.forEach((questionName) => {
      rightCountRate.push(rightCountMap[questionName] / playerCount);
      avgScore.push(rightScoreMap[questionName] / playerCount);
    });
    return [names, rightCountRate, avgScore];
  };

  const getPersonScore = (questions, personAnswers) => {
    const points = getQuestionPoints(questions);
    const answers = getPersionAnsersTF(personAnswers);
    let personScore = 0;
    for (let i = 0; i < points.length; i++) {
      personScore += answers[i] ? points[i] : 0;
    }
    return personScore;
  };

  // Table of up to top 5 users and their score
  const produceTableData = () => {
    const tableData = [];
    sessionResults.forEach((item) => {
      tableData.push({
        name: item.name,
        score: getPersonScore(questions, item.answers),
      });
    });
    tableData.sort((a, b) => {
      return b.score - a.score;
    });
    setTableData(tableData);
  };

  // Bar/line chart showing a breakdown of what percentage of people(Y axis) got certain question(X axis) correct
  const produceBarLineData = () => {
    const [names, rightCount, rightScore] = getRightCount(questions, sessionResults)
    const formatBarData = {
      labels: names,
      datasets: [
        {
          label: 'correct answer rate',
          backgroundColor: ['pink', 'green', 'yellow', 'blue', 'grass'],
          borderColor: 'black',
          borderWidth: 1,
          hoverBackgroundColor: 'red',
          hoverBorderColor: 'red',
          data: rightCount,
          fill: 'red',
        },
      ],
    };
    const formatLineData = {
      labels: names,
      datasets: [
        {
          label: 'average score',
          backgroundColor: ['purple', 'blue', 'yellow', 'green', 'pink'],
          borderColor: 'black',
          borderWidth: 1,
          hoverBackgroundColor: 'red',
          hoverBorderColor: 'red',
          data: rightScore,
          fill: 'red',
        },
      ],
    };
    setBarData(formatBarData);
    setLineData(formatLineData);
  };

  return (
    <div style={{ height: 'auto', margin: 20 }}>
      <ResultTable title={'TOP FIVE WINNER'} rows={tableData} />
      <Bar data={barData} width={Width} height="250" />
      <Line data={lineData} width={Width} height="250" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    result: state.get('game').get('sessionResult'),
    token: state.get('user').get('token'),
    sessionQuizMap: state.get('quiz').get('currentSessions'),
    quizQuestionMap: state.get('quiz').get('questions'),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSessionResult: (sessionId, CB) =>
      dispatch(getSessionResult(sessionId, CB)),
    fetchQuizzes: (CB) => dispatch(fetchQuizzes(CB)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartScreen);
// export default ChartScreen;
