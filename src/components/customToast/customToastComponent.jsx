import { Toast } from 'react-bootstrap'
import { ToastContext } from '../../contexts/toastContext.jsx'
import { useContext } from 'react'

function CustomToast() {
  const {toastText, showToast, setShowToast} = useContext(ToastContext);
  
  return (
      <Toast
        onClose={() => setShowToast(false)}
        autohide
        show={showToast}
        delay={1500}
        className='position-absolute m-auto top-0 start-0 end-0 mt-5'
      >
        <Toast.Body>{toastText}</Toast.Body>
      </Toast>
  )
}

export { CustomToast };