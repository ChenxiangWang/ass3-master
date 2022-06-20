/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  const hiddenAnswer = {};
  for (const key of Object.keys(question)) {
    if (key !== 'answers') {
      hiddenAnswer[key] = question[key];
    }
  }
  console.log(hiddenAnswer, question);
  return hiddenAnswer;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  return question.answers; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {

  const ids = new Array(question.options.length);
  for (let i = 0; i < ids.length; i++) {
    ids[i] = i;
  }
  return ids; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.time;
};
