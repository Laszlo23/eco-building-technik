import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { MessageCircle, X, Send, Loader2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { UIMessage } from 'ai'

// Helper to extract text from UIMessage parts
function getUIMessageText(msg: UIMessage): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

// Product recommendation card component
function ProductCard({ product, onViewDetails }: { 
  product: { id: number; name: string; category: string; description: string; price: string; specs: string[] }
  onViewDetails: (id: number) => void 
}) {
  return (
    <div className="bg-stone-50 border border-stone-200 p-3 mb-2">
      <div className="text-xs text-stone-400 uppercase tracking-wide mb-1">{product.category}</div>
      <div className="font-serif text-sm text-stone-900 mb-1">{product.name}</div>
      <div className="text-xs text-stone-500 mb-2 line-clamp-2">{product.description}</div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-900">{product.price}</span>
        <button 
          onClick={() => onViewDetails(product.id)}
          className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1"
        >
          Details <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

interface ChatWidgetProps {
  onViewProduct?: (productId: number) => void
}

export function ChatWidget({ onViewProduct }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return
    
    sendMessage({ text: inputValue })
    setInputValue('')
  }

  const handleViewDetails = (productId: number) => {
    if (onViewProduct) {
      onViewProduct(productId)
      setIsOpen(false)
    }
  }

  // Extract tool results for product recommendations
  const renderMessage = (message: UIMessage) => {
    const textContent = getUIMessageText(message)
    const toolParts = message.parts?.filter(p => p.type === 'tool-invocation') || []
    
    return (
      <div key={message.id}>
        {/* Text content */}
        {textContent && (
          <div
            className={`mb-3 p-3 max-w-[85%] ${
              message.role === 'user'
                ? 'ml-auto bg-stone-900 text-white'
                : 'mr-auto bg-white border border-stone-200 text-stone-700'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{textContent}</p>
          </div>
        )}
        
        {/* Tool results (product recommendations) */}
        {toolParts.map((part: any, idx: number) => {
          if (part.toolInvocation?.toolName === 'recommendProducts' && part.toolInvocation?.state === 'result') {
            const result = part.toolInvocation.result
            if (result?.recommendations?.length > 0) {
              return (
                <div key={idx} className="mb-3 mr-auto max-w-[90%]">
                  <div className="text-xs text-stone-400 uppercase tracking-wide mb-2">Empfehlungen</div>
                  {result.recommendations.map((product: any) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )
            }
          }
          return null
        })}
      </div>
    )
  }

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-lg transition-all ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Chat öffnen"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white border border-stone-200 shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        style={{ height: 'min(600px, calc(100vh - 6rem))' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div>
            <h3 className="font-serif text-lg text-stone-900">Verkaufsberater</h3>
            <p className="text-xs text-stone-400">ECO Building Technik</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
            aria-label="Chat schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-stone-50">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-stone-200 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-stone-500" />
              </div>
              <p className="font-serif text-stone-900 mb-2">Willkommen!</p>
              <p className="text-sm text-stone-500 leading-relaxed">
                Ich helfe Ihnen gerne bei der Auswahl der richtigen Heizung oder Smart Home Produkte.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => {
                    setInputValue('Ich suche eine Wärmepumpe für mein Haus.')
                  }}
                  className="w-full text-left text-sm p-3 bg-white border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  Wärmepumpe finden
                </button>
                <button
                  onClick={() => {
                    setInputValue('Welche Smart Home Produkte haben Sie?')
                  }}
                  className="w-full text-left text-sm p-3 bg-white border border-stone-200 hover:border-stone-300 transition-colors"
                >
                  Smart Home Produkte
                </button>
              </div>
            </div>
          )}

          {messages.map(renderMessage)}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-stone-400 text-sm mb-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Schreibt...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-stone-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ihre Frage..."
              className="flex-1 px-3 py-2 text-sm border border-stone-200 focus:outline-none focus:border-stone-400 bg-white"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="bg-stone-900 hover:bg-stone-800 text-white px-4 rounded-none"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
