import json

def main():
    path = "dataset_reparacoes.json"

    with open(path, "r", encoding='utf-8') as f:
        data = json.load(f)

    list_aux = []

    if "intervencoes" not in data:
        data["intervencoes"] = []

    for reparacao in data["reparacoes"]:
        for intervencao in reparacao["intervencoes"]:
            if intervencao["codigo"] not in list_aux:
                data["intervencoes"].append(intervencao)
                list_aux.append(intervencao["codigo"])

    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

    print("Inserções feitas.")

    return

main()
