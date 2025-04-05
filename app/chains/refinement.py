from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
from app.utils.config import llm

refinement_prompt = ChatPromptTemplate.from_template(
    """Refine this email draft based on feedback:
    Original draft: {draft}
    Feedback: {feedback}
    
    Please improve the email while maintaining:
    - Original intent
    - Key information
    - Professional tone
    
    Return only the refined version."""
)

refinement_chain = {
    "draft": RunnablePassthrough(),
    "feedback": RunnablePassthrough()
} | refinement_prompt | llm | StrOutputParser()