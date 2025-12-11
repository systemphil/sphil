import { z } from "zod";

export type ActionState<T> =
    | { error: true; message: string; data: null }
    | { error: false; message: string; data: T | null };

class ActionBuilder<
    TContext = Record<string, unknown>,
    TInputSchema extends z.ZodType = z.ZodVoid,
> {
    private constructor(
        private readonly middleware: () => Promise<TContext>,
        private readonly inputSchema: TInputSchema
    ) {}

    /**
     * Factory method to start a new chain
     *
     * Defaults to z.void() schema
     */
    static build() {
        return new ActionBuilder(async () => ({}), z.void());
    }

    /**
     * Method to add Middleware (e.g., Auth)
     *
     * This returns a NEW procedure with the updated Context type
     *
     * ⚠️ middlewareFn must return an object (even if empty {})
     */
    use<TNewContext extends Record<string, unknown>>(
        middlewareFn: (prevCtx: TContext) => Promise<TNewContext>
    ): ActionBuilder<TNewContext & TContext, TInputSchema> {
        return new ActionBuilder(async () => {
            const prevCtx = await this.middleware();
            const newCtx = await middlewareFn(prevCtx);
            return { ...prevCtx, ...newCtx };
        }, this.inputSchema);
    }

    /**
     * Method to add Input Validation
     */
    input<S extends z.ZodType>(schema: S): ActionBuilder<TContext, S> {
        return new ActionBuilder(this.middleware, schema);
    }

    /**
     * The Final `.action` method (Similar to tRPC .mutation or .query)
     */
    action<TOutput>(
        handler: (args: {
            input: z.infer<TInputSchema>;
            ctx: TContext;
        }) => Promise<TOutput>
    ) {
        return async (
            rawInput: z.infer<TInputSchema>
        ): Promise<ActionState<TOutput>> => {
            try {
                const ctx = await this.middleware();

                const parsed = this.inputSchema.safeParse(rawInput);

                if (!parsed.success) {
                    return {
                        error: true,
                        message: parsed.error.issues[0].message,
                        data: null,
                    };
                }

                const result = await handler({ input: parsed.data, ctx });

                return {
                    error: false,
                    message: "Success",
                    data: result ?? null,
                };
            } catch (e) {
                let errorMessage = "Unknown error";
                if (e instanceof Error) errorMessage = e.message;
                else if (typeof e === "string") errorMessage = e;

                console.error("Action Error:", e);
                return { error: true, message: errorMessage, data: null };
            }
        };
    }
}

export const buildAction = ActionBuilder.build;
