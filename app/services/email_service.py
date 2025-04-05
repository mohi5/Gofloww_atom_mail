from langchain.text_splitter import CharacterTextSplitter
from app.utils.config import llm
from app.chains.redaction import redaction_chain

text_splitter = CharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=200
)

def generate_response(email_thread, user_style):
    analysis_prompt = """Summarize this email thread and identify:
    - Main questions needing response
    - Urgency level
    - Appropriate tone
    - Required technical level
    
    Thread: {thread}"""
    
    analysis = llm.invoke(analysis_prompt.format(thread=email_thread))
    
    response_prompt = """Based on this analysis: {analysis}
    And user's preferred style: {style}
    Generate 3 response variations with different approaches."""
    
    return llm.invoke(response_prompt.format(
        analysis=analysis.content,
        style=user_style
    ))

def process_email_for_privacy(email_text):
    chunks = text_splitter.split_text(email_text)
    redacted_chunks = [redaction_chain.run(chunk) for chunk in chunks]
    return " ".join(redacted_chunks)