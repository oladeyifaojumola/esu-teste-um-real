
/*
 * ÈṢÙ — WORKER DE TESTE
 * Pagamento real: R$ 1,00
 * InfinitePay: $templooladeyi
 * Imagem original: IMG_0722.png
 *
 * Arquivo: worker-teste.js
 * Projeto separado da loja oficial.
 */

import imagemOriginal from "./IMG_0722.png";

const IMAGEM = new Uint8Array(imagemOriginal);

const CONFIG = {
  handle: "templooladeyi",
  api: "https://api.checkout.infinitepay.io",
  valor: 100,
  descricao: "ÈṢÙ - Teste técnico de entrega",
  arquivo: "IMG_0722.png"
};

function responder(dados, status = 200) {
  return Response.json(dados, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

function pagina(html) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    }
  });
}

function origemValida(request) {
  const origem = request.headers.get("Origin");

  return !origem ||
    origem === new URL(request.url).origin;
}

function linkPermitido(destino) {
  try {
    const url = new URL(destino);

    if (url.protocol !== "https:") {
      return false;
    }

    return [
      "infinitepay.io",
      "infinitepay.com.br"
    ].some(dominio =>
      url.hostname === dominio ||
      url.hostname.endsWith("." + dominio)
    );

  } catch {
    return false;
  }
}

function identificadoresValidos(dados) {
  return (
    typeof dados?.order_nsu === "string" &&
    /^ESU-TESTE-[0-9a-f-]{36}$/i.test(
      dados.order_nsu
    ) &&
    typeof dados?.transaction_nsu === "string" &&
    dados.transaction_nsu.length > 0 &&
    dados.transaction_nsu.length <= 200 &&
    typeof dados?.slug === "string" &&
    dados.slug.length > 0 &&
    dados.slug.length <= 200
  );
}

async function lerJSON(request) {
  const tipo =
    request.headers.get("content-type") || "";

  if (!tipo.includes("application/json")) {
    throw new Error("Formato inválido.");
  }

  const corpo = await request.text();

  if (corpo.length > 4096) {
    throw new Error("Dados muito grandes.");
  }

  return JSON.parse(corpo);
}

// PÁGINA PRINCIPAL DO TESTE

