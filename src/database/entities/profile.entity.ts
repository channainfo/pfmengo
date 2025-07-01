import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { TierType } from "../../types/tier.enum";
import { User } from "./user.entity";

@Entity("profiles")
export class Profile {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("uuid")
  userId: string;

  @Column({
    type: "enum",
    enum: TierType,
  })
  tier: TierType;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ type: "date" })
  birthDate: Date;

  @Column({ nullable: true })
  gender: "male" | "female" | "non_binary" | "other";

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: "decimal", precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "int", nullable: true })
  age: number;

  @Column({ type: "simple-array", nullable: true })
  interests: string[];

  @Column({ type: "simple-array", nullable: true })
  photos: string[];

  @Column({ type: "jsonb", nullable: true })
  sparkProfile: any;

  @Column({ type: "jsonb", nullable: true })
  connectProfile: any;

  @Column({ type: "jsonb", nullable: true })
  foreverProfile: any;

  @Column({ type: "int", default: 0 })
  wizardStep: number;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({ name: "userId" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
