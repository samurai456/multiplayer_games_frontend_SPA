import { TicTacToe } from './ticTacToe'
import { useState, useEffect, useContext } from 'react'
import { WsContext } from '../../contexts/wsContext'
import { ToastContext } from '../../contexts/toastContext'
import { useNavigate } from 'react-router-dom'

function TicTacToeParent({setKey, count}){
    const navigate = useNavigate();
    const ws = useContext(WsContext);
    const {setToastText, setShowToast} = useContext(ToastContext);
    const [tryAgainOffer, setTryAgainOffer] = useState(false);
    const [tryAgain, setTryAgain] = useState(false);
    const [opponentNick, setOpponentNick] = useState('');
    const [symb, setSymb] = useState(count%2? 'X': 'O');
    const sN = symb==='X'? 1: 2;
    const [yourTurn, setYourTurn] = useState(count%2);
    const [moves, setMoves] = useState([[0,0,0], [0,0,0], [0,0,0]]);
    const [winner, setWinner] = useState();

    useEffect(()=>{
        ws.send({type: 'get-opponent-nickname'});
    }, [])

    useEffect(()=>{
        const cb = data =>{
            if(data.type!=='opponent-nickname') return
            setOpponentNick(data.opponentNick)
        };
        ws.addCustomCb({key: 'set-opponent-nick', cb});
        return ()=>ws.delCbByKey('set-opponent-nick');
    }, []);

    useEffect(()=>{
        const cb = data=>{
            if(data.type!=='offer-try-again') return
            setTryAgainOffer(true);
        };
        ws.addCustomCb({key: 'set-offer-try-again', cb});
        return ()=>ws.delCbByKey('set-offer-try-again');
    }, [])

    useEffect(()=>{(tryAgain && tryAgainOffer) && setKey(old=>old+1)});
   
    function handleTryAgain(){
        ws.send({type: 'offer-try-again'});
        if(tryAgainOffer){
            setKey(old=>old+1)
            return
        }
        setTryAgain(true);
    }

    useEffect(()=>{
        const cb = data=>{
            if(data.type!=='exit-session') return
            setToastText('Your opponent exited the game');
            setShowToast(true);
            navigate('/');
        };
        ws.addCustomCb({key: 'quit-session', cb});
        return ()=>ws.delCbByKey('quit-session');
    }, [])

    function handleExit(){
        ws.send({type: 'exit-session'});
        navigate('/');
    }

    let winnerMessage;
    if (winner){
        winnerMessage = 'You lost'
        if(winner===sN) winnerMessage = 'You win!!';
        if(winner===-1) winnerMessage = `it's a draw!`;
    }
    const whoseTurnMsg = yourTurn? `${symb} (You)`: `${symb==='X'?'O':'X'} ("${opponentNick}")`;
    return (
        <div>
            <div className="h2 mt-5 mx-4 mb-4 row justify-content-between">
                <span className="col-sm-5 col-md-7 col-12 mb-3">
                    {(winner)?
                        (!tryAgain?winnerMessage: 'waiting for opponent...'):
                        'Turn of: '+whoseTurnMsg
                    }
                </span>
                <div className="col-sm-6 col-md-5 col-12 text-end">
                    {winner&& (
                        <button
                            disabled={tryAgain}
                            className="btn btn-primary p-3 me-2 my-2 px-4 fs-5"
                            onClick={handleTryAgain}
                        >
                            Try again
                        </button>
                    )}
                    <button
                        className="btn btn-primary p-3 px-4 fs-5"
                        onClick={handleExit}
                    >
                        Exit
                    </button>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <TicTacToe 
                    moves={moves}
                    setMoves={setMoves}  
                    yourTurn={yourTurn} 
                    setYourTurn={setYourTurn} 
                    symb={symb}
                    sN={sN}
                    ws={ws}
                    winner={winner}
                    setWinner={setWinner}
                />
            </div>
        </div>
    )
}

export { TicTacToeParent }