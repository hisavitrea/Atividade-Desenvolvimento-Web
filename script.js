// tempo
const TEMPO_TOTAL = 120;

//fases
var fases = [
  {
    titulo: "FASE 1",
    enunciado: "Para entrar na Academia Imperial, diga o nome do Lorde Sith que usa uma máscara preta. (Darth ___)",
    resposta: "vader",
    dicaTexto: "É o vilão mais famoso de Star Wars: Darth Vader."
  },
  {
    titulo: "FASE 2",
    enunciado: "Toque no botão para decifrar a transmissão.",
    resposta: "morte",
    dicaTexto: "É a Estrela da Morte.",
    extraHTML:
      '<button class="btn-pista" onclick="revelarPista(this)">Transmissão interceptada</button>' +
      '<div class="pista-revelada">Destruiu o planeta Alderaan. Final do nome: "Estrela da ___" (5 letras)</div>'
  },
  {
    titulo: "FASE 3",
    enunciado: "Abra o arquivo imperial para descobrir a senha.",
    resposta: "sith",
    dicaTexto: "São os usuários do lado sombrio, com sabre vermelho.",
    extraHTML:
      '<button class="btn-pista" onclick="revelarPista(this)">Arquivo imperial</button>' +
      '<div class="pista-revelada">São os guerreiros do lado sombrio. 4 letras, começa com S.</div>'
  },
  { titulo:"FASE 4", enunciado:"Resolva a sequência lógica: 2, 4, 6, 8, ___", resposta:"10", dicaTexto:"Aumenta de 2 em 2." },
  {
    titulo: "FASE BÔNUS",
    enunciado: "Última senha! Qual é o nome da princesa rebelde, irmã do Luke?",
    resposta: "leia",
    dicaTexto: "Leia Organa."
  }
];

// variaveis de controle do jogo
let faseAtual = 0;
var tempoRestante = TEMPO_TOTAL;
let intervaloCronometro = null;

// troca de tela (so uma section fica com .ativa por vez)
function mostrarTela(id){
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

// comeca o jogo do zero
function comecar(){
  faseAtual = 0;
  tempoRestante = TEMPO_TOTAL;
  mostrarTela("tela-jogo");
  iniciarCronometro();
  carregarFase();
}

function iniciarCronometro(){
  clearInterval(intervaloCronometro);
  atualizarCronometro();
  intervaloCronometro = setInterval(() => {
    tempoRestante--;
    atualizarCronometro();
    if (tempoRestante <= 0){
      clearInterval(intervaloCronometro);
      finalizarJogo(false); // acabou o tempo :(
    }
  }, 1000);
}

function atualizarCronometro(){
  var seg = Math.max(0, tempoRestante);
  const m = String(Math.floor(seg / 60)).padStart(2, "0");
  const s = String(seg % 60).padStart(2, "0");
  const el = document.getElementById("cronometro");
  el.textContent = m + ":" + s;
  el.classList.toggle("urgente", seg <= 30);
}

// mostra a fase atual na tela
function carregarFase(){
  const fase = fases[faseAtual];

  document.getElementById("fase-titulo").textContent = fase.titulo;
  document.getElementById("enunciado").textContent  = fase.enunciado;
  document.getElementById("senha").value = "";
  document.getElementById("mensagem").textContent = "";
  document.getElementById("mensagem").className = "";
  document.getElementById("dica").textContent = "";
  document.getElementById("dica").classList.remove("visivel");
  document.getElementById("conteudo-extra").innerHTML = fase.extraHTML || "";

  // foco no campo (o setTimeout eh pra funcionar no celular tb)
  setTimeout(() => document.getElementById("senha").focus(), 100);
}

// confere a senha digitada
function verificar(){
  const resposta = document.getElementById("senha").value.trim().toLowerCase();
  const fase = fases[faseAtual];
  const msg = document.getElementById("mensagem");

  if (resposta === fase.resposta.toLowerCase()){
    msg.textContent = "✔ Senha correta!";
    msg.className = "ok";

    setTimeout(() => {
      faseAtual++;
      if (faseAtual < fases.length){
        carregarFase();
      } else {
        finalizarJogo(true);
      }
    }, 600);

  } else {
    msg.textContent = "✖ Senha incorreta. Tente de novo.";
    msg.className = "erro";

    // treme a tela pra dar feedback
    const tela = document.getElementById("tela-jogo");
    tela.classList.add("shake");
    setTimeout(() => tela.classList.remove("shake"), 400);
  }
}

// mostra a dica geral da fase
function mostrarDica(){
  const dicaEl = document.getElementById("dica");
  dicaEl.textContent = "💡 " + fases[faseAtual].dicaTexto;
  dicaEl.classList.add("visivel");
}

// revela a pista escondida (fases 2 e 3) - um toque no botao
function revelarPista(botao){
  const pista = botao.nextElementSibling;
  if (pista) pista.classList.add("visivel");
  botao.disabled = true;
  botao.classList.add("usado");
}

// finaliza o jogo (ganhou ou perdeu)
function finalizarJogo(venceu){
  clearInterval(intervaloCronometro);

  const titulo = document.getElementById("titulo-final");
  const resultado = document.getElementById("resultado");

  if (venceu){
    titulo.textContent = "ACESSO LIBERADO";
    var usados = TEMPO_TOTAL - tempoRestante;
    const m = String(Math.floor(usados / 60)).padStart(2, "0");
    const s = String(usados % 60).padStart(2, "0");
    resultado.textContent = `Você concluiu em ${m}:${s} e libertou o sistema. 🚀`;
  } else {
    titulo.textContent = "TEMPO ESGOTADO";
    resultado.textContent =
      `Você completou ${faseAtual} de ${fases.length} fases. O Império venceu desta vez...`;
  }

  mostrarTela("tela-final");
}

// volta pra abertura SEM recarregar a pagina
// (regra do trabalho: atras de cada visitante vem outro)
function reiniciar(){
  clearInterval(intervaloCronometro);
  faseAtual = 0;
  tempoRestante = TEMPO_TOTAL;
  mostrarTela("tela-abertura");
}

// apertar Enter tb testa (pra quem jogar no pc)
document.getElementById("senha").addEventListener("keydown", (e) => {
  if (e.key === "Enter") verificar();
});