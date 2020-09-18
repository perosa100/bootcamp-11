import React, { createContext, useCallback, useContext, useState } from 'react'
import { uuid } from 'uuidv4'
import ToastContainer from '../components/ToastContainer'

interface ToastContextData {
  addToast(message: Omit<ToastMessage, 'id'>): void
  removeToast(id: string): void
}
export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  title: string
  description?: string
}
const ToastContext = createContext<ToastContextData>({} as ToastContextData)

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  const addToast = useCallback(
    ({ title, description, type }: Omit<ToastMessage, 'id'>) => {
      const id = uuid()

      const toast = {
        id,
        type,
        title,
        description
      }
      setMessages((state) => [...state, toast])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    // retorna todas as mensagems menos a que é igual id
    setMessages((state) => state.filter((message) => message.id !== id))
  }, [])
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  )
}

function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('use Toast must be used withina ToastProvider')
  }

  return context
}

export { ToastProvider, useToast }
