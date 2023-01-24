# Como criar, configurar e publicar uma biblioteca react

Bibliotecas de exemplos:

[https://github.com/paulo-werle/react-library](https://github.com/paulo-werle/react-library)

[https://gitlab.com/paulowerle/react-library](https://gitlab.com/paulowerle/react-library)

Ambos os projetos a cima são desenvolvidos com os passos abaixo, e podem já ser utilizadas para construir nossas bibliotecas, basta fazer o clone e encaixar os componentes no projeto.

Passo a passo do que foi realizado para criar configurar e publicar esse projeto:

## Configurar biblioteca

- Configurando `storybook`
- Configurando `typescript`
- Configurando `rollup`
- Configurando `eslint/prettier`

### Configurando `storybook`

O Storybook é um workshop de front-end para criar componentes e páginas de interface do usuário isoladamente. Com ela conseguimos documentar o uso dos nossos componentes assim como as suas variâncias.

```bash
# Instalando o storybook no projeto:
npx storybook init
```

Isso irá gerar uma pasta `.storybook` onde se encontra o código responsável pela configuração da ferramenta.

Para termos cada componente no storybook podemos criar e documentar o seu uso, em `/src/stories`

### Configurando `typescript`

O TypeScript é uma linguagem de programação fortemente tipada que se baseia em JavaScript, oferecendo melhores ferramentas em qualquer escala.

```bash
# Instalando o typescript no projeto:
npx tsc --init
```

Com isso podemos notar que será criado um arquivo `tsconfig.json` onde é responsável pela configuração do typescript, para o nosso projeto vamos utilizar as seguintes propriedades:

```json
{
  "compilerOptions": {
    "target": "es2016",                       /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */
    "jsx": "react",                           /* Specify what JSX code is generated. */
    "module": "ESNext",                       /* Specify what module code is generated. */
    "moduleResolution": "node",               /* Specify how TypeScript looks up a file from a given module specifier. */
    "declaration": true,                      /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    "emitDeclarationOnly": true,              /* Only output d.ts files and not JavaScript files. */
    "sourceMap": true,                        /* Create source map files for emitted JavaScript files. */
    "outDir": "dist",                         /* Specify an output folder for all emitted files. */
    "declarationDir": "types",                /* Specify the output directory for generated declaration files. */
    "allowSyntheticDefaultImports": true,     /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true,                  /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */
    "forceConsistentCasingInFileNames": true, /* Ensure that casing is correct in imports. */
    "strict": true,                           /* Enable all strict type-checking options. */
    "skipLibCheck": true                      /* Skip type checking all .d.ts files. */
  },
  "exclude": [
    "dist",
    "node_modules",
    "src/stories/*.stories.tsx"
  ]
}
```

### Configurando `rollup`

O Rollup é responsável por compilar nossa biblioteca, transformando pequenos pedaços de código em algo maior e mais complexo, ficando visivel ao navegador em um único arquivo.

```bash
# Instalando o rollup e os plugins necessarios no projeto:
npm install
	rollup
	@rollup/plugin-node-resolve
	@rollup/plugin-commonjs
	@rollup/plugin-typescript
	rollup-plugin-peer-deps-external
	rollup-plugin-minification
	rollup-plugin-dts
	--save-dev
```

Vamos criar um arquivo de configuração para a ferramenta com o seguinte nome `rollup.config.mjs` nele colocaremos as seguintes configurações:

```bash
import pkg from './package.json' assert { type: 'json' };

import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-minification';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser()
    ],
    external: ['react', 'react-dom', 'styled-components']
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()]
  }
];
```

Agora iremos adicionar ao `package.json` as seguintes opções:

```bash
"scripts": {
  "rollup": "rollup -c"
},
"main": "dist/cjs/index.js",
"module": "dist/esm/index.js",
"types": "dist/index.d.ts",
"files": ["dist"],
```

### Configurando `eslint/prettier`

O ESLint analisa estaticamente seu código para encontrar problemas rapidamente. Ele é integrado à maioria dos editores de texto e você pode executar o ESLint como parte de seu pipeline de integração contínua. Utilizando o com o Prettier conseguimos analisar o código e suas formatações para manter padrões e boas praticas.

```bash
# Instalando o eslint/prettier e os plugins necessarios no projeto:
npm install
	eslint
	prettier
	eslint-config-prettier
	eslint-plugin-prettier
	--save-dev

# Inicia a configuração do eslint:
npx eslint --init
```

Para configurar o eslint e o prettier vamos ter arquivos respectivamente chamados `.eslintrc.json` e `.prettierrc` onde podemos fazer todo o controle das ferramentas e como ele vai ser usado no projeto, para isso utilizaremos as seguintes configurações:

```json
/* .eslintrc.json */
{
  "env": {
    "browser": true,
    "es2021": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}

/* .prettierrc */
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "none",
  "jsxBracketSameLine": true
}
```

Para finalizar colocaremos as opções de execução em `package.json`:

```json
"lint": "eslint .",
"lint:fix": "eslint --fix",
"format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc",
```

## Criando biblioteca

Primeiro vamos criar um projeto react, utilizaremos o template de `typescript` para posteriormente compilar o `jsx` e ter a possibilidade de definir os tipos em nossos componentes, criaremos utilizando o comando abaixo:

```bash
# Criar projeto:
npx create-react-app my-app --template typescript
```

Nesse passo é interessante ser definido a estrutura na qual iremos usar para construir nossa biblioteca, pode-se utilizar um estrutura similar a essa, assim temos uma estrutura bem definida para projetos pequenos, médios, e grandes:

```
├── src
│   ├── components
|   │   ├── Button
|   |   │   ├── Button.tsx
|   |   │   └── index.ts
|   │   └── index.ts
│   └── index.ts
├── package.json
└── package-lock.json
```

É importante notar o uso de diversos arquivos `index.ts` no qual temos descrito o seu uso:

```tsx
{/* Utilizado para exportar o componente */}
{/* src/components/Button/index.ts */}
export { default } from "./Button";

{/* Utilizado para exportar as variancias de cada componente */}
{/* src/components/index.ts */}
export { default as Button } from "./Button";

{/* Utilizado para exportar todos os componentes */}
{/* src/index.ts */}
export * from './components';
```

Com isso vamos apagar os arquivos padrões do react na pasta src deixando somente os da estrutura citada a cima, apagaremos também a pasta public.

## Publicando biblioteca

Mostraremos a seguir como se pode fazer a publicação da nossa biblioteca em dois principais repositórios de armazenamento de projetos, ambos os meios são bem similares, a principal diferença seria nos links de identificação

- Publicar biblioteca no `GitHub`
- Publicar biblioteca no `GitLab`

### Publicar biblioteca no `GitHub`

Para publicar um packege utilizaremos o GitHub como repositório para o nosso pacote, com isso primeiro precisamos criar e armazenar nosso projeto como no exemplo abaixo:

[https://github.com/paulo-werle/react-library](https://github.com/paulo-werle/react-library)

Com o repositório criado vamos começar a configurar nosso projeto para então ser publicado, vamos alterar as opções de repositório em nosso `package.json`:

```json
/* Configurações de repositorio */
"repository": {
  "type": "git",
  "url": "https://github.com/<github_user>/<github_project>.git"
},

/* Exemplo de configurações */
"repository": {
  "type": "git",
  "url": "https://github.com/paulo-werle/react-library.git"
},
```

Em seguida criaremos um arquivo chamado `.npmrc` onde vamos vincular o nosso repositório com o pacote do npm:

```

# Registrando packege
@<github_user>:registry=https://npm.pkg.github.com

# Configurando token de publicação
'//npm.pkg.github.com/:_authToken'="${AUTH_TOKEN}"

# Exemplo de registro
@paulo-werle:registry=https://npm.pkg.github.com
```

 Finalizada as configurações no projeto, iremos configurar o GitHub, com isso mandaremos essas alterações feitas até então para o repositório e criaremos nossa chave de autenticação `AUTH_TOKEN` ela podendo ser criada em [Personal Access Token](https://github.com/settings/tokens/new), no momento da criação lembre-se de marcar a opção **write:packages**, para assim poder publicar o pacote em questão

```bash
# Publicando biblioteca
AUTH_TOKEN=ACCESS_TOKEN npm publish
```

Com isso ela já está pronto para o uso, podendo usar em seus projetos. Para utilizá-la conseguimos executar o seguinte comando.

```bash
# Instalando a lib criada
npm install <github_username>/<packege_name>

# Exemplo de instalação
npm install @paulo-werle/react-library
```

### Publicar biblioteca no `GitLab`

Para publicar um packege utilizaremos o GitLab como repositório para o nosso pacote, com isso primeiro precisamos criar e armazenar nosso projeto como no exemplo abaixo:

[https://gitlab.com/paulowerle/react-library](https://gitlab.com/paulowerle/react-library)

Com o repositório criado vamos começar a configurar nosso projeto para então ser publicado, vamos alterar as opções de repositório em nosso `package.json`:

```json
/* Configurações de repositorio */
"repository": {
  "type": "git",
  "url": "https://gitlab.com/<gitlab_user>/<gitlab_project>.git"
},

/* Exemplo de configurações */
"repository": {
  "type": "git",
  "url": "https://gitlab.com/paulowerle/react-library.git"
},
```

Em seguida criaremos um arquivo chamado `.npmrc` onde vamos vincular o nosso repositório com o pacote do npm:

```

# Registrando packege
@<github_user>:registry=https://gitlab.com/api/v4/projects/<gitlab_project_id>/packages/npm/

# Configurando token de publicação
'//gitlab.com/api/v4/projects/<gitlab_project_id>/packages/npm/:_authToken'="${AUTH_TOKEN}"

# Exemplo de registro
@paulowerle:registry=https://gitlab.com/api/v4/projects/42853245/packages/npm/

# Exemplo de configurando
//gitlab.com/api/v4/projects/42853245/packages/npm/:_authToken="${AUTH_TOKEN}"
```

```bash
# Publicando biblioteca
AUTH_TOKEN=ACCESS_TOKEN npm publish
```

Com isso ela já está pronto para o uso, podendo usar em seus projetos. Para utilizá-la conseguimos executar o seguinte comando.

```bash
# Definindo escopo do pacote
npm config set @<gilab_username>:registry https://gitlab.com/api/v4/packages/npm/

# Instalando a lib criada
npm install @<gilab_username>/<packege_name>

# Exemplo de definição de escopo
npm config set @paulowerle:registry https://gitlab.com/api/v4/packages/npm/

# Exemplo de instalação
npm install @paulowerle/react-library
```