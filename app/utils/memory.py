from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import HumanMessage
from app.utils.config import llm
from typing import Optional, Dict, Any

# Store chat histories
store: Dict[str, BaseChatMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# Create a simple chat chain that works with message history
def create_chat_chain(input_text: str, config: Dict[str, Any]):
    # Convert input to proper message format
    human_message = HumanMessage(content=input_text)
    
    # Get chat history for this session
    history = get_session_history(config["configurable"]["session_id"])
    
    # Add new message to history
    history.add_message(human_message)
    
    # Generate response
    response = llm.invoke(history.messages)
    
    # Add AI response to history
    history.add_message(response)
    
    return response.content

# Create the conversation chain with message history
conversation = RunnableWithMessageHistory(
    create_chat_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="history",
)

if __name__ == "__main__":
    # Example usage
    config = {"configurable": {"session_id": "test_session"}}
    
    # First message
    response = conversation.invoke(
        {"input": "Hello, how are you?"},
        config=config
    )
    print("AI:", response)
    
    # Follow-up message
    response = conversation.invoke(
        {"input": "What's the weather today?"},
        config=config
    )
    print("AI:", response)