/**
 * Ambient declarations for the DSH host APIs this plugin imports.
 *
 * Only the surface the plugin actually uses is declared; grow this file as
 * new host APIs are adopted. Runtime behavior is checked by the offline
 * tests and the live probes, not by these types.
 *
 * @module types/dsh
 */

declare module '@deepseek-ai/dsh-tools' {
  /** One model-facing content block returned by a tool renderer. */
  export interface ToolContentBlock {
    type: string
    text?: string
    attachment?: unknown
    [key: string]: unknown
  }

  /** Options accepted by `defineTool`. */
  export interface DefineToolOptions<TArgs, TValue> {
    name: string
    description: string
    parameters: Record<string, unknown>
    output: {
      schema: Record<string, unknown>
      render(args: TArgs, value: TValue): ToolContentBlock[]
    }
    execute(args: TArgs, exec: { signal: AbortSignal }): Promise<TValue> | TValue
    timeoutMs?: number
    isConcurrencySafe?(args: TArgs): boolean
  }

  /**
   * Compile one tool definition for `ctx.tools.register()`.
   *
   * @param options - tool definition
   * @returns a registry-ready definition
   */
  export function defineTool<TArgs = Record<string, unknown>, TValue = unknown>(
    options: DefineToolOptions<TArgs, TValue>,
  ): unknown
}

declare module '@deepseek-ai/schemastery' {
  /** One chainable schema value. */
  export interface Schema {
    /** Validate/coerce a value against this schema. */
    (value: unknown): unknown
    default(value: unknown): Schema
    min(value: number): Schema
    max(value: number): Schema
    step(value: number): Schema
    description(text: string): Schema
  }

  /** The `schemastery` schema factory. */
  export interface Schemastery {
    object(shape: Record<string, Schema>): Schema
    string(): Schema
    number(): Schema
    natural(): Schema
    boolean(): Schema
    union(values: readonly unknown[]): Schema
  }

  const z: Schemastery
  export default z
}
