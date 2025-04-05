# from langchain.chains import LLMChain
# from langchain.prompts import PromptTemplate
# from app.utils.config import llm

# redaction_prompt = PromptTemplate(
#     input_variables=["text"],
#     template="""Identify and redact PII from this text:
#     {text}
    
#     Replace with [REDACTED] or appropriate placeholders.
#     Return only the redacted version."""
# )

# redaction_chain = LLMChain(llm=llm, prompt=redaction_prompt)

from langchain.prompts import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
from app.utils.config import llm

redaction_prompt = PromptTemplate(
    input_variables=["text"],
    template="""Identify and redact PII from this text:
    {text}
    
    Replace with [REDACTED] or appropriate placeholders.
    Return only the redacted version."""
)

# Updated to use the newer Runnable approach
redaction_chain = redaction_prompt | llm | StrOutputParser()

def redact_text(text: str) -> str:
    """Helper function to redact text using the chain"""
    return redaction_chain.invoke({"text": text})