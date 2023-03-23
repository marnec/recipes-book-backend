import { BaseEntity, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'nutrients' })
export class Nutrient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', name: 'external_id' })
  externalId: number;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', name: 'usda_code' })
  usdaCode: string;

  @Column({ type: 'int', name: 'usda_order' })
  usdaOrder: number;

  @Column({ type: 'int', name: 'fda_daily' })
  fdaDaily: number;

  @Column({ type: 'varchar' })
  unit: string;
}
