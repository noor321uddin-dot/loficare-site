import type { APIRoute } from 'astro';
import { handleLead } from '../../lib/leads';

export const prerender = false;
export const POST: APIRoute = (ctx) => handleLead(ctx, 'trial');
