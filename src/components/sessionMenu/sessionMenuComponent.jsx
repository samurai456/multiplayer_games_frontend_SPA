import '../gameList/static/customHover.css'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { WsContext } from '../../contexts/wsContext'
import { ToastContext } from '../../contexts/toastContext'

function SessionMenu(){
    const navigate = useNavigate();
    const {game} = useParams();
    const ws = useContext(WsContext);
    const {setToastText, setShowToast} = useContext(ToastContext);
    const [sessions, setSessions] = useState([]);

    useEffect(()=>{
        ws.send({type: 'i-am-joiner', nickname: sessionStorage.nickname, game});
    }, [])

    useEffect(()=>{
        const cb =data=>{
            if(data.type!=='sessions-waiting') return
            if(data.stat==='fail'){
                setToastText('You have instable web connection. Try anain!');
                setShowToast(true);
                delete sessionStorage.nickname;
                navigate('/sign-in');
                return
            }
            setSessions(data.sessionsWaiting)
        }
        ws.addCustomCb({key: 'sessions-waiting-list', cb});
        return ()=>ws.delCbByKey('sessions-waiting-list');
    }, []);

    function handleGoBack(){
        ws.send({type: 'i-am-not-joiner', nickname: sessionStorage.nickname});
    }

    function handleSessionClick(creator){
        ws.send({type: 'join-session', nickname: sessionStorage.nickname, joinTo: creator });
        navigate(`/game/${game}`);
    }

    return(
        <div className="m-5 d-flex flex-column">
            <Link 
                className="btn btn-primary p-3 fs-5 mb-5 align-self-start" 
                to={`/join-create-session/${game}`}
                onClick={handleGoBack}
            >
                Go back
            </Link>
            <div className="rounded bg-light p-3 pe-0 pb-4 row col-11 col-md-9 col-lg-7 col-xl-6 align-self-center">
                <div className="h2 text-center">
                    Select session
                </div>
                <div>{ !sessions.length ? 'No session created, yet': '' }</div>
                {sessions.map(i=>(
                    <div 
                        onClick={()=>handleSessionClick(i.nickname)}
                        key={i.nickname} 
                        className="row custom-hover-list me-0 fs-4 justify-content-around border-bottom text-center py-4 text-nowrap"
                    >
                        <div className="col-md-5 col-11">game: {i.game}</div>
                        <div className="col-md-5 col-11">player: {i.nickname}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export { SessionMenu }





const data = [
    {
        game: 'tic-tac-toe',
        player: 'ninja'
    },
    {
        game: 'tic-tac-toe',
        player: 'sam'
    },
    {
        game: 'tic-tac-toe',
        player: 'bob'
    },
    {
        game: 'checkers',
        player: 'nick'
    },
]