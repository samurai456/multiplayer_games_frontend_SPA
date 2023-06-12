import { useState, useEffect } from 'react'

function useWinSize(){
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

    useEffect(()=>{
        window.onresize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };
        return ()=> window.onresize = null;
    }, [])

    return size;
}

export { useWinSize }