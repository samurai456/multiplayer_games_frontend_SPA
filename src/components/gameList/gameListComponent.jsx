import ticTacToePng from './static/tic-tac-toe.png'
import checkersPng from './static/checkers.png'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { WsContext } from '../../contexts/wsContext.jsx'
import './static/customHover.css'

function GameList(){
    const ws = useContext(WsContext);

    function handleClick(){
        delete sessionStorage.nickname;
        ws.send({type: "sign-out"});
    }
    
    return(
        <div className="m-5">
            <div className="row justify-content-between">
                <div className="col-sm-3 col-10 h2 mb-3">{sessionStorage.nickname}</div>
                <Link 
                    to="/sign-in"
                    className="btn btn-primary p-3 fs-5 col-11 col-sm-5 col-xl-2 col-lg-3 col-md-4 text-nowrap"
                    onClick={handleClick}
                >
                    Change nickname
                </Link>
            </div>
            <div className="row justify-content-around mt-5">
                <div className="col-lg-4 col-md-5 col-8 row align-items-center my-5">
                    <Link className="col-12 row m-0 p-0" to="join-create-session/ticTacToe">
                        <img src={ticTacToePng} className="custom-hover-icon rounded p-3" />
                    </Link>
                    <div className="h1 text-center mt-4">Tic-Tac-Toe</div>
                </div>
                <div className="col-lg-4 col-md-5 col-8 row align-items-center my-5">
                    <Link className="col-12 row m-0 p-0" to="join-create-session/checkers">
                        <img src={checkersPng} className="custom-hover-icon rounded p-3" />
                    </Link>
                    <div className="h1 text-center mt-4">Checkers</div>
                </div>
            </div>
        </div>
    )
}

export { GameList }