// kilocode_change - new file
export function aliasMap<T extends { extends?: string }>(providers: Record<string, T | undefined>) {
  const result: Record<string, string> = {}

  const visit = (id: string, seen: Set<string>): string | undefined => {
    const item = providers[id]
    const next = item?.extends
    if (!next) return
    if (seen.has(id) || seen.has(next)) return next
    const root = visit(next, new Set([...seen, id]))
    return root ?? next
  }

  for (const [id, item] of Object.entries(providers)) {
    if (!item?.extends) continue
    const root = visit(id, new Set())
    if (root) result[id] = root
  }

  return result
}

export function isProviderFamily(input: { id: string; extends?: string }, base: string) {
  return input.id === base || input.extends === base
}

export function isModelFamily(input: { providerID: string; extends?: string }, base: string) {
  return input.providerID === base || input.extends === base
}

const openai = /^[a-z0-9-]+$/

export function normalizeOpenAIAlias(input: string) {
  const raw = input.trim().toLowerCase()
  if (!raw) return { error: "Required" }
  if (!openai.test(raw)) return { error: "Use lowercase letters, digits, and hyphens only" }
  const id = raw.startsWith("openai-") ? raw : `openai-${raw}`
  const suffix = id.slice("openai-".length)
  if (!suffix) return { error: "Alias cannot be empty" }
  return {
    id,
    name: `OpenAI ${suffix.replaceAll("-", " ")}`,
  }
}
