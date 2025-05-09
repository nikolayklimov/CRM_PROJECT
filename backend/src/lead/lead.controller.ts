import { Controller, Get, Post, Body } from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';

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
}