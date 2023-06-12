import { useRef, useEffect, useState } from 'react'
import { TicTacToeDraw } from './ticTacToeDraw.js'
import { useWinSize } from './useWinSize.jsx'
import { getXYinds, calculateWinner } from './helpers.js'

function TicTacToe({moves, setMoves, yourTurn, setYourTurn, symb, ws, setWinner, winner, sN}){
    const canvRef = useRef();
    const toeRef = useRef();
    const [winWidth, winHeight] = useWinSize();
    const [prevMoves, setPrevMoves] = useState(moves);
    const total = moves.reduce((accum, row)=>row.reduce((acc, i)=>acc+i)+accum, 0);
    
    if(toeRef.current){
        (toeRef.current.s===500 && winWidth<=720) && changeCanvSize(300, moves);
        (toeRef.current.s===300 && winWidth>720) && changeCanvSize(500, moves);
    }

    function changeCanvSize(size, moves){
        canvRef.current.width = size;
        canvRef.current.height = size;
        toeRef.current.changeSize(size, moves);
    }

    useEffect(()=>{
        const s = (winWidth<=720)? 300: 500;
        const canv = canvRef.current; 
        const ctx = canv.getContext('2d');
        canv.width = s;
        canv.height = s;
        const ticTacToe = new TicTacToeDraw(s, canv);
        toeRef.current = ticTacToe;
        ticTacToe.drawBorders();
    }, []);
    
    useEffect(()=>{
        const ticTacToe = toeRef.current;
        moves.forEach((row,y)=>{
            row.forEach((move,x)=>{
                if(move!==prevMoves[y][x]){
                    if(move===1) ticTacToe.drawX({x,y});
                    if(move===2) ticTacToe.drawO({x,y});
                }
            })
        })
        setPrevMoves(moves.map(i=>[...i]));
    }, [total])

    useEffect(()=>{
        const winner = calculateWinner(moves);
        if(!winner) return
        setWinner(winner.winner);
        if(winner.winner===-1) return
        const ticTacToe = toeRef.current;
        ticTacToe.drawStreak(winner.streak);
    }, [total])

    useEffect(()=>{
        const cb = data =>{
            if(data.type!=='new-moves') return
            setMoves(data.moves);
            setYourTurn(true)
        };
        ws.addCustomCb({key: 'set-opponent-move', cb});
        return ()=>ws.delCbByKey('set-opponent-move');
    }, [])

    function handleClick(e){
        if(!yourTurn || winner) return
        const canv = canvRef.current;
        const ticTacToe = toeRef.current;
        const inds = getXYinds(canv, e.clientX, e.clientY);
        if(!inds) return
        const {x,y} = inds;
        if(moves[y][x]) return
        const newMoves = moves.map((row,rowI)=>{
            if(rowI===y) {
                return [...row.slice(0,x), sN, ...row.slice(x+1)];
            }
            return [...row]
        });
        setMoves(newMoves);
        setYourTurn(false);
        ws.send({type: 'new-moves', moves: newMoves});
    }

    return(
        <div className="some">
            <canvas ref={canvRef} onClick={handleClick}>
                Your browser don't support "Canvas"
            </canvas>
        </div>
    )
}

export { TicTacToe }