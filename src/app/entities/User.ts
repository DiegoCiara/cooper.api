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
import Agent from './Agent';

@Entity({ name: 'users' })
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  customer_id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  picture!: string;

  @Column({ default: false })
  has_reset_pass!: boolean;

  @Column()
  password_hash!: string;

  @Column({ default: false })
  has_validate_email!: boolean;
  
  @Column({ nullable: true })
  token_reset_password!: string;

  @Column({ nullable: true, type: 'timestamp' })
  reset_password_expires!: Date;

  @OneToMany(() => Agent, (access) => access.user)
  agents!: Agent[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default User;
