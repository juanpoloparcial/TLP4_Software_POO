const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function preguntar(pregunta) {
  return new Promise((resolve) => rl.question(pregunta, resolve));
}

// ==================== CLASES ====================

class Equipo {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

class Partido {
  constructor(local, visitante) {
    this.local = local;
    this.visitante = visitante;
    this.golesLocal = 0;
    this.golesVisitante = 0;
  }

  async jugar() {
    this.golesLocal = parseInt(await preguntar(`Goles de ${this.local.nombre}: `));
    this.golesVisitante = parseInt(await preguntar(`Goles de ${this.visitante.nombre}: `));

    if (this.golesLocal > this.golesVisitante) return this.local;
    if (this.golesVisitante > this.golesLocal) return this.visitante;

    console.log("Empate detectado, desempate por gol de oro...");
    return await this.desempate();
  }

  async desempate() {
    const ganador = await preguntar(
      `¿Quién gana el gol de oro? (${this.local.nombre}/${this.visitante.nombre}): `
    );
    return ganador === this.local.nombre ? this.local : this.visitante;
  }
}

class Torneo {
  constructor() {
    this.equipos = [];
  }

  async cargarEquipos(cantidad) {
    for (let i = 0; i < cantidad; i++) {
      const nombre = await preguntar(`Nombre del equipo ${i + 1}: `);
      this.equipos.push(new Equipo(nombre));
    }
  }

  mezclarEquipos() {
    for (let i = this.equipos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.equipos[i], this.equipos[j]] = [this.equipos[j], this.equipos[i]];
    }
  }

  mostrarCruces() {
    console.log("\n--- Cruces de semifinales ---");
    console.log(`${this.equipos[0].nombre} vs ${this.equipos[1].nombre}`);
    console.log(`${this.equipos[2].nombre} vs ${this.equipos[3].nombre}`);
  }

  async jugarTorneo() {
    console.log("\n--- SEMIFINAL ---");
    const partido1 = new Partido(this.equipos[0], this.equipos[1]);
    const ganador1 = await partido1.jugar();

    const partido2 = new Partido(this.equipos[2], this.equipos[3]);
    const ganador2 = await partido2.jugar();

    console.log("\n--- FINAL ---");
    const partidoFinal = new Partido(ganador1, ganador2);
    const campeon = await partidoFinal.jugar();

    const subcampeon = campeon === ganador1 ? ganador2 : ganador1;

    console.log("\n--- Resultados Finales ---");
    console.log(`CAMPEÓN: ${campeon.nombre}`);
    console.log(`SUBCAMPEÓN: ${subcampeon.nombre}`);
  }
}

class PartidoAmistoso {
  async jugar() {
    console.log("\n--- Partido Amistoso ---");
    const local = new Equipo(await preguntar("Nombre equipo Local: "));
    const visitante = new Equipo(await preguntar("Nombre equipo Visitante: "));

    const partido = new Partido(local, visitante);
    const ganador = await partido.jugar();

    console.log(`\nResultado: ${local.nombre} ${partido.golesLocal} - ${partido.golesVisitante} ${visitante.nombre}`);
    console.log(ganador ? `Ganador: ${ganador.nombre}` : "Empate");
  }
}

// ==================== INICIO ====================

async function main() {
  const tipo = await preguntar("¿Qué tipo de evento se juega? (Amistoso/Torneo): ");

  if (tipo.toLowerCase() === "amistoso") {
    const amistoso = new PartidoAmistoso();
    await amistoso.jugar();
  } else if (tipo.toLowerCase() === "torneo") {
    const torneo = new Torneo();
    await torneo.cargarEquipos(4);
    torneo.mezclarEquipos();
    torneo.mostrarCruces();
    await torneo.jugarTorneo();
  } else {
    console.log("Tipo de evento no válido.");
  }

  rl.close();
}

main();
