// RUTA: src/components/reservas/CodigoQR.jsx
// Componente que muestra el código QR de la reserva

import { useState } from 'react';
import { Download, Copy, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

const CodigoQR = ({ codigo, reservaId }) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  // Generar URL del QR usando una API pública
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${codigo}`;

  const handleDescargar = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `reserva-${reservaId}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Código QR de tu Reserva
        </h3>

        {/* Código en texto grande */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-4">
          <p className="text-sm text-gray-600 mb-2">Código de acceso</p>
          <p className="text-4xl font-bold text-blue-600 tracking-widest">
            {codigo}
          </p>
        </div>

        {/* QR Code Image */}
        <div className="bg-gray-50 p-6 rounded-lg mb-4 inline-block">
          <img
            src={qrUrl}
            alt={`QR Code ${codigo}`}
            className="w-64 h-64"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          <Button
            onClick={handleCopiar}
            variant="outline"
            className="flex-1"
          >
            {copiado ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                ¡Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                Copiar código
              </>
            )}
          </Button>

          <Button
            onClick={handleDescargar}
            variant="outline"
            className="flex-1"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar QR
          </Button>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Importante:</strong> Presenta este código al llegar al parqueadero. 
            Puedes mostrarlo desde tu teléfono o imprimirlo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodigoQR;