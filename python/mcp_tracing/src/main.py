import asyncio
import os

from agents import Agent, Runner, set_tracing_disabled
from agents.extensions.models.litellm_model import LitellmModel
from agents.mcp import MCPServer, MCPServerStdio
from langfuse import get_client, observe

# from openinference.instrumentation.openai_agents import OpenAIAgentsInstrumentor
from openinference.instrumentation.google_genai import GoogleGenAIInstrumentor

from python.mcp_tracing.src.config import AppConfig
from python.mcp_tracing.src.utils.otel_utils import TracedMCPServer

config = AppConfig()
langfuse = get_client()
# Disable OpenAI's built-in tracing since we're using Langfuse
set_tracing_disabled(True)
GoogleGenAIInstrumentor().instrument()


async def run(mcp_server: MCPServer):
    traced_server = TracedMCPServer(mcp_server)

    agent = Agent(
        name="Assistant",
        model=LitellmModel(
            model="gemini/gemini-2.5-flash",
            api_key=config.GOOGLE_API_KEY,
        ),
        instructions="Use the tools to answer the users question.",
        mcp_servers=[traced_server],
    )

    while True:
        message = input("\n\nEnter your question (or 'exit' to quit): ")
        if message.lower() == "exit" or message.lower() == "q":
            break
        print(f"\n\nRunning: {message}")

        @observe(name="agent-run")
        async def run_agent(message: str):
            result = await Runner.run(starting_agent=agent, input=message)
            return result.final_output

        result = await run_agent(message)
        print(result)
        langfuse.flush()


async def main():
    async with MCPServerStdio(
        name="Search server",
        params={
            "command": "python/mcp_tracing/src/search_server",
            "args": [],
            "env": dict(os.environ),
        },
        client_session_timeout_seconds=30,
    ) as server:
        await run(server)


if __name__ == "__main__":
    asyncio.run(main())
