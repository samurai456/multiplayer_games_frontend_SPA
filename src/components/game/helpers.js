
function getXYinds(canv, clientX, clientY){
    const size = canv.width;
    const touchX = clientX - canv.offsetLeft;
    const touchY = clientY - canv.offsetTop;
    if(touchX%(size/3)<=6 || touchY%(size/3)<=6) return
    if(touchX%(size/3)>=(size/3-5) || touchY%(size/3)>=(size/3-5)) return
    const x = Math.floor(touchX/(size/3));
    const y = Math.floor(touchY/(size/3));
    return {x, y}
}

function calculateWinner(moves){
    const winningMoves = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for(let [a, b, c] of winningMoves){
        const [x1, y1] = [a%3, Math.floor(a/3)];
        const [x2, y2] = [b%3, Math.floor(b/3)];
        const [x3, y3] = [c%3, Math.floor(c/3)];
        if(moves[y1][x1] &&
        moves[y1][x1] === moves[y2][x2] &&
        moves[y2][x2] === moves[y3][x3]){
            return {winner: moves[y1][x1], streak: [[x1, y1], [x2, y2], [x3, y3]]}; 
        }
    }
    if(moves.every(i=>i.every(i=>i))) return {winner: -1}
}

export { getXYinds }
export { calculateWinner }