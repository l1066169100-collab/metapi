import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('release workflow', () => {
  it('builds a linux amd64 server image tarball as the release artifact', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/release.yml'), 'utf8');

    expect(workflow).toContain('name: Build Server Image (linux-amd64)');
    expect(workflow).toContain('--platform linux/amd64');
    expect(workflow).toContain('--output type=docker,dest=metapi-linux-amd64.tar');
    expect(workflow).toContain('gzip -f metapi-linux-amd64.tar');
    expect(workflow).toContain('metapi-linux-amd64.tar.gz');
  });

  it('publishes the server image tarball to the GitHub release', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/release.yml'), 'utf8');

    expect(workflow).toContain('name: Download server image artifact');
    expect(workflow).toContain('name: metapi-server-image-linux-amd64-${{ github.sha }}');
    expect(workflow).toContain('files: release-assets/metapi-linux-amd64.tar.gz');
  });

  it('pushes the linux amd64 server image to ghcr', () => {
    const workflow = readFileSync(resolve(process.cwd(), '.github/workflows/release.yml'), 'utf8');

    expect(workflow).toContain('name: Publish Docker Image (linux-amd64)');
    expect(workflow).toContain('registry: ghcr.io');
    expect(workflow).toContain('platforms: linux/amd64');
    expect(workflow).toContain('IMAGE_NAME: ghcr.io/${{ github.repository }}');
  });
});
