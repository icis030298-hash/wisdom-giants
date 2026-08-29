import { NextResponse } from 'next/server';

/** Every app-API error body is `{ code, ...extra }` (see app-api-contract.md). */
export function jsonError(
  status: number,
  code: string,
  extra: Record<string, unknown> = {},
  headers?: HeadersInit
) {
  return NextResponse.json({ code, ...extra }, { status, headers });
}

export const authRequired = () => jsonError(401, 'AUTH_REQUIRED');
