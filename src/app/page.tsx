"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, Product } from "../lib/db";
import { useState } from "react";
import Image from "next/image";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ShoppingCartIcon,
  CogIcon,
  MinusIcon,
  TrashIcon as TrashOutlineIcon,
} from "@heroicons/react/24/outline";

interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function ProductManager() {
  // Estados do formulário
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [max, setMax] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Estados do modo e carrinho
  const [isManagementMode, setIsManagementMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const products = useLiveQuery(() => db.products.orderBy("name").toArray());

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setImageUrl("");
    setMax("");
    setEditingId(null);
    setShowForm(false);
  };

  const addProduct = async () => {
    if (!name.trim() || !price || parseFloat(price) <= 0) return;

    try {
      await db.products.add({
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        imageUrl: imageUrl.trim(),
        max: max ? parseInt(max) : undefined,
      });
      resetForm();
    } catch (error) {
      console.error("Falha ao adicionar produto:", error);
    }
  };

  const updateProduct = async () => {
    if (!name.trim() || !price || parseFloat(price) <= 0 || !editingId) return;

    try {
      await db.products.update(editingId, {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        imageUrl: imageUrl.trim(),
        max: max ? parseInt(max) : undefined,
      });
      resetForm();
    } catch (error) {
      console.error("Falha ao atualizar produto:", error);
    }
  };

  const deleteProduct = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await db.products.delete(id);
      } catch (error) {
        console.error("Falha ao excluir produto:", error);
      }
    }
  };

  const startEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
    setImageUrl(product.imageUrl);
    setMax(product.max ? product.max.toString() : "");
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct();
    } else {
      addProduct();
    }
  };

  // Funções do carrinho
  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    const maxQuantity = product.max || Infinity;

    if (existingItem) {
      // Verifica se não excede o limite máximo
      if (existingItem.quantity < maxQuantity) {
        setCart(
          cart.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        alert(
          `Limite máximo de ${maxQuantity} unidades atingido para ${product.name}`
        );
      }
    } else {
      // Adiciona novo item ao carrinho
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ]);
    }
  };

  const removeFromCart = (productId: number) => {
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem && existingItem.quantity > 1) {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart(cart.filter((item) => item.productId !== productId));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    if (confirm("Tem certeza que deseja limpar o carrinho?")) {
      setCart([]);
    }
  };

  if (!products) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mercado Offline
              </h1>
              <p className="mt-2 text-gray-600">
                {isManagementMode
                  ? "Gerencie seus produtos"
                  : "Faça suas compras"}
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex space-x-3">
              {/* Toggle de modo */}

              <button
                onClick={() => setIsManagementMode(!isManagementMode)}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  !isManagementMode
                    ? "border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500"
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Comprar
              </button>

              <button
                onClick={() => setIsManagementMode(!isManagementMode)}
                className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  isManagementMode
                    ? "border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 focus:ring-blue-500"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500"
                }`}
              >
                <CogIcon className="h-5 w-5 mr-2" />
                Gerenciar
              </button>

              {/* Botão de adicionar produto (apenas no modo gerenciamento) */}
              {isManagementMode && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Adicionar Produto
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Resumo do carrinho sticky (apenas no modo compras) */}
      {!isManagementMode && cart.length > 0 && (
        <div className="sticky top-20 left-0 right-0 bg-green-50 border-b border-green-200 shadow-md z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingCartIcon className="h-6 w-6 text-green-600 mr-2" />
                <span className="text-green-800 font-medium">
                  Carrinho: {getCartItemCount()} item(s)
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-green-600">
                  Total: R$ {getCartTotal().toFixed(2)}
                </div>
                <button
                  onClick={clearCart}
                  className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  title="Limpar carrinho"
                >
                  <TrashOutlineIcon className="h-4 w-4 mr-1" />
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulário (apenas no modo gerenciamento) */}
        {isManagementMode && showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingId ? "Editar Produto" : "Adicionar Produto"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ex: Arroz 5kg"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Estoque
                    </label>
                    <input
                      type="number"
                      id="stock"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="max"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Limite Máximo no Carrinho
                  </label>
                  <input
                    type="number"
                    id="max"
                    min="1"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Deixe vazio para sem limite"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Quantidade máxima que pode ser adicionada ao carrinho
                    (opcional)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="imageUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-1 text-black p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {editingId ? "Atualizar" : "Adicionar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de Produtos */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {isManagementMode
              ? `Produtos (${products.length})`
              : `Produtos Disponíveis (${products.length})`}
          </h2>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Nenhum produto
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {isManagementMode
                  ? "Comece adicionando um produto."
                  : "Nenhum produto disponível para compra."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const cartItem = cart.find(
                  (item) => item.productId === product.id
                );
                const quantityInCart = cartItem ? cartItem.quantity : 0;
                const maxQuantity = product.max || Infinity;
                const isAtMaxLimit = quantityInCart >= maxQuantity;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={400}
                          height={192}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <svg
                            className="h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        R$ {product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Estoque: {product.stock} unidades
                        {product.max && (
                          <span className="ml-2 text-blue-600 font-medium">
                            (Máx: {product.max})
                          </span>
                        )}
                      </p>

                      {/* Botões baseados no modo */}
                      {isManagementMode ? (
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => startEdit(product)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Excluir
                          </button>
                        </div>
                      ) : (
                        <div className="mt-4">
                          {quantityInCart > 0 ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => removeFromCart(product.id)}
                                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                                  {quantityInCart}
                                  {product.max && (
                                    <span className="text-xs text-gray-400 block">
                                      /{product.max}
                                    </span>
                                  )}
                                </span>
                                <button
                                  onClick={() => addToCart(product)}
                                  disabled={isAtMaxLimit}
                                  className={`p-1 rounded-full focus:outline-none focus:ring-2 ${
                                    isAtMaxLimit
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-green-100 text-green-600 hover:bg-green-200 focus:ring-green-500"
                                  }`}
                                  title={
                                    isAtMaxLimit
                                      ? `Limite máximo de ${maxQuantity} unidades atingido`
                                      : "Adicionar ao carrinho"
                                  }
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>
                              <span className="text-sm font-medium text-gray-500">
                                R$ {(product.price * quantityInCart).toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <ShoppingCartIcon className="h-4 w-4 mr-2" />
                              Adicionar ao Carrinho
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
