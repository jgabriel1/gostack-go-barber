import React, { useEffect, useCallback } from 'react'

import { FiAlertCircle, FiXCircle, FiCheckCircle, FiInfo } from 'react-icons/fi'
import { Container } from './styles'
import { useToast, ToastMessage } from '../../../hooks/toast'

interface ToastProps {
  message: ToastMessage
}

const Toast: React.FC<ToastProps> = ({ message }) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id)
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [removeToast, message.id])

  const getIcon = useCallback((type?: 'success' | 'error' | 'info') => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={20} />
      case 'error':
        return <FiAlertCircle size={20} />
      case 'info':
      default:
        return <FiInfo size={20} />
    }
  }, [])

  return (
    <Container type={message.type} hasDescription={!!message.description}>
      {getIcon(message.type)}

      <div>
        <strong>{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle size={18} />
      </button>
    </Container>
  )
}

export default Toast
