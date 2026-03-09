# 🌸 Infanto Modas — Site Next.js

Landing page completa para loja de roupas infantil, desenvolvida em Next.js 14 com TypeScript e CSS puro.

## 📁 Estrutura

```
app/
├── layout.tsx          # Cabeçalho (Navbar) + Rodapé (Footer)
├── page.tsx            # Landing page principal
├── globals.css         # Estilos globais + tokens de design
└── components/
    ├── Navbar.tsx       # Navegação responsiva com menu mobile
    ├── Footer.tsx       # Rodapé completo
    ├── WhatsAppButton.tsx  # Botão flutuante e inline de WhatsApp
    ├── Gallery.tsx      # Galeria de fotos
    └── Testimonials.tsx # Depoimentos de clientes
```

## 🚀 Como rodar

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## ✏️ Personalizações essenciais

### 1. Número do WhatsApp
Substitua `5500000000000` pelo número real (com DDI+DDD, sem espaços) em:
- `app/components/Navbar.tsx`
- `app/components/WhatsAppButton.tsx`
- `app/page.tsx`

### 2. Logo
Em `app/components/Navbar.tsx`, substitua a `div.logo-placeholder` por:
```tsx
import Image from 'next/image'
// ...
<Image src="/logo.png" alt="Infanto Modas" width={48} height={48} />
```
Coloque o arquivo `logo.png` dentro da pasta `/public`.

### 3. Fotos dos produtos
Em `app/page.tsx` (highlights) e `app/components/Gallery.tsx`, substitua os emojis por:
```tsx
import Image from 'next/image'
<Image src="/fotos/produto1.jpg" alt="..." fill style={{ objectFit: 'cover' }} />
```

### 4. Marcas
Edite o array `brands` em `app/page.tsx` com as marcas que você realmente trabalha.

### 5. Informações de contato
Atualize endereço, telefone e e-mail em `app/components/Footer.tsx`.

### 6. Redes sociais
Substitua os `href="#"` nos botões de redes sociais no Footer pelos links reais do Instagram, Facebook, etc.

## 🎨 Paleta de cores (CSS Variables)

| Variável        | Cor           | Uso                        |
|----------------|---------------|----------------------------|
| `--rose`       | #F2A7B8       | Rosa principal             |
| `--rose-light` | #FDE8EE       | Fundo suave rosa           |
| `--rose-deep`  | #E07A92       | Botões, destaques          |
| `--mint`       | #A8D8C8       | Cor secundária             |
| `--mint-light` | #E4F5F0       | Fundo suave verde          |
| `--gold`       | #D4A847       | Estrelas, acentos          |
| `--cream`      | #FDF8F3       | Fundo de seções alternadas |
| `--charcoal`   | #3D2E2E       | Textos principais          |

## 📱 Responsividade

- **Desktop** (> 900px): Layout em grid, navbar completa
- **Tablet** (600–900px): Grid simplificado, menu hambúrguer
- **Mobile** (< 600px): Layout em coluna única, botões full-width

## 📦 Dependências

- Next.js 14
- React 18
- TypeScript 5
- CSS puro (sem Tailwind, sem libs externas)
