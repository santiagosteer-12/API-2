const frase = document.getElementById("frase");
const autor = document.getElementById("autor");
const fuente = document.getElementById("fuente");
const boton = document.getElementById("boton");
const spinner = document.getElementById("spinner");

const frasesRespaldo = [
  { texto: "El éxito es la suma de pequeños esfuerzos repetidos cada día.", autor: "Robert Collier" },
  { texto: "No cuentes los días, haz que los días cuenten.", autor: "Muhammad Ali" },
  { texto: "La disciplina es el puente entre las metas y los logros.", autor: "Jim Rohn" },
  { texto: "Cree que puedes y ya estás a medio camino.", autor: "Theodore Roosevelt" },
  { texto: "Siempre parece imposible hasta que se hace.", autor: "Nelson Mandela" }
];

let ultimoNumero = -1;

async function pedirQuotable() {
  const respuesta = await fetch("https://api.quotable.io/quotes/random");
  const datos = await respuesta.json();

  return {
    texto: datos[0].content,
    autor: datos[0].author,
    fuente: "Quotable API"
  };
}
async function pedirRespaldo() {
  const respuesta = await fetch("https://dummyjson.com/quotes/random");
  const datos = await respuesta.json();

  return {
    texto: datos.quote,
    autor: datos.author,
    fuente: "DummyJSON API"
  };
}
async function traducir(texto) {
  const url = "https://api.mymemory.translated.net/get?q=" +
              encodeURIComponent(texto) + "&langpair=en|es";

  const respuesta = await fetch(url);
  const datos = await respuesta.json();
  const traduccion = datos.responseData.translatedText;
  if (datos.responseStatus != 200 || traduccion.includes("MYMEMORY WARNING")) {
    throw new Error("No se pudo traducir");
  }

  return traduccion;
}

async function generarFrase() {
  spinner.style.display = "block";
  frase.textContent = "Cargando frase...";
  frase.classList.add("cargando");
  frase.classList.remove("aparecer");
  autor.textContent = "";
  fuente.textContent = "";
  boton.disabled = true;

  let resultado;

  try {
    resultado = await pedirQuotable();
  } catch (error1) {
    try {
      resultado = await pedirRespaldo();
    } catch (error2) {
      resultado = null;
    }
  }

  if (resultado !== null) {
    try {
      resultado.texto = await traducir(resultado.texto);
      resultado.fuente = resultado.fuente + " + traducción MyMemory";
    } catch (error3) {
      resultado = null;
    }
  }
  
  if (resultado === null) {
    let numero = Math.floor(Math.random() * frasesRespaldo.length);
    while (numero === ultimoNumero) {
      numero = Math.floor(Math.random() * frasesRespaldo.length);
    }
    ultimoNumero = numero;

    resultado = {
      texto: frasesRespaldo[numero].texto,
      autor: frasesRespaldo[numero].autor,
      fuente: "Frase guardada (sin conexión a las APIs)"
    };
  }

  spinner.style.display = "none";
  frase.classList.remove("cargando");
  frase.textContent = '"' + resultado.texto + '"';
  autor.textContent = "- " + resultado.autor;
  fuente.textContent = "Fuente: " + resultado.fuente;
  boton.disabled = false;

  setTimeout(function () {
    frase.classList.add("aparecer");
  }, 10);
}
boton.addEventListener("click", generarFrase);

generarFrase();