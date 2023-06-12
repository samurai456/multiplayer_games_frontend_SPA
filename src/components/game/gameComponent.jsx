import { TicTacToeParent } from './ticTacToeParent.jsx'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

function Game(){
    const location = useLocation();
    const [key, setKey] = useState(location.state||0);

    return(
        <div>
            <TicTacToeParent key={key} setKey={setKey} count={key} />
        </div>

    )
}

export { Game }

