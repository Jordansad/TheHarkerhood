import { GoogleGenAI } from '@google/genai'
import { prisma } from '../lib/prisma'
import { env } from '../lib/env'
import { NotFoundError, AppError } from '../lib/errors'
import type { AiConversationDTO, AiConversationSummaryDTO } from '@hackerhood/types'

const SYSTEM_PROMPT = `Tu es le Mentor IA de The Hackerhood, une communauté de cybersécurité (Red Team & Blue Team).
Tu accompagnes des membres qui pratiquent sur leurs propres labs autorisés : TryHackMe, Hack The Box, VulnHub,
CTF (PicoCTF, HTB CTF, Root-Me...), machines virtuelles personnelles, et préparent des certifications
(eJPT, OSCP, CPTS, PNPT, Security+, CEH, CISSP...).

Dans ce cadre, tu peux et dois être pleinement utile : explique la syntaxe de commandes (nmap, Metasploit, Burp
Suite, BloodHound, hashcat...), la méthodologie de pentest, les techniques de privilege escalation, d'Active
Directory, de reverse engineering, d'analyse forensique, aide à déboguer pourquoi une technique de lab ne
fonctionne pas, explique des concepts (protections mémoire, Kerberos, OWASP Top 10...), et peux interroger
l'utilisateur pour réviser (mode quiz oral).

Reste hors périmètre : cibler des systèmes réels non autorisés, ou générer du code malveillant destiné à un
usage réel contre des tiers. Si une question sort de ce cadre, redirige poliment vers un usage en lab autorisé.

Sois direct, concret, et pédagogue — comme un mentor expérimenté qui a fait le chemin.`

const MODEL = 'gemini-2.5-flash'

function getClient(): GoogleGenAI {
  if (!env.geminiApiKey) {
    throw new AppError(503, "Le Mentor IA n'est pas encore configuré (clé API manquante).")
  }
  return new GoogleGenAI({ apiKey: env.geminiApiKey })
}

export async function listConversations(userId: string): Promise<AiConversationSummaryDTO[]> {
  const conversations = await prisma.aiConversation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  return conversations.map((c) => ({ id: c.id, title: c.title, createdAt: c.createdAt.toISOString() }))
}

export async function getConversation(userId: string, id: string): Promise<AiConversationDTO> {
  const conversation = await prisma.aiConversation.findFirst({
    where: { id, userId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })
  if (!conversation) throw new NotFoundError('Conversation introuvable.')

  return {
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt.toISOString(),
    messages: conversation.messages.map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt.toISOString() })),
  }
}

export async function sendMessage(userId: string, conversationId: string | undefined, content: string): Promise<AiConversationDTO> {
  const client = getClient()

  let conversation = conversationId
    ? await prisma.aiConversation.findFirst({ where: { id: conversationId, userId }, include: { messages: { orderBy: { createdAt: 'asc' } } } })
    : null

  if (!conversation) {
    conversation = await prisma.aiConversation.create({
      data: { userId, title: content.slice(0, 60) },
      include: { messages: true },
    })
  }

  await prisma.aiMessage.create({ data: { conversationId: conversation.id, role: 'user', content } })

  const history = [...conversation.messages, { role: 'user' as const, content }]

  const response = await client.models.generateContent({
    model: MODEL,
    contents: history.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    config: { systemInstruction: SYSTEM_PROMPT },
  })

  const assistantText = response.text ?? "Désolé, je n'ai pas pu générer de réponse."
  await prisma.aiMessage.create({ data: { conversationId: conversation.id, role: 'assistant', content: assistantText } })

  return getConversation(userId, conversation.id)
}
