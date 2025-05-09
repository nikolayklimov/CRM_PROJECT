import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  findAll(): Promise<Lead[]> {
    return this.leadRepository.find();
  }

  async createLead(dto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create(dto);
    return this.leadRepository.save(lead);
  }
}