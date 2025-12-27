import requests

def hello():
    return "Hello from Python!"

if __name__ == "__main__":
    print(hello())
    print(f"requests version: {requests.__version__}")
