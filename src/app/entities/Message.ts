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
import User from './User';
import Agent from './Workspace';

@Entity({ name: 'messages' })
class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Thread, (token) => token.messages)
  @JoinColumn([{ name: 'thread', referencedColumnName: 'id' }])
  thread!: Thread;

  @Column({ type: 'enum', enum: ['AGENT', 'CONTACT'] })
  from!: string;

  @Column({ default: false })
  viewed!: boolean;

  @Column()
  content!: string;

  @Column({ type: 'enum', enum: ['image', 'text', 'audio'], default: 'text' })
  type!: string;

  @Column({ nullable: true })
  media!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Message;
