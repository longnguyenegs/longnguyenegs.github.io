export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div>
      Mock Post: <code>{slug}</code>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ slug: 'test-post-1' }];
}
