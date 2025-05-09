import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { parse } from 'csv-parse/sync';

@UseGuards(JwtAuthGuard)
@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  async getAll(): Promise<Lead[]> {
    return this.leadService.findAll();
  }

  @Post()
  async create(@Body() dto: CreateLeadDto): Promise<Lead> {
    return this.leadService.createLead(dto);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File): Promise<Lead[]> {
    const csvText = file.buffer.toString();
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const createdLeads: Lead[] = [];

    for (const row of records) {
      const lead = await this.leadService.createLead(row);
      createdLeads.push(lead);
    }

    return createdLeads;
  }
}