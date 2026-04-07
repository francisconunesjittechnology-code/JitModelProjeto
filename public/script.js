const API = "http://localhost:3000";

const lista = document.getElementById("lista");
const player = document.getElementById("player");
const btnPlay = document.getElementById("btnPlay");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const volume = document.getElementById("volume");
const tempo = document.getElementById("tempo");
const progress = document.getElementById("progress");
const info = document.getElementById("infoMusica");
const capa = document.getElementById("capaAtual");
const form = document.getElementById("formUpload");
const artistaSelect = document.getElementById("artistaSelect");
const formArtista = document.getElementById("formArtista");
const menuFab = document.getElementById("menuFab");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

//Estado Player
let musicas = [];
let indexAtual = 0;
let tocando = false;

// Render lista
function render(data) {
  lista.innerHTML = "";
  musicas = data;

  data.forEach((m, index) => {
    const div = document.createElement("div");
    div.classList.add("card");

    div.innerHTML = `
      <img src="${API}/public${m.capa}">
      <h3>${m.nome}</h3>
      <p>${m.artista}</p>

      <button onclick="tocarIndex(${index})">▶️</button>
      <button onclick="editarMusica(${index})">✏️</button>
      <button onclick="deletarMusica(${m.id})">🗑️</button>
    `;

    lista.appendChild(div);
  });
}

//Deletar Musica
async function deletarMusica(id) {
  const confirmacao = confirm("Tem certeza que quer deletar?");

  if (!confirmacao) return;

  await fetch(API + "/musicas/" + id, {
    method: "DELETE"
  });

  carregarMusicas();
}

//Editar Musica
function editarMusica(index) {
  const musica = musicas[index];

  modal.classList.remove("hidden");

  modalContent.innerHTML = `
    <h3>Editar Música</h3>
    <form id="formEditMusica">
      <input type="text" name="nome" value="${musica.nome}" required>

      <select name="artista_id" id="editArtista"></select>

      
      <label>Nova música (opcional):</label>
      <input type="file" name="audio" accept="audio/*">

      <label>Nova capa (opcional):</label>
      <input type="file" name="capa" accept="image/*">

      <button type="submit">Salvar</button>
    </form>
  `;

  //Carregar Artistas
  fetch(API + "/artistas")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("editArtista");

      data.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id;
        opt.textContent = a.nome;

        if (a.nome === musica.artista) {
          opt.selected = true;
        }

        select.appendChild(opt);
      });
    });

  document.getElementById("formEditMusica")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);

      await fetch(API + "/musicas/" + musica.id, {
        method: "PUT",
        body: formData
      });

      fecharModal();
      carregarMusicas();
    });
}

//Tocar por Indice
function tocarIndex(index) {
  indexAtual = index;
  const musica = musicas[index];

  player.src = API + "/public" + musica.arquivo;
  player.play();

  info.innerText = musica.nome + " - " + musica.artista;
  capa.src = API + "/public" + musica.capa;

  btnPlay.innerText = "⏸️";
  tocando = true;
}

//Play/Pause
function togglePlay() {
  if (!player.src) return;

  if (tocando) {
    player.pause();
    btnPlay.innerText = "▶️";
  } else {
    player.play();
    btnPlay.innerText = "⏸️";
  }

  tocando = !tocando;
}

//Proxima
function proxima() {
  if (musicas.length === 0) return;

  indexAtual = (indexAtual + 1) % musicas.length;
  tocarIndex(indexAtual);
}

//Anterior
function anterior() {
  if (musicas.length === 0) return;

  indexAtual = (indexAtual - 1 + musicas.length) % musicas.length;
  tocarIndex(indexAtual);
}

//Volume
volume.addEventListener("input", () => {
  player.volume = volume.value;
});

//Formatar Tempo
function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60) || 0;
  const sec = Math.floor(segundos % 60) || 0;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

//Progresso
player.addEventListener("timeupdate", () => {
  progress.value = (player.currentTime / player.duration) * 100 || 0;

  tempo.innerText = `${formatarTempo(player.currentTime)} / ${formatarTempo(player.duration)}`;
});

//Controle da Barra
progress.addEventListener("input", () => {
  player.currentTime = (progress.value / 100) * player.duration;
});

//Autoplay
player.addEventListener("ended", () => {
  proxima();
});

//Botoes
btnPlay.onclick = togglePlay;
btnNext.onclick = proxima;
btnPrev.onclick = anterior;

//Busca
function buscar() {
  const termo = document.getElementById("busca").value;

  fetch(API + "/musicas/search?nome=" + termo)
    .then(res => res.json())
    .then(render);
}

//Carregar Musicas
function carregarMusicas() {
  fetch(API + "/musicas")
    .then(res => res.json())
    .then(render);
}

//Upload Musicas
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  await fetch(API + "/musicas/upload", {
    method: "POST",
    body: formData
  });

  alert("Música enviada!");

  carregarMusicas();
});

//Carregar artista no post de musica
function carregarArtistas() {
  fetch(API + "/artistas")
    .then(res => res.json())
    .then(data => {

      const select = document.getElementById("artistaSelect");

      if (select) {
        select.innerHTML = '<option value="">Selecione um artista</option>';

        data.forEach(a => {
          const option = document.createElement("option");
          option.value = a.id;
          option.textContent = a.nome;
          select.appendChild(option);
        });
      }

    });
}

//Adicionar Artista
formArtista.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = formArtista.nome.value;

  await fetch(API + "/artistas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ nome })
  });

  alert("Artista cadastrado!");

  formArtista.reset();

  carregarArtistas();
});

//Abri/Fechar Menu de adicao
function toggleMenu() {
  menuFab.classList.toggle("hidden");
}

//Abrir formulario
function abrirForm(tipo) {
  modal.classList.remove("hidden");
  menuFab.classList.add("hidden");

  if (tipo === "artista") {
    modalContent.innerHTML = `
      <h3>Novo Artista</h3>
      <form id="formArtistaModal">
        <input type="text" name="nome" placeholder="Nome do artista" required>
        <button type="submit">Salvar</button>
      </form>
    `;
    
    document.getElementById("formArtistaModal")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = e.target.nome.value;

        await fetch(API + "/artistas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome })
        });

        fecharModal();
        carregarArtistas();
      });
  }

  if (tipo === "musica") {
    modalContent.innerHTML = `
      <h3>Nova Música</h3>
      <form id="formMusicaModal">
        <input type="text" name="nome" placeholder="Nome da música" required>
        
        <select name="artista_id" id="artistaModal" required></select>

        <label>Nova música:</label>
        <input type="file" name="audio" required>
        <label>Nova capa:</label>
        <input type="file" name="capa" required>

        <button type="submit">Enviar</button>
      </form>
    `;

    //Carregar artistas no select
    fetch(API + "/artistas")
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById("artistaModal");

        data.forEach(a => {
          const opt = document.createElement("option");
          opt.value = a.id;
          opt.textContent = a.nome;
          select.appendChild(opt);
        });
      });

    document.getElementById("formMusicaModal")
      .addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        await fetch(API + "/musicas/upload", {
          method: "POST",
          body: formData
        });

        fecharModal();
        carregarMusicas();
      });
  }
}

function fecharModal() {
  modal.classList.add("hidden");
}

carregarMusicas();
carregarArtistas();