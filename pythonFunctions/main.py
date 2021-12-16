import gkeepapi
import functions_framework
import os
from flask import Request
import json

keep = gkeepapi.Keep()
success = keep.login(os.environ['TEUXTROISROBOTMAIL'], os.environ['TEUXTROISROBOTPWD'])

@functions_framework.http
def getNotes(request):
    keep.sync()
    notes = keep.all()
    
    return json.dumps(notes)


# Get Request with an ID param
@functions_framework.http
def getNoteByID(request: Request):
    keep.sync()
    id = request.args["id"]
    note = keep.get(id)
    if hasattr(note, "items"):        
        items = note.items
        return(json.dumps({"title": note.title, "items": list(map(lambda n: ({"text": n.text, "checked": n.checked }), items))  } ))
    else:
        return( json.dumps({"title": note.title, "text": note.text}))

@functions_framework.http
def updateList(request: Request):
    keep.sync()
    request_json = request.get_json(silent=True)
    # return json.dumps(request_json)
    id = request_json["id"]
    title = request_json["title"]
    items = request_json["items"]
    note = keep.get(id)
    # map(lambda item: item.delete(),  )
    for item in note.items:
        item.delete()
    for item in items:
        note.add(item.text, item.checked)
    note.title = title
    keep.sync()
    return "SUCCESS"

