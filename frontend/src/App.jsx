import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import AppLayout from './component/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuestionList from './pages/QuestionList';
import QuizList from './pages/QuizList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import AuthValidation from './component/AuthValidation';
import Error from './pages/Error';
import JoinGame from './pages/JoinGame';
import ChartScreen from './pages/Chart';
import PlayGame from './pages/PlayGame';
import { Logout } from '@mui/icons-material';
import GameResult from './pages/GameResult';

const darkTheme = createTheme({});

function App () {
  return (
        <ThemeProvider theme={darkTheme}>
            <Routes>
                <Route path={'/'} element={<AppLayout/>}>
                    {/* public url */}
                    <Route path={'login'} element={<Login/>}/>
                    <Route path={'register'} element={<Register/>}/>
                    <Route path={'logout'} element={<Logout/>}/>
                    <Route path={'join'} element={<JoinGame/>}>
                        <Route path={'*'} element={<JoinGame/>}/>
                    </Route>
                    <Route path={'result/:id'} element={<GameResult/>}/>
                    <Route path={'play/:id'} element={<PlayGame/>}/>

                    {/* protected url   */}
                    {/* <Route element={<AuthValidation/>}> */}
                    <Route path={'dashboard'} element={<Dashboard/>}>
                        <Route index element={<QuizList/>}/>
                        <Route path={'quiz/:id'} element={<QuestionList/>}/>
                        <Route path={'chart/:id'} element={<ChartScreen/>}/>
                    </Route>
                    {/* </Route> */}
                    <Route path={'*'} element={<Error message={'Not found'}/>}/>
                </Route>
            </Routes>
        </ThemeProvider>
  );
}

export default App;
