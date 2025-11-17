import React, { useState, useEffect } from "react";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  // Buscar produtos
  const loadProducts = async () => {
    const response = await fetch("http://localhost:3001/produtos");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Criar ou atualizar produto
  const saveProduct = async () => {
    const produto = { nome: name, preco: price, quantidade: quantity, categoria: category, descricao: description };

    if (editId) {
      // UPDATE
      await fetch(`http://localhost:3001/produtos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      });
      setEditId(null);
    } else {
      // CREATE
      await fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      });
    }

    // Limpar campos
    setName("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setDescription("");

    loadProducts();
  };

  // Deletar produto
  const deleteProduct = async (id) => {
    await fetch(`http://localhost:3001/produtos/${id}`, {
      method: "DELETE",
    });
    loadProducts();
  };

  // Editar produto
  const editProduct = (produto) => {
    setEditId(produto.id);
    setName(produto.nome);
    setPrice(produto.preco);
    setQuantity(produto.quantidade);
    setCategory(produto.categoria);
    setDescription(produto.descricao);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gerenciar Produtos</h2>

      <div style={{ marginBottom: 20 }}>
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Preço" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input placeholder="Quantidade" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />

        <button onClick={saveProduct} style={{ marginLeft: 10 }}>
          {editId ? "Atualizar Produto" : "Cadastrar Produto"}
        </button>
      </div>

      <h3>Produtos cadastrados</h3>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.nome} — R${p.preco} — {p.quantidade} un — {p.categoria} — {p.descricao}
            <button onClick={() => editProduct(p)} style={{ marginLeft: 10 }}>
              Editar
            </button>
            <button onClick={() => deleteProduct(p.id)} style={{ marginLeft: 5 }}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductPage;
