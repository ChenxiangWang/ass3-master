import { React } from 'react-dom';
import QuizBox from '../component/QuizBox';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import EmptyQuizBox from '../component/EmptyQuizBox';
import { fetchQuizzes } from '../store/QuizReducer/action';
import { useEffect } from 'react';
QuizList.propTypes = {
  quizzes: PropTypes.object.isRequired,
  fetchQuizzes: PropTypes.func
}

function QuizList (props) {
  const quizzes = props.quizzes;
  useEffect(() => {
    props.fetchQuizzes();
  }, [])
  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: '30px 5%',
        flexWrap: 'wrap',
        alignItems: 'stretch',
      }}>
          <EmptyQuizBox style={{ flex: 1 }}/>
          {quizzes.map((quiz, index) =>
              <QuizBox style={{ flex: 1 }} quiz={quiz} key={index}/>
          )}
      </Box>
  )
}

const mapStateToProps = (state) => {
  return {
    quizzes: state.get('quiz').get('quizzes'),
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchQuizzes: () => dispatch(fetchQuizzes()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuizList);
