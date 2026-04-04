import accommodationImage from '../assets/Accommodation.jpg';
import diningBarImage from '../assets/dining&bar.jpg';
import eventsMeetingsImage from '../assets/events&meetings.jpg';
import spaImage from '../assets/spa.jpg';
import waterParkImage from '../assets/kuriftu-water-park.jpg';

export const EXPERIENCES = [
    {
        id: 'suites',
        name: 'Presidential Suites',
        image: accommodationImage,
        subtitle: 'Lakeside Serenity',
        desc: 'Experience the pinnacle of Ethiopian luxury in our lakeside suites, featuring 24/7 personalized butler service and panoramic views of Lake Bishoftu.',
        tag: 'Premium Selection',
        iconKey: 'hotel',
        detailTitle: 'An elevated stay crafted around privacy and panorama.',
        detailBody: 'Our signature suites blend stillness, lake views, and attentive service into a stay that feels both ceremonial and deeply restful.',
        highlights: ['Private lakeside setting', '24/7 butler service', 'Panoramic Bishoftu views']
    },
    {
        id: 'spa',
        name: 'Spa & Wellness',
        image: spaImage,
        subtitle: 'Ancient Ethio-Therapy',
        desc: 'Our signature 90-minute Ethiopian Coffee Scrub and hot stone massage, curated by AI based on your wellness profile.',
        tag: 'AI Recommended',
        special: true,
        iconKey: 'wind',
        detailTitle: 'Wellness rituals inspired by Ethiopian tradition.',
        detailBody: 'Reset with a curated blend of coffee exfoliation, hot stone therapy, and quiet recovery spaces shaped around your ideal pace.',
        highlights: ['Coffee scrub ritual', 'Hot stone massage', 'AI-personalized recommendation']
    },
    {
        id: 'dining',
        name: 'Lakeside Gastronomy',
        image: diningBarImage,
        subtitle: 'Gourmet Fusion',
        desc: 'A five-course tasting menu blending traditional Ethiopian flavors with modern international fine dining, curated for the sunset hour.',
        tag: "Chef's Choice",
        iconKey: 'utensils',
        detailTitle: 'A dining journey designed for long evenings and layered flavor.',
        detailBody: 'From refined Ethiopian inspirations to globally influenced plating, each course is timed around atmosphere, conversation, and lakefront light.',
        highlights: ['Five-course tasting menu', 'Lakefront dining ambience', 'Traditional-meets-modern cuisine']
    },
    {
        id: 'water-park',
        name: 'Kuriftu Water Park',
        image: waterParkImage,
        subtitle: 'Adventure & Play',
        desc: 'Spend the day with resort slides, splash zones, and vibrant poolside energy tailored for families and fun-seekers alike.',
        tag: 'Family Favorite',
        iconKey: 'palmtree',
        detailTitle: 'A brighter, more playful rhythm for active guests.',
        detailBody: 'Slides, pools, and open-air leisure spaces make this the ideal stop for guests who want movement, laughter, and a more energetic resort day.',
        highlights: ['Slides and splash zones', 'Family-friendly layout', 'Poolside relaxation areas']
    },
    {
        id: 'events-meetings',
        name: 'Events & Meetings',
        image: eventsMeetingsImage,
        subtitle: 'Celebrate in Style',
        desc: 'Host polished corporate sessions, intimate gatherings, and standout celebrations in curated spaces backed by resort hospitality.',
        tag: 'Signature Venue',
        iconKey: 'compass',
        detailTitle: 'Spaces that feel polished enough for business and warm enough for celebration.',
        detailBody: 'Whether you are planning a private event, executive offsite, or milestone celebration, our venue settings are shaped for ease and presence.',
        highlights: ['Executive-ready venues', 'Private event support', 'Dedicated hospitality coordination']
    }
];

export function getExperienceById(id) {
    return EXPERIENCES.find((experience) => experience.id === id);
}
