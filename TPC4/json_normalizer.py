import json

path = "cinema.json"
out_path = "cinema_normalized.json"
id = 1
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

for filme in data["filmes"]:
    filme["id"] = id
    id += 1


with open(out_path, "w", encoding="utf-8") as w:
    json.dump(data, w, ensure_ascii=False)

print("Inserções feitas.")