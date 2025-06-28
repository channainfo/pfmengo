import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../database/entities/user.entity";
import { Profile } from "../../database/entities/profile.entity";
import { RegisterDto } from "../../auth/dto/register.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async create(userData: RegisterDto & { password: string }): Promise<User> {
    // Create user
    const user = this.usersRepository.create({
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      tier: userData.tier,
    });

    const savedUser = await this.usersRepository.save(user);

    // Create profile
    const profile = this.profilesRepository.create({
      userId: savedUser.id,
      tier: userData.tier,
      firstName: userData.firstName,
      lastName: userData.lastName,
      birthDate: new Date(userData.birthDate),
    });

    await this.profilesRepository.save(profile);

    // Return user with profile
    return this.findById(savedUser.id);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .where("user.id = :id", { id })
      .getOne();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.profile", "profile")
      .where("user.email = :email", { email })
      .getOne();
  }

  async updateTier(userId: string, newTier: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.tier = newTier as any;
    user.tierSwitchedAt = new Date();

    await this.usersRepository.save(user);

    // Update profile tier
    await this.profilesRepository.update({ userId }, { tier: newTier as any });

    return this.findById(userId);
  }

  async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
      relations: ["user"],
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    return profile;
  }
}
