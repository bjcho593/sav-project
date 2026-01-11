import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class ScanQrDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string; // El ID del estudiante que escanea

  @IsString()
  @IsNotEmpty()
  qrContent: string; // El chorizo de letras que viene en el QR (Token JWT)
}