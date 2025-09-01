import argparse
import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain_cohere import CohereEmbeddings

# Load environment variables
load_dotenv()

# Constants
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "gemma2-9b-it"
CHROMA_PATH = "chroma_db"

PROMPT_TEMPLATE = """
You are Cura, a knowledgeable medical assistant created by the group Von (an Icelandic word meaning 'hope'), launched on June 10, 2024. Your goal is to assist users by providing clear, accurate, and relevant information.

You will always base your answers on the given context and conversation history.

Instructions:
- If the question is medically related, answer precisely using the medical conversation history and context.
- If the question is general (non-medical), answer using the general conversation history only.
- Always maintain a friendly, approachable tone as if you are talking to a real person.
- Do NOT mention internal terms like 'context', 'history', or 'response' in your answers.
- If you don't know the answer or the information is insufficient, politely say you don't understand or cannot provide an answer.
- Avoid unnecessary or unrelated information.
- Refer to the rephrased question to improve answer accuracy.

Conversation History:
{history}

Context:
{context}

Medical Conversation History:
{medi}

General Conversation History:
{geno}

Expected Response Type:
{expected}

Question asked:
{question}

Rephrased question:
{q_rephrase}

---

Please provide your response now.
"""

# In-memory conversation history storage
conversation_history = []
medical_conversation_history = []
general_conversation_history = []
current_response = ""  

def classify_question(query_text, model):
    if len(conversation_history) >= 2:
        last_convo = " ".join([conversation_history[-2], conversation_history[-1]])
    elif len(conversation_history) == 1:
        last_convo = conversation_history[-1]
    else:
        last_convo = "the conversation just started"
        
    response = model.invoke(f"""Determine whether to respond with 'general' or 'medical' based on the following:
- the current conversation text: {query_text}.
- the last relevant conversation: {last_convo}.
'medical' means the text talks about anything related to medical field, disease, treatment, symptom, health, and such.
'general' means the text is not medically relevant, and can be answered independently without context.
Your answer should be dependent on both conversations because current conversation may be dependent on previous conversation.
Your reply should be a single word.""")

    classification_result = response.content.strip()
    print(f"\n\nTemp: {classification_result}\n\n")

    global current_response

    if "medical" in classification_result.lower():
        print("\nMedical Term Detected\n")
        current_response = "medical"
        return "medical"
    else:
        print("\nGeneral Term Detected\n")
        current_response = "general"
        return "general"

def main():
    model = ChatGroq(api_key=GROQ_API_KEY, model=MODEL)
    print("Hello! 👋 How can I help you today? (type /exit to quit)")

    while True:
        query_text = input("You: ")
        if query_text == "/exit":
            print("Goodbye!")
            break
        category = classify_question(query_text, model)
        query_rag(query_text, category, model)
        if category == "medical":
            medical_conversation_history.append(f"Client: {query_text}")
        else:
            general_conversation_history.append(f"Client: {query_text}")

def query_rag(query_text: str, category: str, model):
    embedding_function = CohereEmbeddings(model="embed-english-light-v2.0", cohere_api_key=COHERE_API_KEY)
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    if category == "medical":
        current_history = medical_conversation_history
    else:
        current_history = general_conversation_history

    if category == "medical":
        if len(medical_conversation_history) >= 2:
            last_medical_convo = " ".join([medical_conversation_history[-2], medical_conversation_history[-1]])
            rephrased_query = f"Previous medical conversation text and reply here: {last_medical_convo}; Current question: {query_text}"
        else:
            rephrased_query = query_text
        print(f"\n\nRephrasing: {rephrased_query}\n\n")
    else:
        rephrased_query = query_text

    results = db.similarity_search_with_score(rephrased_query, k=4)
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    history_text = "\n".join(conversation_history + current_history)

    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    formatted_prompt = prompt_template.format(
        context=context_text,
        history=conversation_history,
        medi=medical_conversation_history,
        geno=general_conversation_history,
        expected=current_response,
        question=query_text,
        q_rephrase=rephrased_query,
    )

    response = model.invoke(formatted_prompt)
    response_text = response.content
    sources = [doc.metadata.get("id", None) for doc, _score in results]

    conversation_history.append(f"Client: {query_text}")
    conversation_history.append(f"Response: {response_text}")

    current_history.append(f"Client: {query_text}")
    current_history.append(f"Response: {response_text}")

    formatted_response = f"{response_text}"

    print(formatted_response)
    print()
    return formatted_response

if __name__ == "__main__":
    main()
