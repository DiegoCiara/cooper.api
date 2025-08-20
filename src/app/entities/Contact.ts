import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Thread from './Thread';
import Agent from './Agent';

@Entity({ name: 'contacts' })
class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column()
  phone!: string;

  @OneToMany(() => Thread, (thread) => thread.contact)
  threads!: Thread[];

  @ManyToOne(() => Agent, (token) => token.threads, { nullable: true })
  @JoinColumn([{ name: 'session', referencedColumnName: 'id' }])
  agent!: Agent;

  @Column({ nullable: true })
  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Contact;
