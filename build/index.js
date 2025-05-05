import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
// Create server instance
const server = new McpServer({
    name: "gym",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
server.tool("log-workout", "Log a workout", {
    workout: z.array(z.object({
        exercise: z.string(),
        sets: z.array(z.object({
            reps: z.number(),
            weight: z.number(),
        })),
        notes: z.string().optional(),
    })),
}, async ({ workout }) => {
    console.log(`Logging workout: ${JSON.stringify(workout)}`);
    return {
        content: [{
                type: "text",
                text: `Workout logged: ${JSON.stringify(workout)}`,
            }],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Gym MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
