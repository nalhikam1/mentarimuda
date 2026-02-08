import { getCollection } from 'astro:content';

export async function GET() {
    const allPosts = await getCollection('blog');

    const searchData = allPosts.map(post => ({
        title: post.data.title,
        url: `/blog/${post.slug}`,
        category: post.data.category || post.data.tags?.[0] || 'Umum',
        description: post.data.description
    }));

    return new Response(JSON.stringify(searchData), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
