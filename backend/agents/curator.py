import os
import logging
from pathlib import Path
from dotenv import load_dotenv
from google.genai import types
from google.adk.agents import LlmAgent
from google.adk.models.google_llm import Gemini
from google.adk.runners import InMemoryRunner
from google.adk.sessions import InMemorySessionService
from google.adk.tools import google_search, AgentTool, ToolContext

from devtools import debug



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.info(f"Initializing CuratorAgent...")

# Load environment variables from .env file (project root)
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path)


retry_config = types.HttpRetryOptions(
    attempts=5,  # Maximum retry attempts
    exp_base=7,  # Delay multiplier
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],  # Retry on these HTTP errors
)


class CuratorAgent:
    def __init__(self):
        logger.info("Initializing CuratorAgent...")

        # Get Vertex AI configuration from environment variables (loaded from .env)
        project_id = os.getenv("GOOGLE_CLOUD_PROJECT")
        location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")

        if not project_id:
            logger.error("GOOGLE_CLOUD_PROJECT not found in environment variables.")
            raise ValueError("GOOGLE_CLOUD_PROJECT environment variable is required for Vertex AI")

        logger.info(f"Using Vertex AI with project: {project_id}, location: {location}")

        # Initialize ADK Agent with Vertex AI
        # Vertex AI uses Application Default Credentials (ADC) instead of API key
        self.curator_agent = LlmAgent(
            name="curator_agent",
            model=Gemini(
                model="gemini-2.5-flash-lite",
                project=project_id,
                location=location,
                retry_options=retry_config
            ),
            instruction="""
            You are a helpful typing tutor assistant.
            Your goal is to generate engaging typing practice text based on user interests.
            Always output PLAIN TEXT only. No markdown, no introductions.
            """,
            tools=[google_search],
        )
        logger.info(f"curator_agent initialized successfully")

        # Initialize Runner for executing the agent
        self.curator_runner = InMemoryRunner(self.curator_agent)
        logger.info(f"curator_runner initialized successfully")

    async def process(self, interests: str) -> dict:
        logger.info(f"Processing request with interests: {interests}")
        try:
            prompt = f"""
            Generate a coherent, engaging paragraph (about 100-125 words) for typing practice based on the following topic: "{interests}".

            Rules:
            1. The text should be plain text, no markdown formatting.
            2. It should be grammatically correct and flow well.
            3. Avoid extremely obscure words unless relevant to the topic.
            4. Do not include any intro/outro text like "Here is a paragraph:", just the paragraph itself.
            5. If the topic is related to current events, use the google search tool to get the latest information.
            """

            # Use Runner to execute the agent
            # Use Runner to execute the agent
            # run_debug handles session creation and string input automatically
            events = await self.curator_runner.run_debug(prompt)
            
            text = ""
            for event in events:
                if hasattr(event, 'content') and event.content and event.content.parts:
                    for part in event.content.parts:
                        if hasattr(part, 'text'):
                            text += part.text
            
            debug(text)

            return {"text": text}
        except Exception as e:
            logger.error(f"Error in CuratorAgent (ADK): {e}", exc_info=True)
            raise e


if __name__ == "__main__":
    # Unit test to verify CuratorAgent is working
    print("=" * 60)
    print("Testing CuratorAgent with Vertex AI")
    print("=" * 60)

    try:
        # Initialize the agent
        print("\n1. Initializing CuratorAgent...")
        curator = CuratorAgent()
        print("✓ CuratorAgent initialized successfully")

        # Test with a sample topic
        test_topic = "space exploration and Mars missions"
        print(f"\n2. Testing with topic: '{test_topic}'")

        import asyncio
        result = asyncio.run(curator.process(test_topic))

        # Verify the response
        print("\n3. Response received:")
        print("-" * 60)
        print(result["text"])
        print("-" * 60)

        # Basic validation
        text = result["text"]
        word_count = len(text.split())
        print(f"\n4. Validation:")
        print(f"   - Word count: {word_count}")
        print(f"   - Length check (50-80 words): {'✓ PASS' if 40 <= word_count <= 100 else '✗ FAIL'}")
        print(f"   - Non-empty: {'✓ PASS' if text else '✗ FAIL'}")
        print(f"   - Plain text (no markdown headers): {'✓ PASS' if not text.startswith('#') else '✗ FAIL'}")

        print("\n" + "=" * 60)
        print("✓ All tests passed!")
        print("=" * 60)

    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")
        print("\nTroubleshooting:")
        print("1. Ensure GOOGLE_CLOUD_PROJECT environment variable is set")
        print("2. Ensure you're authenticated with Google Cloud:")
        print("   gcloud auth application-default login")
        print("3. Ensure Vertex AI API is enabled in your project")
        import sys
        sys.exit(1)
