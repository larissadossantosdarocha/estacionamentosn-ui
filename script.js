const api = "https://estacionamentosn.vercel.app/";

function normalizePlaca(placa) {
  if (!placa) return "";
  return placa
    .toString()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let payload;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (e) {
    payload = text;
  }

  if (!res.ok) {
    const errMsg =
      (payload && (payload.message || payload.erro)) ||
      (typeof payload === "string" && payload) ||
      `HTTP ${res.status}`;
    const err = new Error(errMsg);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("hidden");
});

async function listarVeiculos() {
  document.getElementById("lista-veiculos").classList.remove("hidden");
  document.getElementById("lista-estadias").classList.add("hidden");

  try {
    const data = await fetchJson(`${api}veiculos`);
    mostrarVeiculos(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Erro ao listar veículos:", err);
    const container = document.getElementById("cards-veiculos");
    container.innerHTML = `<p>Erro ao carregar veículos: ${err.message}</p>`;
  }
}

function mostrarVeiculos(veiculos) {
  const container = document.getElementById("cards-veiculos");
  container.innerHTML = "";

  if (!veiculos.length) {
    container.innerHTML = "<p>Nenhum veículo cadastrado.</p>";
    return;
  }

  veiculos.forEach(v => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <strong>Placa: ${v.placa}</strong>
      <p><b>Proprietário:</b> ${v.proprietario || "-"}</p>
      <p><b>Marca / Modelo:</b> ${v.marca || "-"} ${v.modelo || "-"}</p>
      <p><b>Ano:</b> ${v.ano || "-"}</p>
      <p><b>Cor:</b> ${v.cor || "-"}</p>
      <p><b>Telefone:</b> ${v.telefone || "-"}</p>
    `;

    const btnWrap = document.createElement("div");
    btnWrap.style.marginTop = "8px";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => abrirModalEdicao(v));
    const delBtn = document.createElement("button");
    delBtn.textContent = "Excluir";
    delBtn.addEventListener("click", () => deletarVeiculo(v.placa));
    btnWrap.appendChild(editBtn);
    btnWrap.appendChild(delBtn);
    card.appendChild(btnWrap);

    container.appendChild(card);
  });
}
function abrirModalCadastro() {
  const form = document.getElementById("formVeiculo");
  form.reset();
  delete form.dataset.editando;
  delete form.dataset.placaOriginal;
  document.getElementById("titulo-veiculos").innerText = "Cadastrar Veículo";
  document.getElementById("modal").classList.remove("hidden");
}

function abrirModalEdicao(vehicle) {
  const form = document.getElementById("formVeiculo");
  form.reset();

  for (const campo in vehicle) {
    if (form[campo]) form[campo].value = vehicle[campo] ?? "";
  }

  form.dataset.editando = "true";
  form.dataset.placaOriginal = vehicle.placa;

  document.getElementById("titulo-veiculos").innerText = "Editar Veículo";
  document.getElementById("modal").classList.remove("hidden");
}

function fecharModal() {
  const form = document.getElementById("formVeiculo");
  form.reset();
  delete form.dataset.editando;
  delete form.dataset.placaOriginal;
  document.getElementById("modal").classList.add("hidden");
}

async function updateVehicleWithFallback(placaOriginal, data) {

  const attempts = [
    { method: "PUT", url: `${api}veiculos/${encodeURIComponent(placaOriginal)}`, bodyWithPlaca: false },
    { method: "PATCH", url: `${api}veiculos/${encodeURIComponent(placaOriginal)}`, bodyWithPlaca: false },
    { method: "PUT", url: `${api}veiculos`, bodyWithPlaca: true },
    { method: "PATCH", url: `${api}veiculos`, bodyWithPlaca: true }
  ];

  let lastErr = null;
  for (const att of attempts) {
    try {
      const payload = att.bodyWithPlaca ? { ...data, placaOriginal } : data;
      await fetchJson(att.url, {
        method: att.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      return; 
    } catch (err) {
  
      lastErr = err;
      console.warn(`Tentativa ${att.method} ${att.url} falhou:`, err.message || err);
      continue;
    }
  }

  throw lastErr || new Error("Não foi possível atualizar o veículo (várias tentativas falharam).");
}

document.getElementById("formVeiculo").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form).entries());

  if (data.placa) data.placa = normalizePlaca(data.placa);

  if (data.ano) {
    data.ano = parseInt(data.ano, 10);
    if (isNaN(data.ano)) data.ano = null;
  } else {
    data.ano = null;
  }

  try {
    if (form.dataset.editando) {
      const placaOriginal = form.dataset.placaOriginal;
      await updateVehicleWithFallback(placaOriginal, data);
    } else {
      await fetchJson(`${api}veiculos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    }

    alert("Veículo salvo com sucesso!");
    fecharModal();
    listarVeiculos();
  } catch (err) {
    console.error("Erro ao salvar veículo:", err);
    alert("Erro ao salvar veículo: " + (err.message || err));
  }
});

async function deletarVeiculo(placa) {
  if (!confirm("Deseja excluir este veículo?")) return;
  try {
    await fetchJson(`${api}veiculos/${encodeURIComponent(placa)}`, {
      method: "DELETE"
    });
    listarVeiculos();
  } catch (err) {
    console.error("Erro ao excluir veículo:", err);
    alert("Erro ao excluir veículo: " + (err.message || err));
  }
}

async function listarEstadias() {
  document.getElementById("lista-veiculos").classList.add("hidden");
  document.getElementById("lista-estadias").classList.remove("hidden");

  try {
    const data = await fetchJson(`${api}estadias`);
    const container = document.getElementById("cards-estadias");
    container.innerHTML = "";
    if (!data.length) {
      container.innerHTML = "<p>Nenhuma estadia registrada.</p>";
      return;
    }
    data.forEach(e => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <strong>Placa: ${e.placa}</strong>
        <p><b>Entrada:</b> ${e.entrada}</p>
        <p><b>Saída:</b> ${e.saida || "-"}</p>
        <p><b>Valor:</b> R$ ${e.valor || "-"}</p>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Erro ao listar estadias:", err);
    document.getElementById("cards-estadias").innerHTML = `<p>Erro: ${err.message}</p>`;
  }
}

listarVeiculos();