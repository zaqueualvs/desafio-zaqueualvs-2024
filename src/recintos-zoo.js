class RecintosZoo {
  constructor() {
    this.recintos = [
      {
        numero: 1,
        biomas: "savana",
        tamanho: 10,
        animais: [{ especie: "MACACO", quantidade: 3, tamanho: 1 }],
      },
      { numero: 2, biomas: "floresta", tamanho: 5, animais: [] },
      {
        numero: 3,
        biomas: "savana e rio",
        tamanho: 7,
        animais: [{ especie: "GAZELA", quantidade: 1, tamanho: 2 }],
      },
      { numero: 4, biomas: "rio", tamanho: 8, animais: [] },
      {
        numero: 5,
        biomas: "savana",
        tamanho: 9,
        animais: [{ especie: "LEAO", quantidade: 1, tamanho: 3 }],
      },
    ];

    this.animais = {
      LEAO: { tamanho: 3, biomas: ["savana"], carnivoro: true },
      LEOPARDO: { tamanho: 2, biomas: ["savana"], carnivoro: true },
      CROCODILO: { tamanho: 3, biomas: ["rio"], carnivoro: true },
      MACACO: { tamanho: 1, biomas: ["savana", "floresta"], carnivoro: false },
      GAZELA: { tamanho: 2, biomas: ["savana"], carnivoro: false },
      HIPOPOTAMO: { tamanho: 4, biomas: ["savana", "rio"], carnivoro: false },
    };
  }

  analisaRecintos(animal, quantidade) {
    if (!this.animais[animal]) {
      return { erro: "Animal inválido" };
    }
    if (typeof quantidade !== "number" || quantidade <= 0) {
      return { erro: "Quantidade inválida" };
    }
    const anml = this.animais[animal];
    const tamanhoTotal = anml.tamanho * quantidade;

    let recintosViaveis = [];

    for (const recinto of this.recintos) {
      const espacoOcupado = this.calcularEspacoOcupado(recinto.animais);
      const espacoLivre = recinto.tamanho - espacoOcupado;

      if (!this.testarBioma(anml, recinto)) {
        continue;
      }
      if (espacoLivre < tamanhoTotal) {
        continue;
      }

      if (!this.verificarConvivencia(recinto, anml, quantidade, animal)) {
        continue;
      }

      const aux = this.calculaEspacoDiferenteEspecie(recinto, animal);
      const espacoFinal = espacoLivre - tamanhoTotal - aux;
      recintosViaveis.push(
        `Recinto ${recinto.numero} (espaço livre: ${espacoFinal} total: ${recinto.tamanho})`
      );
    }

    if (recintosViaveis.length === 0) {
      return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis };
  }

  calcularEspacoOcupado(animais) {
    let espaco = 0;
    for (const animal of animais) {
      espaco += animal.tamanho * animal.quantidade;
    }
    if (animais.length > 1) {
      espaco += 1;
    }
    return espaco;
  }

  calculaEspacoDiferenteEspecie(recinto, animal) {
    if (
      recinto.animais.length === 0 ||
      recinto.animais[0]?.especie === animal
    ) {
      return 0;
    }
    return 1;
  }

  testarBioma(animal, recinto) {
    for (const bioma of animal.biomas) {
      if (recinto.biomas.includes(bioma)) {
        return true;
      }
    }
    return false;
  }

  verificarConvivencia(recinto, novoAnimal, quantidade, especieNovoAnimal) {
    for (const animal of recinto.animais) {
      const especieExistente = this.animais[animal.especie];
      if (
        (novoAnimal.carnivoro || especieExistente.carnivoro) &&
        animal.especie !== especieNovoAnimal
      ) {
        return false;
      }
    }

    if (
      especieNovoAnimal === "MACACO" &&
      recinto.animais.length === 0 &&
      quantidade < 2
    ) {
      return false;
    }

    return !(
      especieNovoAnimal == "HIPOPOTAMO" &&
      !recinto.biomas.includes("savana e rio") &&
      recinto.animais.length > 0
    );
  }
}
export { RecintosZoo as RecintosZoo };