function paginaInicial() {
  return pagina(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport"
 content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#100d0e">
<meta name="robots" content="noindex,nofollow">
<title>Teste InfinitePay | ÈṢÙ</title>

<style>
:root {
  color-scheme:dark;
  --bg:#0c0b0d;
  --gold:#d4ab7c;
  --text:#f3e6d6;
  --muted:#b9a79b;
}

* {box-sizing:border-box}

body {
  margin:0;
  min-height:100vh;
  background:
    radial-gradient(
      ellipse at top,
      #39241b,
      var(--bg) 70%
    );
  color:var(--text);
  font-family:
    system-ui,-apple-system,sans-serif;
}

main {
  max-width:620px;
  margin:7vh auto;
  padding:24px;
  text-align:center;
}

h1 {
  font:normal 64px Georgia,serif;
  color:var(--gold);
  margin:0 0 15px;
}

.subtitle {
  color:var(--muted);
  line-height:1.7;
}

.card {
  background:#1b1718;
  border:1px solid #886143;
  border-radius:19px;
  padding:35px 25px;
  margin-top:35px;
}

h2 {
  font:normal 29px Georgia,serif;
}

.price {
  font:normal 54px Georgia,serif;
  color:#e8c193;
  margin:25px 0;
}

p {
  line-height:1.8;
}

button {
  width:100%;
  padding:18px;
  background:
    linear-gradient(120deg,#976a46,#65412b);
  border:1px solid #c09260;
  border-radius:11px;
  color:#fff0de;
  font-size:16px;
  font-weight:700;
  cursor:pointer;
}

button:disabled {
  opacity:.5;
  cursor:wait;
}

#error {
  color:#ffc1b1;
  margin-top:18px;
  overflow-wrap:anywhere;
}

small {
  display:block;
  margin-top:25px;
  color:var(--muted);
  line-height:1.7;
}
</style>
</head>

<body>
<main>
  <h1>ÈṢÙ</h1>

  <p class="subtitle">
    O Òrìṣà que Muitos Não Compreendem
  </p>

  <section class="card">
    <h2>Teste de pagamento InfinitePay</h2>

    <p>Teste técnico de entrega digital</p>

    <div class="price">R$ 1,00</div>

    <button id="pagar" type="button">
      Gerar pagamento de R$ 1,00
    </button>

    <p id="error" role="status"></p>

    <small>
      Esta cobrança é real e independente
      da loja oficial.

      A imagem original de teste somente
      será disponibilizada após confirmação
      do pagamento pela InfinitePay.

      Poderão existir taxas de processamento.
    </small>
  </section>
</main>

<script>
(() => {
  const botao =
    document.getElementById("pagar");

  const erro =
    document.getElementById("error");

  botao.addEventListener("click", async () => {
    botao.disabled = true;
    botao.textContent =
      "Conectando à InfinitePay...";

    erro.textContent = "";

    try {
      const resposta = await fetch("/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: "{}"
      });

      const dados = await resposta.json();

      if (
        !resposta.ok ||
        !dados.checkout_url
      ) {
        throw new Error(
          dados.error ||
          "Não foi possível criar o pagamento."
        );
      }

      window.location.assign(
        dados.checkout_url
      );

    } catch (e) {
      erro.textContent =
        e.message || "Erro desconhecido.";

      botao.disabled = false;
      botao.textContent =
        "Gerar pagamento de R$ 1,00";
    }
  });
})();
</script>
</body>
</html>`);
}

// GERAR COBRANÇA DE R$ 1,00

async function criarPagamento(request) {
  if (request.method !== "POST") {
    return responder({
      error: "Método não permitido."
    }, 405);
  }

  if (!origemValida(request)) {
    return responder({
      error: "Origem não autorizada."
    }, 403);
  }

  const order_nsu =
    "ESU-TESTE-" + crypto.randomUUID();

  const redirect_url = new URL(
    "/retorno",
    request.url
  ).href;

  const pedido = {
    handle: CONFIG.handle,
    order_nsu,
    redirect_url,
    items: [
      {
        description: CONFIG.descricao,
        quantity: 1,
        price: CONFIG.valor
      }
    ]
  };

  try {
    const resposta = await fetch(
      CONFIG.api + "/links",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(pedido)
      }
    );

    let dados;

    try {
      dados = await resposta.json();
    } catch {
      return responder({
        error:
          "A InfinitePay retornou uma resposta inválida."
      }, 502);
    }

    if (!resposta.ok) {
      return responder({
        error:
          "A InfinitePay recusou a criação da cobrança.",
        http_status: resposta.status
      }, 502);
    }

    const destino =
      dados?.url ||
      dados?.checkout_url ||
      dados?.payment_url ||
      dados?.link;

    if (
      typeof destino !== "string" ||
      !linkPermitido(destino)
    ) {
      return responder({
        error:
          "A InfinitePay não retornou um endereço de pagamento reconhecido."
      }, 502);
    }

    return responder({
      success: true,
      order_nsu,
      amount: CONFIG.valor,
      checkout_url: destino
    });

  } catch {
    return responder({
      error:
        "Não foi possível conectar à InfinitePay."
    }, 502);
  }
}

// CONFERIR TRANSAÇÃO

async function verificarPagamento(dados) {
  if (!identificadoresValidos(dados)) {
    return {
      verified: false,
      error:
        "Dados da transação incompletos."
    };
  }

  try {
    const resposta = await fetch(
      CONFIG.api + "/payment_check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          handle: CONFIG.handle,
          order_nsu: dados.order_nsu,
          transaction_nsu: dados.transaction_nsu,
          slug: dados.slug
        })
      }
    );

    if (!resposta.ok) {
      return {
        verified: false,
        error:
          "A InfinitePay não confirmou a transação."
      };
    }

    const pagamento = await resposta.json();

    const confirmado =
      pagamento?.success === true &&
      pagamento?.paid === true &&
      pagamento?.amount === CONFIG.valor;

    if (!confirmado) {
      return {
        verified: false,
        error:
          "Pagamento pendente, não aprovado ou valor divergente."
      };
    }

    return {
      verified: true,
      amount: CONFIG.valor
    };

  } catch {
    return {
      verified: false,
      error:
        "Falha na verificação do pagamento."
    };
  }
}

// PÁGINA DE RETORNO

function paginaRetorno() {
  return pagina(`<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport"
 content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<meta name="theme-color" content="#100d0e">
<title>Confirmação | ÈṢÙ</title>

<style>
:root{color-scheme:dark}
*{box-sizing:border-box}

body {
  margin:0;
  min-height:100vh;
  background:
    radial-gradient(
      ellipse at top,#39241b,#0c0b0d 70%
    );
  color:#f3e6d6;
  font-family:system-ui,-apple-system,sans-serif;
}

main {
  max-width:620px;
  margin:8vh auto;
  padding:24px;
  text-align:center;
}

h1 {
  font:normal 60px Georgia,serif;
  color:#d4ab7c;
}

.card {
  padding:35px 24px;
  background:#1b1718;
  border:1px solid #886143;
  border-radius:19px;
}

h2 {
  font:normal 28px Georgia,serif;
}

p {
  line-height:1.8;
}

a {
  display:inline-block;
  padding:15px 20px;
  margin:12px 5px;
  background:#785239;
  color:#fff0de;
  border:1px solid #a77e58;
  border-radius:10px;
  text-decoration:none;
}

#download {
  display:none;
}

