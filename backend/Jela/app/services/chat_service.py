from app.services.chatter import get_chatter, models, DEFAULT_MODEL

def process_chat(chat_request):
    if chat_request.model not in models:
        raise ValueError(f"Invalid model. Available models: {', '.join(models)}")

    chatter = get_chatter()
    response = chatter(
        judul=chat_request.judul,
        kategori=chat_request.kategori,
        catatan=chat_request.catatan,
        model=chat_request.model or DEFAULT_MODEL,
        query=chat_request.query,
        temperature=chat_request.temperature,
    )
    return response
