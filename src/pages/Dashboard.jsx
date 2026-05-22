import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="flex gap-4">

        <button
            onClick={() => navigate("/almacen")}
            className="bg-blue-600 text-white px-6 py-4 rounded-xl"
        >
          Ir al Almacén
       </button>

      </div>
    </div>
  );
}