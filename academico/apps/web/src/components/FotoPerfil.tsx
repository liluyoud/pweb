/*
 * FOTO DE PERFIL
 * Mostra a foto da pessoa. Se não houver foto, mostra as iniciais do nome.
 */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { iniciais } from "@/lib/formatar";

type Props = {
  nome: string;
  foto: string | null;
  tamanho?: "pequeno" | "grande";
};

export function FotoPerfil({ nome, foto, tamanho = "pequeno" }: Props) {
  const classeTamanho = tamanho === "grande" ? "size-20 text-xl" : "size-9";

  return (
    <Avatar className={classeTamanho}>
      {foto && <AvatarImage src={foto} alt={nome} className="object-cover" />}
      <AvatarFallback className="bg-muted font-medium text-muted-foreground">{iniciais(nome)}</AvatarFallback>
    </Avatar>
  );
}
