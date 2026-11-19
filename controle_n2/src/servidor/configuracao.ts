export type Configuracao = {
  appKey: string;
  professor: { matricula: string; nascimento: string };
  // Com CONFIAR_PROXY=1, o servidor usa os cabeçalhos X-Forwarded-Proto e X-Real-IP
  // enviados pelo proxy. Só ative quando o servidor não estiver exposto diretamente.
  confiarProxy?: boolean;
};

export function lerConfiguracao(env: NodeJS.ProcessEnv): Configuracao {
  const appKey = env.APP_KEY?.trim() ?? "";
  const matricula = env.PROFESSOR_MATRICULA?.trim() ?? "";
  const nascimento = env.PROFESSOR_DATA_NASCIMENTO?.trim() ?? "";
  if (!/^[a-f\d]{64}$/i.test(appKey)) {
    throw new Error("Defina APP_KEY no .env com 32 bytes aleatórios em hexadecimal.");
  }
  const data = new Date(nascimento);
  if (!/^\d+$/.test(matricula) || !/^\d{4}-\d{2}-\d{2}$/.test(nascimento) ||
    Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== nascimento) {
    throw new Error("Defina a matrícula e a data de nascimento do professor no .env.");
  }
  return { appKey, professor: { matricula, nascimento }, confiarProxy: env.CONFIAR_PROXY?.trim() === "1" };
}
