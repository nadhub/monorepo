import requests
import fastapi
import time

def hello():
    print("Waiting for 5 seconds...")
    time.sleep(5)
    return "Hello from Python!"

if __name__ == "__main__":
    print(hello())
    print("Waiting for 5 seconds...")
    time.sleep(5)
    print(f"requests version: {requests.__version__}")
    print(f"fastapi version: {fastapi.__version__}")
