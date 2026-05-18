import { describe, expect, test } from "bun:test"
import {
  buildProvider,
  normalizeBaseURL,
  normalizeModelID,
  normalizeOpenAICompatibleAlias,
} from "../../src/kilocode/provider/openai-compatible"

describe("openai-compatible helpers", () => {
  test("normalizes alias with prefix", () => {
    expect(normalizeOpenAICompatibleAlias("local")).toEqual({
      id: "openai-compatible-local",
      name: "OpenAI compatible local",
    })
  })

  test("trims and validates base url", () => {
    expect(normalizeBaseURL("http://localhost:11434/v1/")).toEqual({
      value: "http://localhost:11434/v1",
    })
    expect(normalizeBaseURL("not-a-url")).toEqual({
      error: "Enter a valid URL",
    })
  })

  test("requires model id", () => {
    expect(normalizeModelID(" llama3.1 ")).toEqual({ value: "llama3.1" })
    expect(normalizeModelID("   ")).toEqual({ error: "Required" })
  })

  test("builds provider config", () => {
    expect(
      buildProvider({
        alias: {
          id: "openai-compatible-local",
          name: "OpenAI compatible local",
        },
        baseURL: "http://localhost:11434/v1",
        modelID: "llama3.1",
      }),
    ).toEqual({
      "openai-compatible-local": {
        name: "OpenAI compatible local",
        npm: "@ai-sdk/openai-compatible",
        env: [],
        options: {
          baseURL: "http://localhost:11434/v1",
        },
        models: {
          "llama3.1": {
            tool_call: true,
          },
        },
      },
    })
  })
})
