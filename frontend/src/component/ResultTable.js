import PropTypes from 'prop-types';
import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

ResultTable.propTypes = {
  title: PropTypes.string,
  rows: PropTypes.array,
};

function ResultTable (props) {
  return (
    <TableContainer component={Paper}>
      <h3 style={{ textAlign: 'center' }}>{props.title}</h3>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Rank</TableCell>
            <TableCell align="center">User Name</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" align={'center'}>
                {idx + 1}
              </TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResultTable;
