import { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { WsContext } from '../../contexts/wsContext.jsx'
import { ToastContext } from '../../contexts/toastContext.jsx'

function SignIn(){
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const ws = useContext(WsContext);
    const {setToastText, setShowToast} = useContext(ToastContext);

    useEffect(()=>{
        const cb = data =>{
            if(data.type!=='sign-in-stat') return
            if(data.stat==='fail'){
                setToastText('this nickname is already taken');
                setShowToast(true);
                return
            }
            sessionStorage.setItem('nickname', data.nickname);
            navigate('/');
        }
        ws.addCustomCb({key: 'sign-in', cb});
        return ()=>ws.delCbByKey('sign-in')
    }, []);

    function handleClick(){
        if(!nickname) return
        ws.send({type: 'sign-in', nickname});
    }

    const adaptive = " col-xl-4 col-lg-4 col-md-5 col-sm-8 col-10 mt-5 ";
    return(
        <div className="d-flex justify-content-center align-items-center text-nowrap mt-5">
            <div className={adaptive + 'row justify-content-center p-5 border rounded bg-light'}>
                <label className="control-label h5">
                    Enter your nickname
                </label>
                <input 
                    className="form-control my-1"
                    value={nickname}
                    onChange={e=>setNickname(e.target.value)}
                />
                <div className="row justify-content-end p-0 ">
                    <button
                        className="btn btn-primary col-5 col-sm-4 col-md-3"
                        onClick={handleClick}
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    )
}

export { SignIn }