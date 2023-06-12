import 'bootstrap/dist/css/bootstrap.min.css'
import { CheckSignIn } from './components/checkSignIn/checkSignIn.jsx'
import { SignIn } from './components/signIn/signInComponent.jsx'
import { GameList } from './components/gameList/gameListComponent.jsx'
import { JoinCreateSession } from './components/joinCreateSession/joinCreateSessionComponent.jsx'
import { WaitingRoom } from './components/waitingRoom/waitingRoomComponent.jsx'
import { SessionMenu } from './components/sessionMenu/sessionMenuComponent.jsx'
import { Game } from './components/game/gameComponent.jsx'
import { Routes, Route } from 'react-router-dom'
import { WsContext } from './contexts/wsContext.jsx'
import { ToastContext } from './contexts/toastContext.jsx'
import { CustomWs } from './wsConnection/wsConnection.js'
import { useMemo, useState, useEffect } from 'react'
import { CustomToast } from './components/customToast/customToastComponent.jsx'

function App() {
  const ws = useMemo(()=>new CustomWs(`ws://${location.host}`), [])
  const [toastText, setToastText] = useState('');
  const [showToast, setShowToast] = useState(false);
  ws.onmessage=m=>console.log(m);

  useMemo(()=>{
    if(!sessionStorage.nickname) return
    ws.send({type: 'sign-in', nickname: sessionStorage.nickname, from: 'useMemo'});
  }, []);
  
  return (
    <div>
      <ToastContext.Provider value={{toastText, setToastText, showToast, setShowToast}}>
        <WsContext.Provider value={ws}>
          <Routes>
            <Route path="/sign-in" element={ <SignIn /> } />
            <Route path="/" element={
              <CheckSignIn>
                <GameList />
              </CheckSignIn>
            } />
            <Route path="/join-create-session/:game" element={
              <CheckSignIn>
                <JoinCreateSession />
              </CheckSignIn>
            } />
            <Route path="/waiting-room/:game" element={
              <CheckSignIn>
                <WaitingRoom />
              </CheckSignIn>
            } />
            <Route path="/session-menu/:game" element={
              <CheckSignIn>
                <SessionMenu />
              </CheckSignIn>
            } />
            <Route path="/game/:game" element={
              <CheckSignIn>
                <Game />
              </CheckSignIn>
            } />
          </Routes>
          <CustomToast />
        </WsContext.Provider>
      </ToastContext.Provider>
    </div>
  )
}

export default App
