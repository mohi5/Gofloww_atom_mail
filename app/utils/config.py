from dotenv import load_dotenv
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

load_dotenv()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# # Initialize LangChain with Gemini
# llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=GOOGLE_API_KEY)

# # 1st prompt -> detailed report
# tempelate1 = PromptTemplate(
#     template='write a detailed reporn on {topic}',
#     input_variables=['topic']
# )

# # 2nd prompt -> summary
# tempelate2 = PromptTemplate(
#     template='write a 5 line summary on the following text. \n {text}',
#     input_variables=['text']
# )

# prompt1 = tempelate1.invoke({'topic':'black hole'})

# result = llm.invoke(prompt1)

# prompt2 = tempelate2.invoke({'text':result.content})

# result1 = llm.invoke(prompt2)

# print(result1.content)
