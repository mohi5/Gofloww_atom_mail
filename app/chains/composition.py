from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from app.utils.config import llm

composition_prompt = ChatPromptTemplate.from_template(
    """As an AI email assistant, compose an email based on:
    Key points: {key_points}
    Desired tone: {tone}
    Recipient context: {recipient_info}
    Previous interactions: {history}
    
    Generate a professional email that covers all key points."""
)

composition_chain = composition_prompt | llm | StrOutputParser()

print(composition_chain)