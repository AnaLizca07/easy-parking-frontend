// RUTA: src/api/dataManager.js
// Utilidad para manejo global de datos en desarrollo

import { mockReservasService } from './mockReservasService';
import { mockParqueaderosService } from './mockParqueaderoService';
import { mockParqueaderosAdminService } from './mockParqueaderosAdminService';
import { mockUsuariosService } from './mockUsuariosService';
import { mockTarifasService } from './mockTarifasService';
import { mockAuthService } from './mockAuthService';

export const dataManager = {
  // Limpiar todos los datos almacenados
  limpiarTodosLosDatos() {
    console.log('🧹 Iniciando limpieza completa de datos...');

    mockReservasService.limpiarDatos();
    mockParqueaderosService.limpiarDatos();
    mockParqueaderosAdminService.limpiarDatos();
    mockUsuariosService.limpiarDatos();
    mockTarifasService.limpiarDatos();
    mockAuthService.limpiarDatos();

    console.log('✅ Limpieza completa finalizada');
    console.log('🔄 Recarga la página para ver los datos iniciales');
  },

  // Obtener estadísticas de uso de localStorage
  obtenerEstadisticasAlmacenamiento() {
    const stats = {
      reservas: this.contarElementos('easyParking_reservas'),
      parqueaderos: this.contarElementos('easyParking_parqueaderos'),
      parqueaderosAdmin: this.contarElementos('easyParking_parqueaderosAdmin'),
      usuariosRegistrados: this.contarElementos('easyParking_usuarios'),
      tarifas: this.contarElementos('easyParking_tarifas'),
      total: 0
    };

    stats.total = stats.reservas + stats.parqueaderos + stats.parqueaderosAdmin + stats.usuariosRegistrados + stats.tarifas;

    console.table(stats);
    return stats;
  },

  // Exportar todos los datos
  exportarDatos() {
    const datos = {
      timestamp: new Date().toISOString(),
      reservas: this.obtenerDatos('easyParking_reservas'),
      parqueaderos: this.obtenerDatos('easyParking_parqueaderos'),
      parqueaderosAdmin: this.obtenerDatos('easyParking_parqueaderosAdmin'),
      usuariosRegistrados: this.obtenerDatos('easyParking_usuarios'),
      tarifas: this.obtenerDatos('easyParking_tarifas'),
      nextIds: {
        reservas: localStorage.getItem('easyParking_reservas_nextId'),
        parqueaderos: localStorage.getItem('easyParking_parqueaderos_nextId'),
        usuariosRegistrados: localStorage.getItem('easyParking_usuarios_nextId'),
        tarifas: localStorage.getItem('easyParking_tarifas_nextId')
      }
    };

    console.log('📦 Datos exportados:', datos);

    // Copiar al clipboard si está disponible
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(datos, null, 2))
        .then(() => console.log('📋 Datos copiados al clipboard'))
        .catch(err => console.error('Error al copiar:', err));
    }

    return datos;
  },

  // Importar datos
  importarDatos(datos) {
    try {
      console.log('📥 Importando datos...');

      if (datos.reservas) {
        localStorage.setItem('easyParking_reservas', JSON.stringify(datos.reservas));
      }
      if (datos.parqueaderos) {
        localStorage.setItem('easyParking_parqueaderos', JSON.stringify(datos.parqueaderos));
      }
      if (datos.parqueaderosAdmin) {
        localStorage.setItem('easyParking_parqueaderosAdmin', JSON.stringify(datos.parqueaderosAdmin));
      }
      if (datos.usuarios) {
        localStorage.setItem('easyParking_usuarios', JSON.stringify(datos.usuarios));
      }
      if (datos.tarifas) {
        localStorage.setItem('easyParking_tarifas', JSON.stringify(datos.tarifas));
      }

      // Importar nextIds si están disponibles
      if (datos.nextIds) {
        Object.entries(datos.nextIds).forEach(([key, value]) => {
          if (value) {
            localStorage.setItem(`easyParking_${key}_nextId`, value);
          }
        });
      }

      console.log('✅ Datos importados exitosamente');
      console.log('🔄 Recarga la página para ver los datos importados');
    } catch (error) {
      console.error('❌ Error al importar datos:', error);
    }
  },

  // Funciones auxiliares
  contarElementos(clave) {
    try {
      const datos = localStorage.getItem(clave);
      return datos ? JSON.parse(datos).length : 0;
    } catch {
      return 0;
    }
  },

  obtenerDatos(clave) {
    try {
      const datos = localStorage.getItem(clave);
      return datos ? JSON.parse(datos) : null;
    } catch {
      return null;
    }
  }
};

// Hacer disponible globalmente en desarrollo
if (typeof window !== 'undefined') {
  window.dataManager = dataManager;
  console.log('🛠️ DataManager disponible globalmente como window.dataManager');
  console.log('💡 Usa window.dataManager.limpiarTodosLosDatos() para limpiar datos');
  console.log('💡 Usa window.dataManager.obtenerEstadisticasAlmacenamiento() para ver estadísticas');
  console.log('💡 Usa window.dataManager.exportarDatos() para exportar todos los datos');
}