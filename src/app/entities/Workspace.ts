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
import Thread from './Thread';
import Contact from './Contact';
import Access from './Access';


interface Agent {
  id: string;
  name: string;
  model: string;
  instructions?: string;
}
interface Session {
  session_id: string;
  session_token: string;
}
interface Configurations {
  waiting_time: 20;
}

@Entity({ name: 'workspaces' })
class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column({ nullable: true })
  subscription_id!: string;

  @Column({ type: 'jsonb' })
  agent!: Agent;

  @Column({ type: 'jsonb', nullable: true })
  session!: Session;

  @Column({ type: 'jsonb', nullable: true })
  configurations!: Configurations;

  @OneToMany(() => Thread, (thread) => thread.workspace)
  threads!: Thread[];

  @OneToMany(() => Contact, (thread) => thread.workspace)
  contacts!: Contact[];

  @OneToMany(() => Access, (thread) => thread.workspace)
  accesses!: Access[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date; // Modificação feita aqui para permitir valores nulos
}

export default Workspace;
