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
import Access from './Access';



@Entity({ name: 'users' })
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  name!: string;

  @Column()
  cpf!: string;

  @Column()
  email!: string;

  @Column({ nullable: true })
  regional_council_number!: string;

  @Column({ nullable: true })
  picture!: string;

  @Column({ nullable: true, default: false })
  has_reset_pass!: boolean;

  @Column()
  password_hash!: string;

  @Column({ nullable: true })
  token_reset_password!: string;

  @Column({ nullable: true, type: 'timestamp' })
  reset_password_expires!: Date;

  @OneToMany(() => Access, (access) => access.user)
  accesses!: Access[]

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default User;
