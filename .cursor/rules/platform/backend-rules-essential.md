---
description: "Backend development with Node.js/Laravel and Clean Architecture. Apply when working with server-side code, API development, or backend services."
alwaysApply: false
category: "platform"
priority: "high"
---

# Backend Development - Essential Guidelines

## Core Architecture

### Clean Architecture + Domain-Driven Design
- **Presentation Layer**: Controllers + Middleware + Validation
- **Application Layer**: Use Cases + Services + DTOs
- **Domain Layer**: Entities + Value Objects + Domain Services
- **Infrastructure Layer**: Repositories + External Services + Database

### Key Principles
- Single Responsibility Principle
- Dependency Inversion (Interfaces)
- Testable Architecture
- Separation of Concerns

## Essential Tech Stack

### Primary Frameworks
- **Node.js**: Runtime with Express/Fastify
- **Laravel**: PHP framework with Eloquent ORM
- **Python**: FastAPI/Django with SQLAlchemy
- **TypeScript**: Type-safe JavaScript

### Essential Dependencies

#### Node.js Stack
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^6.1.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^6.8.0",
    "express-validator": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "zod": "^3.21.0",
    "winston": "^3.8.0",
    "dotenv": "^16.3.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.4.0",
    "@types/cors": "^2.8.13",
    "@types/bcryptjs": "^2.4.2",
    "@types/jsonwebtoken": "^9.0.2",
    "typescript": "^5.1.0",
    "jest": "^29.6.0",
    "@types/jest": "^29.5.3",
    "supertest": "^6.3.0",
    "@types/supertest": "^2.0.12",
    "ts-node": "^10.9.0",
    "nodemon": "^3.0.0"
  }
}
```

#### Laravel Stack
```php
// composer.json
{
    "require": {
        "laravel/framework": "^10.0",
        "laravel/sanctum": "^3.2",
        "laravel/tinker": "^2.8",
        "spatie/laravel-permission": "^5.10",
        "league/fractal": "^0.20"
    },
    "require-dev": {
        "fakerphp/faker": "^1.9.1",
        "laravel/pint": "^1.0",
        "laravel/sail": "^1.18",
        "mockery/mockery": "^1.4.4",
        "nunomaduro/collision": "^7.0",
        "phpunit/phpunit": "^10.1",
        "spatie/laravel-ignition": "^2.0"
    }
}
```

## Standard Project Structure

### Node.js Structure
```
src/
├── controllers/
├── services/
├── repositories/
├── models/
├── middleware/
├── routes/
├── validators/
├── utils/
├── types/
├── config/
└── app.ts
```

### Laravel Structure
```
app/
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
├── Services/
├── Repositories/
├── Models/
├── Providers/
└── Console/
```

## Development Patterns

### Controller Pattern (Node.js)
```ts
import { Request, Response } from 'express';
import { z } from 'zod';
import { FeatureService } from '../services/FeatureService';
import { validateRequest } from '../middleware/validation';

const createFeatureSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export class FeatureController {
  constructor(private featureService: FeatureService) {}

  async createFeature(req: Request, res: Response) {
    try {
      const validatedData = createFeatureSchema.parse(req.body);
      const feature = await this.featureService.create(validatedData);
      
      res.status(201).json({
        success: true,
        data: feature,
        message: 'Feature created successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getFeatures(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const features = await this.featureService.findAll({
        page: Number(page),
        limit: Number(limit)
      });
      
      res.json({
        success: true,
        data: features,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: features.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
}
```

### Service Pattern (Node.js)
```ts
import { FeatureRepository } from '../repositories/FeatureRepository';
import { Feature } from '../models/Feature';
import { CreateFeatureData, UpdateFeatureData } from '../types/feature';

export class FeatureService {
  constructor(private featureRepository: FeatureRepository) {}

  async create(data: CreateFeatureData): Promise<Feature> {
    // Business logic validation
    if (data.name.length < 3) {
      throw new Error('Feature name must be at least 3 characters');
    }

    // Check for duplicates
    const existingFeature = await this.featureRepository.findByName(data.name);
    if (existingFeature) {
      throw new Error('Feature with this name already exists');
    }

    return await this.featureRepository.create(data);
  }

  async findAll(options: { page: number; limit: number }) {
    return await this.featureRepository.findAll(options);
  }

  async findById(id: string): Promise<Feature | null> {
    return await this.featureRepository.findById(id);
  }

  async update(id: string, data: UpdateFeatureData): Promise<Feature> {
    const feature = await this.featureRepository.findById(id);
    if (!feature) {
      throw new Error('Feature not found');
    }

    return await this.featureRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const feature = await this.featureRepository.findById(id);
    if (!feature) {
      throw new Error('Feature not found');
    }

    await this.featureRepository.delete(id);
  }
}
```

### Repository Pattern (Node.js)
```ts
import { PrismaClient } from '@prisma/client';
import { Feature } from '../models/Feature';
import { CreateFeatureData, UpdateFeatureData } from '../types/feature';

export class FeatureRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateFeatureData): Promise<Feature> {
    const feature = await this.prisma.feature.create({
      data: {
        name: data.name,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return this.mapToDomain(feature);
  }

  async findAll(options: { page: number; limit: number }) {
    const skip = (options.page - 1) * options.limit;
    
    const [features, total] = await Promise.all([
      this.prisma.feature.findMany({
        skip,
        take: options.limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.feature.count()
    ]);

    return {
      data: features.map(this.mapToDomain),
      total,
      page: options.page,
      limit: options.limit
    };
  }

  async findById(id: string): Promise<Feature | null> {
    const feature = await this.prisma.feature.findUnique({
      where: { id }
    });

    return feature ? this.mapToDomain(feature) : null;
  }

  async findByName(name: string): Promise<Feature | null> {
    const feature = await this.prisma.feature.findFirst({
      where: { name }
    });

    return feature ? this.mapToDomain(feature) : null;
  }

  async update(id: string, data: UpdateFeatureData): Promise<Feature> {
    const feature = await this.prisma.feature.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });

    return this.mapToDomain(feature);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.feature.delete({
      where: { id }
    });
  }

  private mapToDomain(prismaFeature: any): Feature {
    return new Feature(
      prismaFeature.id,
      prismaFeature.name,
      prismaFeature.description,
      prismaFeature.createdAt,
      prismaFeature.updatedAt
    );
  }
}
```

### Laravel Controller Pattern
```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateFeatureRequest;
use App\Http\Requests\UpdateFeatureRequest;
use App\Services\FeatureService;
use Illuminate\Http\JsonResponse;

class FeatureController extends Controller
{
    public function __construct(
        private FeatureService $featureService
    ) {}

    public function index(): JsonResponse
    {
        $features = $this->featureService->getAll();
        
        return response()->json([
            'success' => true,
            'data' => $features
        ]);
    }

    public function store(CreateFeatureRequest $request): JsonResponse
    {
        $feature = $this->featureService->create($request->validated());
        
        return response()->json([
            'success' => true,
            'data' => $feature,
            'message' => 'Feature created successfully'
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $feature = $this->featureService->findById($id);
        
        if (!$feature) {
            return response()->json([
                'success' => false,
                'message' => 'Feature not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $feature
        ]);
    }

    public function update(UpdateFeatureRequest $request, string $id): JsonResponse
    {
        $feature = $this->featureService->update($id, $request->validated());
        
        return response()->json([
            'success' => true,
            'data' => $feature,
            'message' => 'Feature updated successfully'
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->featureService->delete($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Feature deleted successfully'
        ]);
    }
}
```

## API Design Standards

### RESTful API Guidelines
```ts
// Standard HTTP methods and status codes
GET    /api/features          // 200 - List features
GET    /api/features/:id      // 200 - Get feature
POST   /api/features          // 201 - Create feature
PUT    /api/features/:id      // 200 - Update feature
DELETE /api/features/:id      // 204 - Delete feature

// Error responses
400 Bad Request              // Validation errors
401 Unauthorized            // Authentication required
403 Forbidden               // Insufficient permissions
404 Not Found               // Resource not found
422 Unprocessable Entity    // Business logic errors
500 Internal Server Error   // Server errors
```

### Response Format
```ts
// Success response
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation completed successfully",
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "name",
        "message": "Name is required"
      }
    ]
  }
}
```

## Authentication & Authorization

### JWT Implementation (Node.js)
```ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET!;
  private readonly JWT_EXPIRES_IN = '7d';

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    };
  }

  async register(email: string, password: string, name: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    };
  }
}
```

## Database Management

### Prisma Schema (Node.js)
```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  features Feature[]
  
  @@map("users")
}

