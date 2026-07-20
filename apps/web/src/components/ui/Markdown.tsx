import { useMemo } from 'react'
import { marked } from 'marked'

marked.setOptions({ breaks: true })

export function Markdown({ content, className }: { content: string; className?: string }) {
  const html = useMemo(() => marked.parse(content, { async: false }) as string, [content])
  return <div className={`markdown-body ${className ?? ''}`} dangerouslySetInnerHTML={{ __html: html }} />
}
