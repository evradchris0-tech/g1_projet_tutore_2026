import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importUsers(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    const parts = file.originalname.split('.');
    const ext = parts[parts.length - 1].toLowerCase();

    let rows: any[] = [];

    if (ext === 'csv') {
      rows = Papa.parse(file.buffer.toString(), {
        header: true,
        skipEmptyLines: true,
      }).data;
    } else if (['xls', 'xlsx'].includes(ext)) {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet);
    } else {
      throw new BadRequestException('Unsupported file format');
    }

    return this.authService.importBulkUsers(rows);
  }
}
