import { abrirBanco, caminhoBanco } from "./banco";

const caminho = caminhoBanco();
if (!await Bun.file(caminho).exists()) {
  console.log("Ainda não há banco para consultar. Inicie o Controle N2 primeiro.");
} else {
  const banco = abrirBanco(caminho);
  try {
    const eventos = banco.listarAuditoria();
    if (eventos.length === 0) {
      console.log("Ainda não há eventos de auditoria.");
    } else {
      console.table(eventos);
    }
  } finally {
    banco.fechar();
  }
}
