import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { generarDivisiones } from "../lib/generarMatriz";

export function useAlmacen() {
  const [gondolas, setGondolas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("gondolas")
      .select(`
        id,
        nombre,
        tipo,
        filas,
        columnas,
        divisiones (
          id,
          nombre,
          productos (
            id,
            nombre
          )
        )
      `);

    setGondolas(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE
        const addGondola = async (
          nombre,
          tipo = "simple",
          filas = 0,
          columnas = 0
        ) => {

  const { data, error } = await supabase
    .from("gondolas")
    .insert([
      {
        nombre,
        tipo,
        filas,
        columnas,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  // SI ES MATRIZ
  if (tipo === "matriz") {

    const divisiones = generarDivisiones(filas, columnas)
      .map((d) => ({
        nombre: d.nombre,
        gondola_id: data.id,
      }));

    const { error: errorDivisiones } = await supabase
      .from("divisiones")
      .insert(divisiones);

    if (errorDivisiones) {
      console.error(errorDivisiones);
    }
  }

  fetchData();
};

  const addDivision = async (gondola_id, nombre) => {
    await supabase.from("divisiones").insert({ nombre, gondola_id });
    fetchData();
  };

  const addProducto = async (division_id, nombre) => {
    await supabase.from("productos").insert({ nombre, division_id });
    fetchData();
  };

  // UPDATE
  const updateGondola = async (id, nombre) => {
    await supabase.from("gondolas").update({ nombre }).eq("id", id);
    fetchData();
  };

  const updateDivision = async (id, nombre) => {
    await supabase.from("divisiones").update({ nombre }).eq("id", id);
    fetchData();
  };

  const updateProducto = async (id, nombre) => {
    await supabase.from("productos").update({ nombre }).eq("id", id);
    fetchData();
  };

  // DELETE
  const deleteGondola = async (id) => {
    await supabase.from("gondolas").delete().eq("id", id);
    fetchData();
  };

  const deleteDivision = async (id) => {
    await supabase.from("divisiones").delete().eq("id", id);
    fetchData();
  };

  const deleteProducto = async (id) => {
    await supabase.from("productos").delete().eq("id", id);
    fetchData();
  };

  // SEARCH
  const buscar = async (texto) => {
    if (!texto) return [];

    const { data } = await supabase
      .from("productos")
      .select(`
        nombre,
        divisiones (
          nombre,
          gondolas (
            nombre
          )
        )
      `)
      .ilike("nombre", `%${texto}%`);

    return data || [];
  };

  return {
    gondolas,
    loading,
    addGondola,
    addDivision,
    addProducto,
    updateGondola,
    updateDivision,
    updateProducto,
    deleteGondola,
    deleteDivision,
    deleteProducto,
    buscar,
  };
}