import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';

@Entity({ name: 'agents' })
class Agent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  model!: string;

  @Column({ nullable: true })
  instructions!: string;

  @Column({ type: 'enum', enum: ['PERSONAL', 'BUSINESS'], default: 'PERSONAL' })
  temperature!: string;

  @Column({ nullable: true })
  picture!: string;

  @Column({ nullable: true })
  subscription_id!: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: any;

  @ManyToOne(() => User, (token) => token.agents)
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date; // Modificação feita aqui para permitir valores nulos
}

export default Agent;
