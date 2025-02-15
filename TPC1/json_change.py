import json
import copy

def main():
    path = "dataset_reparacoes.json"
    final = "dataset_final.json"
    id_reparacao = 1
    id_viatura = 1
    id_marca = 1

    with open(path, "r", encoding='utf-8') as f:
        data = json.load(f)

    list_aux = {}

    viaturas_aux = {}

    marcas_aux = {}

    if "viaturas" not in data:
        data["viaturas"] = []

    if "intervencoes" not in data:
        data["intervencoes"] = []

    if "marcas" not in data:
        data["marcas"] = []

    for reparacao in data["reparacoes"]:
        reparacao["id"] = id_reparacao
        id_reparacao += 1

        matricula = reparacao["viatura"]["matricula"]
        marca = reparacao["viatura"]["marca"]

        if matricula not in viaturas_aux:
            reparacao["viatura"]["id"] = id_viatura
            viaturas_aux[matricula] = {
                "id": id_viatura,
                "matricula": matricula,
                "marca": reparacao["viatura"]["marca"],
                "modelo": reparacao["viatura"]["modelo"],
                "reparacoes_ids": []
            }
            id_viatura += 1
        else:
            reparacao["viatura"]["id"] = viaturas_aux[matricula]["id"]


        viaturas_aux[matricula]["reparacoes_ids"].append(reparacao["id"])

        if marca not in marcas_aux:
            marcas_aux[marca] = {
                "id": id_marca,
                "nome": reparacao["viatura"]["marca"],
                "viaturas": []
            }
            id_marca += 1


        marcas_aux[marca]["viaturas"].append({
            "matricula": matricula,
            "id_viatura": viaturas_aux[matricula]["id"]
        })

        reparacao["viatura"] = {
            "id": viaturas_aux[matricula]["id"],
            "matricula": matricula
        }

        for intervencao in reparacao["intervencoes"]:
            if "codigo" in intervencao:
                intervencao["id"] = intervencao.pop("codigo")

            id_intervencao = intervencao["id"]

            if id_intervencao not in list_aux:
                list_aux[id_intervencao] = []


            if (reparacao["id"] not in list_aux[id_intervencao]):
                list_aux[id_intervencao].append(reparacao["id"])

            if not any(i["id"] == id_intervencao for i in data["intervencoes"]):
                copia_intervencao = copy.deepcopy(intervencao)
                data["intervencoes"].append(copia_intervencao)

            intervencao.pop("descricao")            

    for intervencao in data["intervencoes"]:
        intervencao["n_reparacoes"] = len(list_aux[intervencao["id"]])
        intervencao["reparacoes_ids"] = list_aux[intervencao["id"]]

    for matricula, viatura_data in viaturas_aux.items(): 
        if not any(viatura["matricula"] == matricula for viatura in data["viaturas"]):
            viatura_data["n_reparacoes"] = len(viatura_data["reparacoes_ids"])
            data["viaturas"].append(viatura_data)

    for marca, marca_data in marcas_aux.items():
        data["marcas"].append(marca_data)

    with open(final, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)

    print("Inserções feitas.")

    return

main()
