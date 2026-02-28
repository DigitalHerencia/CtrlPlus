import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TenantScopedPrisma } from '../../lib/db/prisma';

function readRepositoryFile(...parts: string[]): string {
  return readFileSync(join(process.cwd(), ...parts), 'utf8');
}

describe('prisma multi-tenant schema', () => {
  it('ensures scoped models include tenantId', () => {
    const schema = readRepositoryFile('prisma', 'schema.prisma');

    expect(schema).toContain('model User');
    expect(schema).toContain('model WrapDesign');
    expect(schema).toContain('tenantId  String');
    expect(schema).toContain('model Upload');
    expect(schema).toContain('@@index([tenantId])');
  });

  it('ships a migration that provisions tenant scoping', () => {
    const migrationSql = readRepositoryFile(
      'prisma',
      'migrations',
      '20260218010100_multi_tenant_schema',
      'migration.sql'
    );

    expect(migrationSql).toContain('CREATE TABLE "User"');
    expect(migrationSql).toContain('CREATE TABLE "WrapDesign"');
    expect(migrationSql).toContain('"tenantId" TEXT NOT NULL');
    expect(migrationSql).toContain('CREATE INDEX "WrapDesign_tenantId_idx"');
  });

  it('defines normalized Clerk sync models and tenant-safe indexes', () => {
    const schema = readRepositoryFile('prisma', 'schema.prisma');

    expect(schema).toContain('model ClerkUser');
    expect(schema).toContain('model TenantUserMembership');
    expect(schema).toContain('model ClerkWebhookEvent');
    expect(schema).toContain('@@unique([tenantId, clerkUserId])');
    expect(schema).toContain('@@index([tenantId, isActive])');
    expect(schema).toContain('@@index([tenantId, role, isActive])');
    expect(schema).toContain('@@index([tenantId, receivedAt])');
  });

  it('ships a migration that provisions Clerk sync tables', () => {
    const migrationSql = readRepositoryFile(
      'prisma',
      'migrations',
      '20260228010000_clerk_sync_tables',
      'migration.sql'
    );

    expect(migrationSql).toContain('CREATE TABLE "ClerkUser"');
    expect(migrationSql).toContain('CREATE TABLE "TenantUserMembership"');
    expect(migrationSql).toContain('CREATE TABLE "ClerkWebhookEvent"');
    expect(migrationSql).toContain('CREATE UNIQUE INDEX "TenantUserMembership_tenantId_clerkUserId_key"');
    expect(migrationSql).toContain('CREATE UNIQUE INDEX "ClerkWebhookEvent_clerkEventId_key"');
  });



  it('ships an upload migration with tenant scoping', () => {
    const migrationSql = readRepositoryFile(
      'prisma',
      'migrations',
      '20260225000100_upload_table',
      'migration.sql'
    );

    expect(migrationSql).toContain('CREATE TABLE "Upload"');
    expect(migrationSql).toContain('"tenantId" TEXT NOT NULL');
    expect(migrationSql).toContain('CREATE INDEX "Upload_tenantId_idx"');
  });
  it('validates tenant isolation in integration flow', () => {
    const tenantDb = new TenantScopedPrisma();

    tenantDb.createWrapDesign({
      tenantId: 'tenant_acme',
      name: 'Acme Matte Black',
      priceCents: 50000,
      isPublished: false
    });
    tenantDb.createWrapDesign({
      tenantId: 'tenant_beta',
      name: 'Beta Gloss White',
      priceCents: 45000,
      isPublished: false
    });

    const acmeWraps = tenantDb.listWrapDesignsByTenant('tenant_acme');
    const betaWraps = tenantDb.listWrapDesignsByTenant('tenant_beta');

    expect(acmeWraps).toHaveLength(1);
    expect(acmeWraps[0]?.name).toBe('Acme Matte Black');
    expect(betaWraps).toHaveLength(1);
    expect(betaWraps[0]?.name).toBe('Beta Gloss White');
  });
});

