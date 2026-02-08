import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const blog = await getCollection('blog');
    return rss({
        title: 'Mentari Muda',
        description: 'Ruang tumbuh untuk jiwa yang ingin belajar, menulis, dan memaknai hidup dengan lebih sadar.',
        site: context.site,
        items: blog.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.pubDate,
            link: `/blog/${post.slug}/`,
        })),
        customData: `<language>id-ID</language>`,
    });
}
