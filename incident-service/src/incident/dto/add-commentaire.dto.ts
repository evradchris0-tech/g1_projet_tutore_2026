import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddCommentaireDto {
    @IsString()
    @IsNotEmpty()
    idAuteur: string;

    @IsString()
    @IsNotEmpty()
    contenu: string;

    @IsOptional()
    @IsString()
    pieceJointe?: string;
}
