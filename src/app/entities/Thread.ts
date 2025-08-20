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
import Message from './Message';
import Contact from './Contact';
import Agent from './Agent';

@Entity({ name: 'threads' })
class Thread extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Contact, (token) => token.threads)
  @JoinColumn([{ name: 'contact', referencedColumnName: 'id' }])
  contact!: Contact;

  @ManyToOne(() => Agent, (token) => token.threads)
  @JoinColumn([{ name: 'agent', referencedColumnName: 'id' }])
  agent!: Agent;

  @OneToMany(() => Message, (message) => message.thread)
  messages!: Message[];

  @Column({ type: 'enum', enum: ['OPEN', 'CLOSED'], default: 'OPEN' })
  status!: string;

  @Column()
  thread_id!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Thread;
