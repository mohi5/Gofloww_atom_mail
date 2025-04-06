from fastapi import FastAPI
from app.endpoints import email, response
from app.utils.config import llm
# from langchain.cache import InMemoryCache
from langchain_community.cache import InMemoryCache
from langchain.globals import set_llm_cache

app = FastAPI()

# Set up caching
set_llm_cache(InMemoryCache())


# Include routers
# app.include_router(email.router)
# app.include_router(response.router)

app.include_router(response.router, prefix="/api")  # Added prefix for versioning
app.include_router(email.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "GoFlow Atom Mail AI Service"}

# @app.get("/")
# async def root():
#     return {"message": "GoFlow Atom Mail AI Service"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
