import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
import { TierType } from "../../types/tier.enum";
import { Profile } from "./profile.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: TierType,
  })
  tier: TierType;

  @Column({ type: "timestamp", nullable: true })
  tierSwitchedAt: Date;

  @Column({ default: "active" })
  status: "active" | "suspended" | "deleted";

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
