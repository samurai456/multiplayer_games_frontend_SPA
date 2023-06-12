import { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { WsContext } from '../../contexts/wsContext.jsx'

function WaitingRoom(){
    const {game} = useParams();
    const [points, setPoints] = useState(' .');
    const navigate = useNavigate();
    const ws = useContext(WsContext);

    useEffect(()=>{
        ws.send({type: 'create-session', nickname: sessionStorage.nickname, game});
    }, [])

    useEffect(()=>{
        const intervalId = setInterval(
            ()=>setPoints(old=>old.length>10? ' .': old+' .'),
        700);
        return ()=>clearInterval(intervalId);
    }, [])

    useEffect(()=>{
        const cb = data=>{
            if(data.type!=='player-joined') return
            navigate(`/game/${game}`, {state: 1});
        }
        ws.addCustomCb({key: 'player-joined', cb});
        return ()=>ws.delCbByKey('player-joined');
    }, [])

    function handleClick(){
        ws.send({type: 'cancel-waiting', nickname: sessionStorage.nickname});
        navigate(-1);
    }

    return(
        <div className="m-5">
            <button onClick={handleClick} className="btn btn-primary p-3 fs-5">
                Cancel
            </button>
            <div className="row justify-content-center mt-5">
                <div className="p-4 ps-5 border rounded bg-light col-xl-5 col-lg-6 col-md-7 col-sm-10 col-12 h5 text-start text-nowrap">
                    { 'Waiting for player to join the game' + points }
                </div>
            </div>
        </div>
    )
}

export { WaitingRoom }