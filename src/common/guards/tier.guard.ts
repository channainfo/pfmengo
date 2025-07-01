import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TIER_KEY } from "../decorators/tier.decorator";
import { TierType } from "../../types/tier.enum";

@Injectable()
export class TierGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredTiers = this.reflector.getAllAndOverride<TierType[]>(
      TIER_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredTiers) {
      return true; // No tier restriction
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("User not authenticated");
    }

    if (!requiredTiers.includes(user.tier)) {
      throw new ForbiddenException(
        `This feature is not available for ${user.tier} tier users`,
      );
    }

    return true;
  }
}
