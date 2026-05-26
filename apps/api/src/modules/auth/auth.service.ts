import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import { UserRole } from '@talenthub/shared';
import { getDevStore, isDevDataMode } from '../../dev/dev-store';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleDevLoginDto, GoogleLoginDto, LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    if (isDevDataMode()) {
      return this.registerDev(dto);
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: dto.role,
        candidate: dto.role === UserRole.Candidate ? { create: {} } : undefined,
      },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });

    return { user: this.toAuthUser(user), tokens: await this.signTokens(user) };
  }

  async login(dto: LoginDto) {
    if (isDevDataMode()) {
      return this.loginDev(dto);
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: this.toAuthUser(user),
      tokens: await this.signTokens(user),
    };
  }

  async googleLoginDevDirect(dto: GoogleDevLoginDto) {
    if (process.env.NODE_ENV === 'production' || !isDevDataMode()) {
      throw new UnauthorizedException('Google dev login is disabled');
    }

    const googleId = `dev-${dto.email.toLowerCase()}`;
    return this.googleLoginDev(
      {
        sub: googleId,
        email: dto.email,
        name: dto.name,
        picture: dto.avatarUrl,
      },
      { idToken: '', role: dto.role ?? UserRole.Candidate },
    );
  }

  async googleLogin(dto: GoogleLoginDto) {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    if (!clientId) {
      if (isDevDataMode() && process.env.GOOGLE_DEV_MOCK === 'true') {
        throw new UnauthorizedException(
          'Укажите GOOGLE_CLIENT_ID или используйте вход через Google (режим разработки)',
        );
      }
      throw new UnauthorizedException('Google OAuth is not configured');
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: dto.idToken,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    if (isDevDataMode()) {
      return this.googleLoginDev(payload, dto);
    }

    const googleId = payload.sub!;
    const email = payload.email;
    const name = payload.name ?? email.split('@')[0];
    const avatarUrl = payload.picture;

    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId }, { email }] },
    });

    if (user) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          googleId,
          name: user.name || name,
          avatarUrl: avatarUrl ?? user.avatarUrl,
        },
      });
    } else {
      user = await this.prisma.user.create({
        data: {
          email,
          googleId,
          name,
          avatarUrl,
          role: dto.role ?? UserRole.Candidate,
          candidate:
            (dto.role ?? UserRole.Candidate) === UserRole.Candidate ? { create: {} } : undefined,
        },
      });
    }

    return {
      user: this.toAuthUser(user),
      tokens: await this.signTokens(user),
    };
  }

  async getMe(userId: string) {
    if (isDevDataMode()) {
      return this.getMeDev(userId);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        candidate: {
          select: {
            id: true,
            headline: true,
            location: true,
            _count: { select: { resumes: true } },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      candidate: user.candidate
        ? {
            id: user.candidate.id,
            headline: user.candidate.headline,
            location: user.candidate.location,
            resumeCount: user.candidate._count.resumes,
          }
        : null,
    };
  }

  private async registerDev(dto: RegisterDto) {
    const store = getDevStore();
    if (store.findUserByEmail(dto.email)) {
      throw new ConflictException('Email is already registered');
    }
    const passwordHash = await argon2.hash(dto.password);
    const user = store.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: dto.role,
    });
    return { user: this.toAuthUser(user), tokens: await this.signTokens(user) };
  }

  private async loginDev(dto: LoginDto) {
    const store = getDevStore();
    const user = store.findUserByEmail(dto.email);
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { user: this.toAuthUser(user), tokens: await this.signTokens(user) };
  }

  private async googleLoginDev(
    payload: { sub?: string; email?: string; name?: string; picture?: string },
    dto: GoogleLoginDto,
  ) {
    const store = getDevStore();
    const googleId = payload.sub!;
    const email = payload.email!;
    const name = payload.name ?? email.split('@')[0];
    const avatarUrl = payload.picture;

    let user = store.findUserByGoogleOrEmail(googleId, email);
    if (user) {
      user = store.updateUser(user.id, {
        googleId,
        name: user.name || name,
        avatarUrl: avatarUrl ?? user.avatarUrl,
      })!;
    } else {
      user = store.createUser({
        email,
        passwordHash: '',
        name,
        role: dto.role ?? UserRole.Candidate,
        googleId,
        avatarUrl: avatarUrl ?? null,
      });
    }

    return { user: this.toAuthUser(user), tokens: await this.signTokens(user) };
  }

  private getMeDev(userId: string) {
    const store = getDevStore();
    const user = store.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    let candidate = null;
    if (user.role === UserRole.Candidate && user.candidateId) {
      const profile = store.getCandidateProfile(userId);
      candidate = {
        id: profile.id,
        headline: profile.headline,
        location: profile.location,
        resumeCount: store.countResumes(profile.id),
      };
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      candidate,
    };
  }

  private toAuthUser(user: { id: string; email: string; name: string; role: string; avatarUrl?: string | null }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl ?? null,
    };
  }

  private async signTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessTtl = (this.config.get<string>('JWT_ACCESS_TTL') ?? '15m') as JwtSignOptions['expiresIn'];
    const refreshTtl = (this.config.get<string>('JWT_REFRESH_TTL') ?? '30d') as JwtSignOptions['expiresIn'];

    return {
      accessToken: await this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_ACCESS_SECRET') ?? 'dev-access',
        expiresIn: accessTtl,
      }),
      refreshToken: await this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh',
        expiresIn: refreshTtl,
      }),
    };
  }
}
