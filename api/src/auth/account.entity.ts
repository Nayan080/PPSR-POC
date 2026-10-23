import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  customerNumber: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  passwordHash: string;

  @Column({ type: 'varchar' })
  givenName: string;

  @Column({ type: 'varchar' })
  familyName: string;

  @Column({ type: 'varchar', nullable: true })
  organisationName: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
