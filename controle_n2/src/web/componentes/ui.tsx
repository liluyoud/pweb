import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Componentes locais no padrão do shadcn/ui, adaptados para o CSS do projeto.
const variantesBotao = cva("botao", {
  variants: { variant: { default: "botao-principal", outline: "botao-contorno" } },
  defaultVariants: { variant: "default" },
});

export function Button({
  variant, className, ...props
}: ComponentProps<"button"> & VariantProps<typeof variantesBotao>) {
  return <button data-slot="button" className={variantesBotao({ variant, className })} {...props} />;
}

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return <input data-slot="input" className={"campo " + className} {...props} />;
}

export function Card({ className = "", ...props }: ComponentProps<"article">) {
  return <article data-slot="card" className={"cartao " + className} {...props} />;
}
