import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { TierType } from '../../types/tier.enum';
import { User } from './user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({
    type: 'enum',
    enum: TierType,
  })
  tier: TierType;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ nullable: true })
  gender: 'male' | 'female' | 'non_binary' | 'other';

  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  location: object;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}