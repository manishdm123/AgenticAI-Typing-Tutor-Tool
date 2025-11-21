
from google.adk.runners import InMemoryRunner
import inspect

print("Signature of InMemoryRunner.run:")
try:
    print(inspect.signature(InMemoryRunner.run))
except Exception as e:
    print(f"Could not get signature: {e}")

print("\nHelp on InMemoryRunner.run:")
help(InMemoryRunner.run)
