/*
 * CAMPO DE FOTO
 * Permite escolher uma imagem do computador e mostra a prévia.
 *
 * Como a foto é guardada?
 * Convertemos a imagem em um TEXTO enorme (formato "base64") e salvamos
 * esse texto direto no banco. É simples e não precisa de pasta de uploads.
 * (Em sistemas grandes, o mais comum é guardar o arquivo em um serviço
 *  de armazenamento e salvar no banco só o endereço da imagem.)
 */
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FotoPerfil } from "@/components/FotoPerfil";

const TAMANHO_MAXIMO = 500 * 1024; // 500 KB

type Props = {
  nome: string;
  foto: string | null;
  aoMudar: (novaFoto: string | null) => void;
};

export function CampoFoto({ nome, foto, aoMudar }: Props) {
  function aoEscolherArquivo(arquivo: File | undefined) {
    if (!arquivo) {
      return;
    }
    if (arquivo.size > TAMANHO_MAXIMO) {
      toast.error("Escolha uma imagem de até 500 KB.");
      return;
    }

    // FileReader lê o arquivo; quando terminar, chama o "onload".
    const leitor = new FileReader();
    leitor.onload = () => aoMudar(String(leitor.result));
    leitor.readAsDataURL(arquivo);
  }

  return (
    <div className="flex items-center gap-4">
      <FotoPerfil nome={nome || "?"} foto={foto} tamanho="grande" />

      <div className="flex flex-wrap gap-2">
        {/* O <label> envolve um <input type="file"> escondido:
            clicar no "botão" abre a janela de escolher arquivo. */}
        <Button variant="outline" size="sm" asChild>
          <label className="cursor-pointer">
            Escolher foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(evento) => aoEscolherArquivo(evento.target.files?.[0])}
            />
          </label>
        </Button>

        {foto && (
          <Button variant="ghost" size="sm" type="button" onClick={() => aoMudar(null)}>
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
