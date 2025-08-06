import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Access from './Access';
@Entity({ name: 'workspaces' })
class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  cnpj!: string;

  @Column({ type: 'enum', enum: ['PERSONAL', 'BUSINESS'], default: 'PERSONAL' })
  type!: string;

  @Column({ nullable: true })
  picture!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: any;

  @OneToMany(() => Access, (access) => access.workspace)
  accesses!: Access[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date; // Modificação feita aqui para permitir valores nulos
}

export default Workspace;
