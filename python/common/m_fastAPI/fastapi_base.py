from fastapi import FastAPI


def create_base_app(root_path: str = "") -> FastAPI:
    """
    Creates a base FastAPI application with common configuration and endpoints.
    """
    app = FastAPI(root_path=root_path)

    return app
