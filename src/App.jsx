import { useState } from "react";
import { useAlmacen } from "./hooks/useAlmacen";
import { Search } from "lucide-react";

export default function App() {
  const {
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
  } = useAlmacen();

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [nombreGondola, setNombreGondola] = useState("");
  const [tipoGondola, setTipoGondola] = useState("simple");
  const [filas, setFilas] = useState(2);
  const [columnas, setColumnas] = useState(2)
  const [resultados, setResultados] = useState([]);
  const [divisionInputs, setDivisionInputs] = useState({});

 	 const handleSearch = async (value) => {
    		setSearch(value);
    		const res = await buscar(value);
    		setResultados(res);
  	 };

  const gondola = gondolas.find((g) => g.id === selected);
  console.log(gondola);
  console.log(
  "FILAS:",
  gondola?.filas,
  "COLUMNAS:",
  gondola?.columnas
);

  return (
    	<div className="h-screen flex bg-gray-100">

      	{/* SIDEBAR */}
      	<aside className="w-64 bg-gray-900 text-white p-4">
        	<h1 className="text-2xl font-bold mb-4">Almacén</h1>
          <div className="space-y-2 mb-4">

                <input
                  value={nombreGondola}
                  onChange={(e) => setNombreGondola(e.target.value)}
                  placeholder="Nombre góndola"
                  className="w-full p-2 rounded bg-gray-800 text-white"
                />

                <select
                  value={tipoGondola}
                  onChange={(e) => setTipoGondola(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                >
                  <option value="simple">Simple</option>
                  <option value="matriz">Matriz</option>
                </select>

                {tipoGondola === "matriz" && (
                  <>
                    <input
                      type="number"
                      value={filas}
                      onChange={(e) => setFilas(Number(e.target.value))}
                      placeholder="Filas"
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />

                    <input
                      type="number"
                      value={columnas}
                      onChange={(e) => setColumnas(Number(e.target.value))}
                      placeholder="Columnas"
                      className="w-full p-2 rounded bg-gray-800 text-white"
                    />
                  </>
                )}

                <button
                  onClick={() => {
                    if (!nombreGondola) return;

                    addGondola(
                      nombreGondola,
                      tipoGondola,
                      filas,
                      columnas
                    );

                    setNombreGondola("");
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"
                >
                  Crear Góndola
                </button>
              </div>

              {gondolas.map((g) => (
                   <div key={g.id} className="flex justify-between p-2 hover:bg-gray-800 rounded">
                   <span onClick={() => setSelected(g.id)} className="cursor-pointer">
                     {g.nombre}
                   </span>

                 <div className="flex gap-2 text-xs">
                   <button onClick={() => {
                     const nombre = prompt("Editar", g.nombre);
                     if (nombre) updateGondola(g.id, nombre);
                   }}>✏️</button>

                   <button onClick={() => {
                    if (confirm("Eliminar?")) deleteGondola(g.id);
                   }}>🗑️</button>
                  </div>
                 </div>
               ))}
        </aside>

      {/* MAIN */}
     <main className="flex-1 p-6 overflow-y-auto ">
        <div className="mb-4 flex bg-white p-2 rounded shadow w-1/3">
          <Search />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar..."
            className="ml-2 w-full outline-none"
          />
        </div>

        {search && resultados.map((r, i) => (
          <div key={i}>
            {r.nombre} → {r.divisiones?.gondolas?.nombre} → {r.divisiones?.nombre}
          </div>
        ))}

        {gondola && (
          <>
            <h2 className="text-xl font-bold mb-2">{gondola.nombre}</h2>
              {gondola.tipo === "simple" && (
                  <div className="flex gap-2 mb-4">

                    <input
                      value={divisionInputs[gondola.id] || ""}
                      onChange={(e) =>
                        setDivisionInputs({
                          ...divisionInputs,
                          [gondola.id]: e.target.value,
                        })
                      }
                      placeholder="Nueva división"
                      className="border p-2 rounded-lg bg-white"
                    />
                    <button
                      onClick={() => {
                        const nombre = divisionInputs[gondola.id];

                        if (!nombre) return;

                        addDivision(gondola.id, nombre);

                        setDivisionInputs({
                          ...divisionInputs,
                          [gondola.id]: "",
                        });
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 rounded-lg"
                    >
                      Agregar División
                    </button>
                  </div>
                )}


         <div
            className="grid gap-4 content-start"
            style={{
              gridTemplateColumns:
                gondola.tipo === "matriz"
                  ? `repeat(${gondola.columnas}, 180px)`
                  : "repeat(auto-fill, 180px)",
              }}
        >
       {gondola.divisiones?.map((d) => (
        <div
            key={d.id}
            className="
              bg-white
              p-3
              rounded-xl
              shadow-sm
              border
              border-gray-200
              flex
              flex-col
              h-[220px]
              min-w-[170px]
              max-w-[190px]
              transition-all
              hover:shadow-md
            "
        >
              <div className="flex justify-between">
                  <b>{d.nombre}</b>
                    <div>
                      <button onClick={() => {
                        const nombre = prompt("Editar", d.nombre);
                        if (nombre) updateDivision(d.id, nombre);
                      }}>✏️</button>
                      

                        {gondola.tipo === "simple" && (
                          <button
                            onClick={() => {
                              if (confirm("Eliminar?")) deleteDivision(d.id);
                            }}
                          >
                            🗑️
                          </button>
                        )}



                    </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
      		        {d.productos?.map((p) => (
                      <div
          			           key={p.id}
          			          
                            className="
                              flex
                              items-center
                              justify-between
                              bg-gray-100
                              px-2
                              py-1
                              rounded
                              min-w-0
                              text-sm
                            "
        		            >
                        <span className="truncate flex-1 mr-2">
          			           {p.nombre}
        		            </span>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => {
                                    const nombre = prompt("Editar", p.nombre);
                                    if (nombre) updateProducto(p.id, nombre);
                                }}>✏️</button>

                                <button onClick={() => {
                                  if (confirm("Eliminar?")) deleteProducto(p.id);
                                }}>🗑️</button>
                            </div>
                      </div>
                  ))}
      		    </div>

                    <button
                        onClick={() => {
                            const nombre = prompt("Nuevo producto");
                            if (nombre) addProducto(d.id, nombre);
                        }}
                          className="text-blue-600 text-sm mt-2" > 
                          + Producto
                    </button>

              </div>
            ))}
          </div>
        </>
      )}

        {loading && <p>Cargando...</p>}
      </main>
    </div>
  );
}