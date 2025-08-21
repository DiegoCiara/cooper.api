import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import Thread from './Thread';
import Contact from './Contact';

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

  @Column({ nullable: true })
  picture!: string;

  @Column({ nullable: true })
  subscription_id!: string;

  @Column({ nullable: true })
  session_id!: string;

  @Column({ nullable: true })
  session_token!: string;

  @Column()
  openai_assistant_id!: string;

  @Column({ default: 20 })
  waiting_time!: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: any;

  @ManyToOne(() => User, (token) => token.agents)
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @OneToMany(() => Thread, (thread) => thread.agent)
  threads!: Thread[];

  @OneToMany(() => Contact, (thread) => thread.agent)
  contacts!: Contact[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date; // Modificação feita aqui para permitir valores nulos
}

export default Agent;