small {
  display:block;
  margin-top:22px;
  color:#baa79a;
  line-height:1.7;
}
</style>
</head>

<body>
<main>
  <h1>ÈṢÙ</h1>

  <section class="card">
    <h2>Confirmação do teste</h2>

    <p id="status" role="status">
      Consultando a InfinitePay...
    </p>

    <a id="download" href="#">
      Baixar imagem original
    </a>

    <a href="/">
      Voltar ao início
    </a>

    <small>
      O arquivo IMG_0722.png somente será
      entregue após a confirmação do
      pagamento real de R$ 1,00.
    </small>
  </section>
</main>

<script>
(async () => {
  const params = new URLSearchParams(
    location.search
  );

  const dados = {
    order_nsu:
      params.get("order_nsu"),
    transaction_nsu:
      params.get("transaction_nsu"),
    slug:
      params.get("slug")
  };

  const status =
    document.getElementById("status");

  if (
    !dados.order_nsu ||
    !dados.transaction_nsu ||
    !dados.slug
  ) {
    status.textContent =
      "Não recebemos os dados necessários para confirmar o pagamento.";
    return;
  }

  try {
    const resposta = await fetch(
      "/verificar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      }
    );

    const resultado =
      await resposta.json();

    if (
      !resposta.ok ||
      !resultado.verified
    ) {
      status.textContent =
        resultado.error ||
        "Pagamento ainda não confirmado.";
      return;
    }

    status.textContent =
      "Pagamento de R$ 1,00 confirmado pela InfinitePay.";

    const link =
      document.getElementById("download");

    link.href =
      "/arquivo?" +
      new URLSearchParams(dados).toString();

    link.style.display = "inline-block";

  } catch {
    status.textContent =
      "Não foi possível consultar o pagamento.";
  }
})();
</script>
</body>
</html>`);
}

// ROTAS DO WORKER DE TESTE

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const rota = url.pathname;

    if (rota === "/") {
      return paginaInicial();
    }

    if (rota === "/status") {
      return responder({
        project: "esu-teste-um-real",
        server: "online",
        handle: CONFIG.handle,
        amount_cents: CONFIG.valor,
        amount_brl: "R$ 1,00",
        image_embedded:
          IMAGEM.byteLength > 0,
        image_name: CONFIG.arquivo,
        image_bytes:
          IMAGEM.byteLength,
        payment_gateway:
          "InfinitePay",
        real_charge: true,
        test_only: true
      });
    }

    if (rota === "/criar") {
      return criarPagamento(request);
    }

    if (rota === "/retorno") {
      return paginaRetorno();
    }

    if (rota === "/verificar") {
      if (request.method !== "POST") {
        return responder({
          error: "Método não permitido."
        }, 405);
      }

      if (!origemValida(request)) {
        return responder({
          error: "Origem não autorizada."
        }, 403);
      }

      try {
        const dados = await lerJSON(request);

        return responder(
          await verificarPagamento(dados)
        );

      } catch {
        return responder({
          error:
            "Dados da verificação inválidos."
        }, 400);
      }
    }

    if (rota === "/arquivo") {
      if (request.method !== "GET") {
        return responder({
          error: "Método não permitido."
        }, 405);
      }

      const dados = {
        order_nsu:
          url.searchParams.get("order_nsu"),
        transaction_nsu:
          url.searchParams.get("transaction_nsu"),
        slug:
          url.searchParams.get("slug")
      };

      const resultado =
        await verificarPagamento(dados);

      if (!resultado.verified) {
        return responder({
          error:
            "Download bloqueado: " +
            resultado.error
        }, 403);
      }

      return new Response(
        IMAGEM.slice(),
        {
          headers: {
            "Content-Type": "image/png",
            "Content-Disposition":
              'attachment; filename="IMG_0722.png"',
            "Cache-Control":
              "private, no-store",
            "Referrer-Policy":
              "no-referrer",
            "X-Content-Type-Options":
              "nosniff"
          }
        }
      );
    }

    return responder({
      error: "Página não encontrada."
    }, 404);
  }
};
