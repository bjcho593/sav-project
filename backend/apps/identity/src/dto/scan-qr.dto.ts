export class ScanQrDto {
  userId: string;       // El ID del estudiante que escanea
  qrContent: string;    // El texto encriptado que leyó del QR
  gpsLat: number;       // Latitud del estudiante
  gpsLong: number;      // Longitud del estudiante
}