import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { ajaxGet } from '../util/ajax';
import { Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow } from '@material-ui/core';

function GameResult (props) {
  const playerId = useParams().id;
  const [result, setResult] = useState([]);
  const { state } = useLocation();
  const { questionRecords } = state;
  useEffect(() => {
    ajaxGet(`play/${playerId}/results`).then(response => {
      setResult(response)
    })
  }, [])

  let totalScore = 0;
  let totalValue = 0;
  let correctCount = 0;
  function createData (index, value, result, score) {
    index++;
    if (result) {
      score = value;
      correctCount++;
    } else {
      score = 0;
    }
    totalValue += value;
    totalScore += score;
    return { index, value, result, score };
  }
  const rows = [];
  result.forEach((r, i) => {
    return rows.push(createData(i, questionRecords[i].points, r.correct))
  });

  return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Your Game Result </h1>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align='center'>Question index</TableCell>
                <TableCell align="center">Value</TableCell>
                <TableCell align="center">Result</TableCell>
                <TableCell align="center">Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                  <TableRow
                      key={row.index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align={'center'}>
                      {row.index}
                    </TableCell>
                    <TableCell align="center">{row.value}</TableCell>
                    <TableCell align="center">{row.result ? '√' : 'Χ'}</TableCell>
                    <TableCell align="center">{row.score}</TableCell>
                  </TableRow>
              ))}
            </TableBody>
            <TableFooter sx={{ textAlign: 'right' }}>
              <TableRow>
                <TableCell align="center">Count</TableCell>
                <TableCell align="center">Full mark</TableCell>
                <TableCell align="center">Correctness Rate</TableCell>
                <TableCell align="center">Total Score</TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">{questionRecords.length}</TableCell>
                <TableCell align="center">{totalValue}</TableCell>
                <TableCell align="center">{(correctCount / questionRecords.length).toFixed(2)}</TableCell>
                <TableCell align="center">{totalScore}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
  )
}
export default GameResult;
