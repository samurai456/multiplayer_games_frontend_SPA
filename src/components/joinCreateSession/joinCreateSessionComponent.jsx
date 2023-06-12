import ticTacToePng from '../gameList/static/tic-tac-toe.png'
import checkersPng from '../gameList/static/checkers.png'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useContext } from 'react'
import { WsContext } from '../../contexts/wsContext.jsx'
import { ToastContext } from '../../contexts/toastContext.jsx'

function JoinCreateSession(){
    const navigate = useNavigate();
    const {game} = useParams();
    const ws = useContext(WsContext);
    const {setToastText, setShowToast} = useContext(ToastContext);
    const [gameTitle, imgSrc] = (game==='ticTacToe')? 
        ['Tic-Tac-Toe', ticTacToePng]: 
        ['Checkers', checkersPng];

    useEffect(()=>{
        const cb = data=>{
            if(data.type!=='session-stat') return
            if(data.stat==='fail'){
                setToastText('You have instable web connection. Try again!');
                setShowToast(true);
                delete sessionStorage.nickname;
                navigate('/sign-in');
                return
            }
            navigate(`/waiting-room/${game}`);
        }
        ws.addCustomCb({key: 'check-session-stat', cb})
        return ()=>ws.delCbByKey('check-session-stat');
    }, []);

    function handleClickCreate(){
        ws.send({type: 'create-session', nickname: sessionStorage.nickname, game});
    }
    
    return (
        <div className="m-5">
            <Link className="btn btn-primary p-3 fs-5" to="/">
                Go back
            </Link>
            <div className="row justify-content-around mt-5">
                <div className="col-lg-4 col-md-5 col-8 row align-items-center my-5">
                    <img src={imgSrc} className="rounded p-3" />
                </div>
                <div className="h1 text-center col-lg-4 col-md-5 col-8 d-flex flex-column justify-content-center my-5">
                    <span>{gameTitle}</span>
                    <button className="btn btn-primary p-3 fs-5 my-3" onClick={handleClickCreate}>
                        Create a session
                    </button>
                    <Link className="btn btn-primary p-3 fs-5" to={`/session-menu/${game}`}>
                        Join a session
                    </Link>
                </div>
            </div>
        </div>
    )
}

export { JoinCreateSession }