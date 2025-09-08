// lib/db.js
import Dexie, { type EntityTable } from "dexie";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
}

const db = new Dexie("mercadoDatabase") as Dexie & {
  products: EntityTable<Product, "id">;
};

// Define o schema do banco de dados
// Aqui criamos uma "tabela" chamada 'products'
// '++id' significa que será um ID auto-incrementado
// 'name' é um índice para facilitar a busca
db.version(1).stores({
  products: "++id, name, price, stock, imageUrl",
});

db.on("populate", async () => {
  try {
    // Adiciona todos os produtos da lista inicial de uma vez
    await db.products.bulkAdd([
      {
        name: "Arroz",
        price: 3.0,
        stock: 100,
        imageUrl:
          "https://bocavicosa.com.br/web/image/product.template/763/image_1024?unique=c0b7635",
      },
      {
        name: "Açúcar",
        price: 3.0,
        stock: 100,
        imageUrl:
          "https://media.licdn.com/dms/image/v2/C4D12AQGHmkIF0Mc45g/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520077197462?e=2147483647&v=beta&t=VEv2v-gHKerSC7ixLRn1saJyZF-WEBXVSFq8UsI3LhA",
      },
      {
        name: "Feijão",
        price: 4.0,
        stock: 100,
        imageUrl:
          "https://alegrafoods.com.br/wp-content/uploads/2021/07/pasted-image-0.png",
      },
      {
        name: "Óleo",
        price: 5.0,
        stock: 100,
        imageUrl:
          "https://sp.cdifoodservice.com.br/wp-content/uploads/2020/10/oleo-soja-1-300x300.png",
      },
      {
        name: "Sal",
        price: 2.5,
        stock: 100,
        imageUrl:
          "https://static1.minhavida.com.br/ingredients/c7/f0/ff/f3/sal-amp_hero-1.jpg",
      },
      {
        name: "Macarrão",
        price: 3.0,
        stock: 100,
        imageUrl:
          "https://www.divvino.com.br/blog/wp-content/uploads/2025/05/tipos-de-massa-de-macarrao-guia.jpg",
      },
      {
        name: "Farinha de Trigo",
        price: 2.5,
        stock: 100,
        imageUrl:
          "https://conteudo.imguol.com.br/blogs/221/files/2018/04/iStock-861019856-1024x683.jpg",
      },
      {
        name: "Fubá",
        price: 2.0,
        stock: 100,
        imageUrl:
          "https://blog.ingredientesonline.com.br/wp-content/uploads/2020/12/Fuba-Mimoso-conheca-o-alimento-livre-de-transgenicos.jpg",
      },
      {
        name: "Polenta",
        price: 2.0,
        stock: 100,
        imageUrl:
          "https://cdn0.tudoreceitas.com/pt/posts/4/9/1/polenta_mole_194_600.jpg",
      },
      {
        name: "Molho de Tomate",
        price: 2.0,
        stock: 100,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfFrPpCAwjtwiCszEQJ1TlnWVk5q_UFcKZ2A&s",
      },
      {
        name: "Café",
        price: 20.0,
        stock: 100,
        imageUrl:
          "https://agroadvance.com.br/wp-content/uploads/2023/07/cafe-arabica.png",
      },
      {
        name: "Bolacha",
        price: 4.0,
        stock: 100,
        imageUrl:
          "https://www.assai.com.br/sites/default/files/styles/otimizado/public/shutterstock_1720324474.jpeg?itok=40_-MhNq",
      },
      {
        name: "Sardinha",
        price: 2.0,
        stock: 100,
        imageUrl:
          "https://saude.abril.com.br/wp-content/uploads/2016/09/sardinha_0.jpg?crop=1&resize=1212,909",
      },
      {
        name: "Detergente",
        price: 2.0,
        stock: 100,
        imageUrl:
          "https://ibassets.com.br/ib.item.image.large/l-7b76beeef3d34d4d9ebb61ed018d7c74.png",
      },
      {
        name: "Desinfetante",
        price: 3.5,
        stock: 100,
        imageUrl:
          "https://www.jornalonoticiario.com.br/images/noticias/85/aaff5cd5b99694471d2c21af329018d5.jpg",
      },
      {
        name: "Sabão em Pó",
        price: 2.5,
        stock: 100,
        imageUrl:
          "https://www.proteste.org.br/-/media/proteste/images/home/eletrodomesticos/lavaroupa/melhor-sabao-po.jpg?rev=bd40bd8a-d4ea-4bb2-bfa5-af7be365880b&hash=6C4611C945B352DA9A8185965D279A34",
      },
      {
        name: "Creme Dental",
        price: 1.0,
        stock: 100,
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7O6VsRzJF8Rbd6kySFhKYEh7RS-hMk28F2Q&s",
      },
      {
        name: "Miojo",
        price: 1.0,
        stock: 100,
        imageUrl:
          "https://super.abril.com.br/wp-content/uploads/2018/07/578d0c740e21634575204f23mama_instant_noodle_block1.jpeg?quality=70&strip=info&w=600&h=440&crop=1",
      },
      {
        name: "Suco",
        price: 1.0,
        stock: 100,
        imageUrl:
          "https://www.abc.med.br/fmfiles/index.asp/::places::/abcmed/Os-perigos-dos-sucos-em-caixinhas.jpg",
      },
      {
        name: "Farinha de milho",
        price: 5.0,
        stock: 100,
        imageUrl:
          "https://varietadigrani.com.br/wp-content/uploads/2022/06/farinha-de-milho-flocada.jpg",
      },
    ]);
    console.log("Banco de dados populado com os produtos iniciais.");
  } catch (error) {
    console.error("Erro ao popular o banco de dados:", error);
  }
});

export type { Product };
export { db };
