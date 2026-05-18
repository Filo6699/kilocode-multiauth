// kilocode_change - new file
import type { Info } from "@/config/provider"

const alias = /^[a-z0-9-]+$/

export function normalizeOpenAICompatibleAlias(input: string) {
  const raw = input.trim().toLowerCase()
  if (!raw) return { error: "Required" }
  if (!alias.test(raw)) return { error: "Use lowercase letters, digits, and hyphens only" }
  const id = raw.startsWith("openai-compatible-") ? raw : `openai-compatible-${raw}`
  const suffix = id.slice("openai-compatible-".length)
  if (!suffix) return { error: "Alias cannot be empty" }
  return {
    id,
    name: `OpenAI compatible ${suffix.replaceAll("-", " ")}`,
  }
}

export function normalizeBaseURL(input: string) {
  const value = input.trim().replace(/\/+$/, "")
  if (!value) return { error: "Required" }
  try {
    new URL(value)
    return { value }
  } catch {
    return { error: "Enter a valid URL" }
  }
}

export function normalizeModelID(input: string) {
  const value = input.trim()
  if (!value) return { error: "Required" }
  return { value }
}

export function buildProvider(input: {
  alias: { id: string; name: string }
  existing?: Info
  baseURL: string
  modelID: string
}) {
  return {
    [input.alias.id]: {
      name: input.existing?.name ?? input.alias.name,
      npm: "@ai-sdk/openai-compatible",
      env: [],
      options: {
        baseURL: input.baseURL,
      },
      models: {
        [input.modelID]: {
          tool_call: true,
        },
      },
    } satisfies Info,
  }
}
