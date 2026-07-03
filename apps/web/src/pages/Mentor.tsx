import { useEffect, useRef, useState } from 'react'
import { Bot, Send, User } from 'lucide-react'
import { api, ApiError } from '@/lib/api-client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'
import type { AiConversationDTO, AiMessageDTO } from '@hackerhood/types'

export function Mentor() {
  const [conversationId, setConversationId] = useState<string | undefined>()
  const [messages, setMessages] = useState<AiMessageDTO[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return

    const userMessage: AiMessageDTO = { id: `local-${Date.now()}`, role: 'user', content: input, createdAt: new Date().toISOString() }
    setMessages((m) => [...m, userMessage])
    setInput('')
    setSending(true)
    setError('')

    try {
      const data = await api.post<{ conversation: AiConversationDTO }>('/api/mentor/messages', { conversationId, content: input })
      setConversationId(data.conversation.id)
      setMessages(data.conversation.messages)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur de communication avec le mentor.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Mentor IA</h1>
        <p className="mt-1 text-sm text-text-muted">Pose tes questions sur tes labs, commandes et méthodologie.</p>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-text-muted">
              <Bot className="mb-3 h-8 w-8" />
              <p className="text-sm">Demande-moi une syntaxe de commande, une explication de concept, ou de l'aide sur un lab bloqué.</p>
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}>
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full', m.role === 'user' ? 'bg-surface-hover' : 'bg-accent/10 text-accent')}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn('max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-2.5 text-sm', m.role === 'user' ? 'bg-surface-hover' : 'bg-accent/5 border border-accent/20')}>
                {m.content}
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex items-center gap-2 text-text-muted">
              <Spinner className="h-4 w-4" /> <span className="text-xs">Le mentor réfléchit…</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && <p className="border-t border-danger/30 bg-danger/10 px-5 py-2 text-sm text-danger">{error}</p>}

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-3">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Écris ta question…" disabled={sending} />
          <Button type="submit" disabled={sending || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}
