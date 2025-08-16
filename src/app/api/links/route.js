import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'public', 'sps_link.json');

export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return new Response(data, { status: 200 });
  } catch (e) {
    return new Response('[]', { status: 200 });
  }
}

export async function POST(request) {
  const formData = await request.formData();
  const title = formData.get('title');
  const link = formData.get('link');
  if (!title || !link) return new Response('Invalid', { status: 400 });

  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  data[title] = link;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return new Response(JSON.stringify(data), { status: 200 });
}

export async function DELETE(request) {
  const { title } = await request.json();
  const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
  delete data[title];
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return new Response(JSON.stringify(data), { status: 200 });
} 