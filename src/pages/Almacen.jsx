import { useState } from "react";
import { useAlmacen } from "../hooks/useAlmacen";
import { Search } from "lucide-react";
import "../styles/almacen.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import Header from "../components/Header.jsx";

export default function App() {
  const navigate = useNavigate();

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
  
  console.log(
  "FILAS:",
  gondola?.filas,
  "COLUMNAS:",
  gondola?.columnas);

  return (
    	<div className="app-container">

      	{/* SIDEBAR */}
      	<aside className="sidebar">
        	<h1 className="sidebar-title">Almacén</h1>
          <div className="space-y-2 mb-4">

                <input
                  value={nombreGondola}
                  onChange={(e) => setNombreGondola(e.target.value)}
                  placeholder="Nombre góndola"
                  className="sidebar-input"
                />

                <select
                  value={tipoGondola}
                  onChange={(e) => setTipoGondola(e.target.value)}
                  className="sidebar-input"
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
                      className="sidebar-input"
                    />

                    <input
                      type="number"
                      value={columnas}
                      onChange={(e) => setColumnas(Number(e.target.value))}
                      placeholder="Columnas"
                      className="sidebar-input"
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
                  className="sidebar-button"
                >
                  Crear Góndola
                </button>
              </div>

              {gondolas.map((g) => (
                   <div
                      key={g.id}
                      className={`gondola-item ${selected === g.id ? "active" : ""}`}
                    >
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
    <main className="main-content">
               <Header />
       
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
            <div className="gondola-header">

              <h2 className="gondola-title">
                📦 {gondola.nombre}
              </h2>

              <p className="gondola-subtitle">
                {gondola.tipo === "matriz"
                  ? `Matriz ${gondola.filas}x${gondola.columnas}`
                  : "Góndola simple"}
              </p>

            </div>

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
                className={
                  gondola.tipo === "matriz"
                    ? "almacen-grid-matriz"
                    : "almacen-grid-simple"
                }
                style={
                  gondola.tipo === "matriz"
                    ? {
                        gridTemplateColumns: `repeat(${gondola.columnas}, 180px)`,
                      }
                    : {}
                }
              >
       {gondola.divisiones?.map((d) => (
        <div
            key={d.id}
            className="division-card"
        >
              <div className="division-header">
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

              <div className="division-products">
      		        {d.productos?.map((p) => (
                      <div
          			           key={p.id}
                            className="product-item"
        		            >
                        <span className="product-name">
          			           {p.nombre}
        		            </span>
                            <div className="product-actions">
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
                          className="add-product-button" > 
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