model Feature {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("features")
}
```

### Laravel Migration
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('features');
    }
};
```

## Testing Standards

### Unit Tests (Jest)
```ts
import { FeatureService } from '../FeatureService';
import { FeatureRepository } from '../FeatureRepository';

describe('FeatureService', () => {
  let featureService: FeatureService;
  let mockRepository: jest.Mocked<FeatureRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByName: jest.fn()
    } as any;

    featureService = new FeatureService(mockRepository);
  });

  describe('create', () => {
    it('should create a feature successfully', async () => {
      const featureData = { name: 'Test Feature', description: 'Test Description' };
      const expectedFeature = { id: '1', ...featureData };

      mockRepository.findByName.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(expectedFeature);

      const result = await featureService.create(featureData);

      expect(mockRepository.findByName).toHaveBeenCalledWith('Test Feature');
      expect(mockRepository.create).toHaveBeenCalledWith(featureData);
      expect(result).toEqual(expectedFeature);
    });

    it('should throw error if feature name is too short', async () => {
      const featureData = { name: 'AB', description: 'Test Description' };

      await expect(featureService.create(featureData))
        .rejects
        .toThrow('Feature name must be at least 3 characters');
    });
  });
});
```

### Integration Tests (Supertest)
```ts
import request from 'supertest';
import { app } from '../app';

describe('Feature API', () => {
  describe('POST /api/features', () => {
    it('should create a feature', async () => {
      const featureData = {
        name: 'Test Feature',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/features')
        .send(featureData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(featureData.name);
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/features')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

## Performance Optimization

### Essential Optimizations
- Implement database indexing
- Use connection pooling
- Implement caching (Redis)
- Use pagination for large datasets
- Optimize database queries
- Implement rate limiting
- Use compression middleware

### Caching Strategy
```ts
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
```

## Quality Checklist

### Architecture Compliance
- [ ] Clean Architecture layers separated
- [ ] Dependency injection configured
- [ ] Repository pattern implemented
- [ ] Service layer properly structured

### Code Quality
- [ ] SOLID principles followed
- [ ] Functions are small and focused
- [ ] Proper error handling implemented
- [ ] Code is testable

### Testing Coverage
- [ ] Unit tests for services (>90% coverage)
- [ ] Unit tests for repositories (>80% coverage)
- [ ] Integration tests for API endpoints
- [ ] End-to-end tests for critical flows

### Security
- [ ] Input validation implemented
- [ ] Authentication and authorization configured
- [ ] SQL injection prevention
- [ ] Rate limiting implemented
- [ ] Security headers configured

### Performance
- [ ] Database queries optimized
- [ ] Caching implemented where appropriate
- [ ] Connection pooling configured
- [ ] Monitoring and logging set up

### Documentation
- [ ] API documentation generated
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] README updated with setup instructions

---

**Essential backend development with Node.js/Laravel, Clean Architecture, and modern practices for scalable server applications.**
