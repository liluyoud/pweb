# 🎓 Controle Acadêmico: projeto didático de programação web

Um mini sistema de **controle acadêmico** feito para **aprender programação web**.
Ele tem cadastro de **alunos**, **professores**, **disciplinas** e **matrículas** (com notas),
além de um **dashboard** e alguns **relatórios** na tela.

O projeto é **simples de propósito**. Não tem login nem senha, nem nada que atrapalhe o
entendimento. O foco é você entender **como as peças de um sistema web se conectam**.

> 💡 Todo o código está em **português** (variáveis, funções, pastas e comentários)
> para que você possa se concentrar na lógica, e não na tradução.

---

## 📚 Por onde começar a ler?

| Ordem | Arquivo | O que você vai encontrar |
| :---: | --- | --- |
| 1 | **README.md** (este arquivo) | Visão geral e como rodar o projeto |
| 2 | [arquitetura.md](arquitetura.md) | Como as partes do sistema conversam entre si |
| 3 | [tutorial.md](tutorial.md) | Passo a passo, com todos os comandos, para construir o projeto do zero |
| 4 | [Documentação do Acadêmico](docs/README.md) | Rotas, tabelas e exercícios sobre a aplicação |
| 5 | [Material compartilhado](../docs/README.md) | Glossário e guias de TypeScript, React, SQLite, API e Scalar |

Além disso, **cada pasta do projeto tem o seu próprio `README.md`** explicando o que
existe nela e por que ela está ali. Vá navegando pelas pastas e lendo!

---

## 🧰 As ferramentas (a "stack")

"Stack" é o conjunto de ferramentas usadas para construir um sistema.

| Ferramenta | Para que serve | Analogia |
| --- | --- | --- |
| **[Bun](https://bun.sh)** | Roda o código JavaScript/TypeScript fora do navegador, instala pacotes e executa scripts | O "motor" do projeto |
| **TypeScript** | É JavaScript com **tipos**: avisa erros antes de rodar o código | Um corretor ortográfico para código |
| **SQLite** | Banco de dados que fica todo em **um único arquivo** | Um caderno onde os dados ficam guardados |
| **React** | Biblioteca para construir telas a partir de "peças" (componentes) | Peças de LEGO para montar telas |
| **Vite** | Roda o site durante o desenvolvimento e gera a versão final | O "forno" que prepara o site |
| **Tailwind CSS** | Estiliza a tela usando classes prontas (`p-4`, `text-sm`...) | Uma caixa de lápis de cor já organizada |
| **shadcn/ui** | Componentes visuais prontos e bonitos (botões, tabelas, janelas) | Móveis prontos para montar a casa |
| **Scalar** | Gera uma página de documentação interativa da API, a partir de uma descrição OpenAPI | O manual de instruções da API |

---

## 🏗️ O que é um monorepo?

**Repositório** é a pasta onde fica o código de um projeto.
**Monorepo** ("mono" = um só) é quando **vários projetos ficam juntos no mesmo repositório**.

Aqui temos dois programas diferentes, a **API** e o **site**, morando na mesma casa:

```
controle-academico/
│
├── apps/                  ← os PROGRAMAS que rodam
│   ├── api/               ← o servidor: recebe pedidos e fala com o banco (Bun + SQLite)
│   └── web/               ← o site: as telas que o usuário vê (React + shadcn)
│
├── packages/              ← código COMPARTILHADO entre os programas
│   └── tipos/             ← o "formato" de cada dado (Aluno, Professor...)
│
├── docs/                  ← referência e exercícios do Acadêmico
│
├── package.json           ← configura o monorepo e os comandos principais
├── README.md              ← você está aqui
├── arquitetura.md         ← como tudo se conecta
└── tutorial.md            ← como construir do zero
```

**Por que juntar tudo?**

- ✅ Um único `bun install` instala tudo.
- ✅ Um único `bun run dev` liga a API **e** o site.
- ✅ A API e o site **compartilham os tipos** (`packages/tipos`). Se um campo mudar,
  os dois "ficam sabendo" na hora, e o TypeScript aponta o que precisa ser ajustado.

---

## ▶️ Como rodar o projeto

### 1. Instale o Bun (só na primeira vez)

**Windows** (no PowerShell):

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Linux / macOS**:

```bash
curl -fsSL https://bun.sh/install | bash
```

Feche e abra o terminal, e confira com `bun --version`.

### 2. Instale as dependências

Na pasta raiz do projeto:

```bash
bun install
```

### 3. Coloque dados de exemplo no banco (opcional, mas recomendado)

```bash
bun run banco:popular
```

### 4. Ligue tudo

```bash
bun run dev
```

Abra no navegador: **http://localhost:5173** 🎉

| O que | Endereço |
| --- | --- |
| Site (telas) | http://localhost:5173 |
| API (dados em JSON) | http://localhost:3333/api/alunos |
| Documentação da API (Scalar) | http://localhost:3333/api/docs |

> Para desligar, aperte `Ctrl + C` no terminal.

### Outros comandos úteis

| Comando | O que faz |
| --- | --- |
| `bun run dev` | Liga a API e o site ao mesmo tempo |
| `bun run dev:api` | Liga só a API |
| `bun run dev:web` | Liga só o site |
| `bun run banco:popular` | Apaga os dados e coloca dados de exemplo |
| `bun run build` | Gera a versão final do site (pasta `apps/web/dist`) |

> 🗑️ Quer zerar o banco? Apague o arquivo `apps/api/academico.sqlite`.
> Ele será criado de novo (vazio) quando a API ligar.

---

## 🖥️ O que o sistema faz

| Tela | O que tem |
| --- | --- |
| **Dashboard** | Totais, média geral, taxa de aprovação, situação das matrículas e gráficos simples |
| **Alunos** | Cadastro (nome, CPF, matrícula, e-mail, telefone e foto), busca, edição e exclusão |
| **Professores** | Cadastro (nome, CPF, titulação, graduação, e-mail, telefone e foto) |
| **Disciplinas** | Cadastro (nome, curso e carga horária) |
| **Matrículas** | Liga aluno + professor + disciplina em um semestre, com notas N1, N2 e PF |
| **Relatórios** | Boletim do aluno, desempenho por disciplina e turmas por professor |
| **Documentação da API** | Página do Scalar para consultar e testar operações ([guia do Scalar](../docs/scalar.md)) |

### Regra de aprovação

| Situação | Regra |
| --- | --- |
| **Aprovado direto** | Média `(N1 + N2) / 2` maior ou igual a **7** |
| **Prova final** | Média abaixo de 7: o aluno faz a PF |
| **Aprovado na final** | `(média + PF) / 2` maior ou igual a **5** |
| **Reprovado** | `(média + PF) / 2` abaixo de **5** |
| **Cursando** | Enquanto falta alguma nota necessária |

O **status é calculado automaticamente pela API**. Você não digita "aprovado" ou
"reprovado", só as notas. A regra fica em
[apps/api/src/regras/notas.ts](apps/api/src/regras/notas.ts).

---

## ⚠️ Avisos importantes

- **Não há segurança** (login, senha, permissões). Isso é proposital para o estudo,
  mas **nunca** coloque um sistema assim na internet.
- As fotos são guardadas **dentro do banco** como texto (base64). É simples, mas em
  sistemas reais o mais comum é guardar a imagem em outro lugar.
- O [`.gitignore` da raiz](../.gitignore) exclui o banco local `academico.sqlite` do versionamento.
