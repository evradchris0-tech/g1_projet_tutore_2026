import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Batiment, TypeBatiment } from './batiment.entity';
import { CreateBatimentDto } from './dtos/create-batiment.dto';
import { UpdateBatimentDto } from './dtos/update-batiment.dto';


@Injectable()
export class BatimentService {
  constructor(
    @InjectRepository(Batiment)
    private repo: Repository<Batiment>
  ) {}

  async create(dto: CreateBatimentDto) {
    const b = this.repo.create({
      nom: dto.nom,
      code: dto.code,
      typeBatiment: dto.typeBatiment as TypeBatiment,
      adresse: dto.adresse,
      nombreEtage: dto.nombreEtage ?? 0,
      superficie: dto.superficie,
      dateConstruction: dto.dateConstruction ? new Date(dto.dateConstruction) : undefined,
      description: dto.description,
      planBatiment: dto.planBatiment,
      coordonnees: {
        latitude: dto.coordLatitude,
        longitude: dto.coordLongitude,
        altitude: dto.coordAltitude,
      },
    } as Partial<Batiment>);
    return this.repo.save(b);
  }

  async findOne(id: string) {
    const b = await this.repo.findOne({ where: { id } });
    if (!b) throw new NotFoundException('Bâtiment introuvable');
    return b;
  }

  async update(id: string, dto: UpdateBatimentDto) {
    await this.repo.update(id, dto as any);
    return this.findOne(id);
  }

  async remove(id: string) {
    const b = await this.findOne(id);
    await this.repo.remove(b);
    return { deleted: true };
  }

  /**
   * Search + filters with pagination.
   * query can contain: q (text search), type, code, minEtage, maxEtage, minSuperficie, maxSuperficie, fromDate, toDate, page, limit, sort
   */
  async search(query: any) {
    const qb = this.repo.createQueryBuilder('b');

    // full text-ish search on name, code, adresse (use ILIKE for Postgres)
    if (query.q) {
      qb.andWhere(
        `(b.nom ILIKE :q OR b.code ILIKE :q OR b.adresse ILIKE :q)`,
        { q: `%${query.q}%` },
      );
    }

    if (query.code) qb.andWhere('b.code = :code', { code: query.code });
    if (query.type) qb.andWhere('b.typeBatiment = :type', { type: query.type });

    if (query.minEtage) qb.andWhere('b.nombreEtage >= :minEtage', { minEtage: Number(query.minEtage) });
    if (query.maxEtage) qb.andWhere('b.nombreEtage <= :maxEtage', { maxEtage: Number(query.maxEtage) });

    if (query.minSuperficie) qb.andWhere('b.superficie >= :minS', { minS: Number(query.minSuperficie) });
    if (query.maxSuperficie) qb.andWhere('b.superficie <= :maxS', { maxS: Number(query.maxSuperficie) });

    if (query.fromDate) qb.andWhere('b.dateConstruction >= :from', { from: new Date(query.fromDate) });
    if (query.toDate) qb.andWhere('b.dateConstruction <= :to', { to: new Date(query.toDate) });

    // Sorting
    const sort = query.sort || 'b.dateCreation';
    const order = (query.order || 'DESC').toUpperCase() as 'ASC' | 'DESC';
    qb.orderBy(sort, order);

    // pagination
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Number(query.limit) || 20);
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }
}
