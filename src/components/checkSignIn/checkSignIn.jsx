import { Navigate } from 'react-router-dom'

function CheckSignIn({children}){
    if(!sessionStorage.nickname){
        return <Navigate to="/sign-in" />
    }
    return children
}

export { CheckSignIn }