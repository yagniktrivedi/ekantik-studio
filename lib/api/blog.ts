import { BlogPostType, BlogCategoryType, BlogTagType, BlogCommentType } from "../types/blog";

// Mock blog posts data
const blogPosts: BlogPostType[] = [
  {
    id: "1",
    title: "The Benefits of a Regular Yoga Practice",
    slug: "benefits-of-regular-yoga-practice",
    excerpt: "Discover how a consistent yoga practice can transform your physical and mental wellbeing over time.",
    content: `
      <p>A regular yoga practice offers numerous benefits for both body and mind. Physically, yoga improves flexibility, strength, and posture, while also reducing the risk of injury and chronic pain. The practice can also help manage stress, improve sleep quality, and boost overall mental wellbeing.</p>
      
      <h2>Physical Benefits</h2>
      <p>One of the most obvious benefits of yoga is improved flexibility. Poses that may have seemed impossible at first gradually become possible with regular practice. You'll also notice your aches and pains start to disappear as your flexibility increases.</p>
      
      <p>Yoga also builds muscle strength. Strong muscles protect us from conditions like arthritis and back pain and help prevent falls in elderly people. When you build strength through yoga, you balance it with flexibility.</p>
      
      <p>Improved posture is another benefit. Poor posture can cause back, neck, and other muscle and joint problems. As you become more aware of your body through yoga, your posture will naturally improve.</p>
      
      <h2>Mental Benefits</h2>
      <p>The physical benefits of yoga are just the beginning. The mental benefits are equally profound. Regular practice can help reduce stress, which has a devastating effect on the body and mind. Yoga encourages mental clarity and calmness, reduces chronic stress patterns, relaxes the mind, centers attention, and sharpens concentration.</p>
      
      <p>Many people who practice yoga report improved concentration and even greater happiness. Some yoga styles use specific meditation techniques to quiet the constant chatter of the mind. Other yoga styles use breath control (pranayama) to focus the mind and achieve a quiet, peaceful state.</p>
      
      <h2>Getting Started</h2>
      <p>If you're new to yoga, it's best to start with a beginner class where you can learn the basic poses and breathing techniques. At Ekantik Studio, we offer a variety of classes for all levels, from complete beginners to advanced practitioners.</p>
      
      <p>Remember, yoga is not about how flexible or strong you are—it's about creating space in your body and mind through conscious movement and breath.</p>
    `,
    coverImage: "/images/blog/yoga-practice.jpg",
    author: {
      id: "1",
      name: "Maya Patel",
      image: "/images/instructors/maya-patel.jpg",
      role: "Founder & Lead Instructor"
    },
    categories: ["Yoga Practice", "Wellness"],
    tags: ["yoga", "wellness", "beginners", "mental health"],
    publishedAt: "2025-04-15T10:00:00Z",
    readingTime: 5,
    featured: true
  },
  {
    id: "2",
    title: "Understanding the Different Yoga Styles",
    slug: "understanding-different-yoga-styles",
    excerpt: "From Hatha to Vinyasa to Yin - learn about the different yoga styles and find the right one for you.",
    content: `
      <p>With so many different yoga styles available, it can be overwhelming for beginners to know where to start. Each style offers unique benefits and approaches to the practice. Here's a guide to some of the most popular yoga styles to help you find the right fit.</p>
      
      <h2>Hatha Yoga</h2>
      <p>Hatha is a general category that includes most yoga styles. It is the most traditional form of yoga and a great place to start your practice. Hatha classes typically involve a set of physical postures (asanas) and breathing techniques (pranayama) practiced more slowly and with more static posture holds than other styles.</p>
      
      <h2>Vinyasa Yoga</h2>
      <p>Vinyasa, which means "to place in a special way," refers to the continuous flow from one posture to the next. This dynamic practice links movement with breath and is often referred to as "flow" yoga. Classes can vary widely, but you can expect to move quite a bit and potentially work up a sweat.</p>
      
      <h2>Ashtanga Yoga</h2>
      <p>Ashtanga is a rigorous style of yoga that follows a specific sequence of postures linked by breath. This practice is physically demanding and best suited for those looking for an intense, disciplined practice.</p>
      
      <h2>Iyengar Yoga</h2>
      <p>Iyengar yoga focuses on precise alignment and controlled movements. Props like blocks, straps, and chairs are often used to help practitioners achieve proper alignment. This style is excellent for those recovering from injuries or dealing with chronic conditions.</p>
      
      <h2>Yin Yoga</h2>
      <p>Yin yoga is a slow-paced style where poses are held for longer periods—typically 3-5 minutes or longer. It targets the connective tissues, such as the ligaments, bones, and joints, rather than the muscles. This meditative practice is perfect for those looking to increase flexibility and find stillness.</p>
      
      <h2>Restorative Yoga</h2>
      <p>Restorative yoga is all about slowing down and opening the body through passive stretching. Props are used extensively to support the body, allowing for complete relaxation. This gentle style is ideal for those needing to de-stress and recover.</p>
      
      <h2>Finding Your Style</h2>
      <p>At Ekantik Studio, we offer a variety of yoga styles to suit different preferences and needs. We encourage you to try different classes to discover what resonates with you. Remember, the "best" yoga style is the one that you enjoy and will practice regularly.</p>
    `,
    coverImage: "/images/blog/yoga-styles.jpg",
    author: {
      id: "2",
      name: "Sarah Johnson",
      image: "/images/instructors/sarah-johnson.jpg",
      role: "Senior Yoga Instructor"
    },
    categories: ["Yoga Practice", "For Beginners"],
    tags: ["yoga styles", "beginners", "hatha", "vinyasa", "yin"],
    publishedAt: "2025-04-08T14:30:00Z",
    readingTime: 7
  },
  {
    id: "3",
    title: "Mindfulness Meditation: A Beginner's Guide",
    slug: "mindfulness-meditation-beginners-guide",
    excerpt: "Learn the basics of mindfulness meditation and how to incorporate it into your daily routine.",
    content: `
      <p>Mindfulness meditation is a mental training practice that teaches you to slow down racing thoughts, let go of negativity, and calm both your mind and body. It combines meditation with the practice of mindfulness, which is being aware of your body, mind, and feelings in the present moment.</p>
      
      <h2>The Benefits of Mindfulness Meditation</h2>
      <p>Research has shown that mindfulness meditation can reduce stress, anxiety, and depression. It can also improve focus, concentration, and overall mental clarity. Regular practice has been linked to changes in the brain's structure and function, particularly in areas associated with attention and emotion regulation.</p>
      
      <h2>Getting Started with Mindfulness Meditation</h2>
      <p>Here's a simple guide to begin your mindfulness meditation practice:</p>
      
      <h3>1. Find a Quiet Space</h3>
      <p>Choose a quiet, comfortable place where you won't be disturbed for your meditation practice.</p>
      
      <h3>2. Set a Time Limit</h3>
      <p>If you're a beginner, start with a short session of 5-10 minutes. You can gradually work up to longer sessions.</p>
      
      <h3>3. Get Comfortable</h3>
      <p>Sit in a position that allows you to be both relaxed and alert. This could be on a chair, cushion, or yoga mat.</p>
      
      <h3>4. Focus on Your Breath</h3>
      <p>Close your eyes and focus on your breath. Notice the sensation of air moving in and out of your body.</p>
      
      <h3>5. Notice When Your Mind Wanders</h3>
      <p>Inevitably, your mind will wander during meditation. When you notice this happening, gently bring your attention back to your breath.</p>
      
      <h3>6. Be Kind to Your Wandering Mind</h3>
      <p>Don't judge yourself for having wandering thoughts. This is part of the experience. Just gently redirect your attention back to your breath.</p>
      
      <h3>7. Close with Gratitude</h3>
      <p>When you're ready to end your session, slowly open your eyes and take a moment to notice how your body feels. Take a moment to appreciate the time you've taken for yourself.</p>
      
      <h2>Incorporating Mindfulness Into Daily Life</h2>
      <p>Beyond formal meditation sessions, you can practice mindfulness throughout your day. Try to bring awareness to routine activities like eating, walking, or even washing dishes. Notice the sensations, thoughts, and emotions that arise without judgment.</p>
      
      <p>At Ekantik Studio, we offer guided meditation classes for all levels. Join us to deepen your practice and experience the benefits of mindfulness in a supportive community.</p>
    `,
    coverImage: "/images/blog/meditation.jpg",
    author: {
      id: "3",
      name: "David Chen",
      image: "/images/instructors/david-chen.jpg",
      role: "Meditation Instructor"
    },
    categories: ["Meditation", "Mindfulness", "Wellness"],
    tags: ["meditation", "mindfulness", "beginners", "mental health", "stress relief"],
    publishedAt: "2025-04-01T09:15:00Z",
    readingTime: 6
  },
  {
    id: "4",
    title: "The Connection Between Yoga and Nutrition",
    slug: "connection-between-yoga-and-nutrition",
    excerpt: "Explore how a mindful approach to both yoga and nutrition can enhance your overall wellbeing.",
    content: `
      <p>Yoga and nutrition are deeply interconnected practices that can significantly enhance your overall wellbeing when approached mindfully. Both are about nourishing the body and mind, creating balance, and fostering a deeper connection with yourself.</p>
      
      <h2>The Yogic Approach to Nutrition</h2>
      <p>In yogic philosophy, food is more than just fuel for the body. It's seen as a source of prana (life force) that affects our physical, mental, and spiritual wellbeing. The ancient yogic texts describe three types of food:</p>
      
      <ul>
        <li><strong>Sattvic</strong> foods are pure, light, and energy-giving. They include fresh fruits, vegetables, whole grains, nuts, seeds, and legumes.</li>
        <li><strong>Rajasic</strong> foods are stimulating and can increase activity and restlessness. These include spicy foods, coffee, tea, and chocolate.</li>
        <li><strong>Tamasic</strong> foods are heavy and can lead to lethargy and dullness. These include processed foods, meat, alcohol, and stale or overcooked foods.</li>
      </ul>
      
      <p>Traditional yoga practice encourages a predominantly sattvic diet to support physical health and mental clarity.</p>
      
      <h2>Mindful Eating</h2>
      <p>Just as yoga encourages mindfulness on the mat, this awareness can be extended to your eating habits. Mindful eating involves:</p>
      
      <ul>
        <li>Paying full attention to the experience of eating</li>
        <li>Noticing colors, smells, flavors, and textures</li>
        <li>Eating slowly and without distraction</li>
        <li>Listening to physical hunger cues and eating only until you're full</li>
        <li>Distinguishing between actual hunger and emotional triggers for eating</li>
      </ul>
      
      <h2>How Yoga and Nutrition Support Each Other</h2>
      
      <p><strong>Digestion:</strong> Certain yoga poses can stimulate digestion and help relieve digestive discomfort. Twists, forward folds, and gentle inversions can all support healthy digestion.</p>
      
      <p><strong>Body Awareness:</strong> Regular yoga practice increases body awareness, which can help you recognize hunger and fullness cues more accurately.</p>
      
      <p><strong>Mindfulness:</strong> Both yoga and mindful eating cultivate present-moment awareness, which can help reduce stress eating and emotional eating.</p>
      
      <p><strong>Energy Levels:</strong> Proper nutrition provides the energy needed for a strong yoga practice, while yoga helps the body efficiently use the nutrients from food.</p>
      
      <h2>Finding Balance</h2>
      <p>Both yoga and nutrition are personal journeys, and what works best will vary from person to person. Rather than following strict rules, focus on finding a balanced approach that nourishes your body, supports your practice, and makes you feel good.</p>
      
      <p>At Ekantik Studio, we occasionally offer workshops on yoga and nutrition. Join us to learn more about how these practices can complement each other in your wellness journey.</p>
    `,
    coverImage: "/images/blog/yoga-nutrition.jpg",
    author: {
      id: "4",
      name: "Emma Wilson",
      image: "/images/instructors/emma-wilson.jpg",
      role: "Yoga & Nutrition Coach"
    },
    categories: ["Yoga Practice", "Nutrition", "Wellness"],
    tags: ["yoga", "nutrition", "mindful eating", "wellness", "health"],
    publishedAt: "2025-03-25T11:45:00Z",
    readingTime: 8
  },
  {
    id: "5",
    title: "Yoga for Stress Relief: Simple Practices for Busy Lives",
    slug: "yoga-for-stress-relief",
    excerpt: "Discover quick and effective yoga practices that can help manage stress even with a busy schedule.",
    content: `
      <p>In today's fast-paced world, stress has become a common companion for many of us. The good news is that even short yoga practices can provide significant stress relief. You don't need hours on the mat to experience the calming benefits of yoga.</p>
      
      <h2>Understanding Stress and Its Effects</h2>
      <p>When we experience stress, our body's sympathetic nervous system—often called the "fight or flight" response—is activated. This leads to increased heart rate, shallow breathing, and muscle tension. Over time, chronic stress can contribute to numerous health issues, including anxiety, depression, digestive problems, and heart disease.</p>
      
      <p>Yoga helps activate the parasympathetic nervous system—the "rest and digest" response—which counteracts the stress response and promotes relaxation.</p>
      
      <h2>Quick Yoga Practices for Stress Relief</h2>
      
      <h3>1. Breath Awareness (1-5 minutes)</h3>
      <p>Simply bringing awareness to your breath can activate the relaxation response. Sit comfortably, close your eyes, and observe your natural breath for a few minutes. No need to change it—just notice the sensation of breathing.</p>
      
      <h3>2. Three-Part Breath (3-5 minutes)</h3>
      <p>This breathing technique helps expand lung capacity and bring calm:</p>
      <ul>
        <li>Inhale deeply, filling first your lower belly, then your ribcage, then your upper chest</li>
        <li>Exhale in reverse: first emptying your upper chest, then ribcage, then belly</li>
        <li>Repeat for several rounds, keeping your breath smooth and continuous</li>
      </ul>
      
      <h3>3. Quick Desk Yoga (5 minutes)</h3>
      <p>Try these simple stretches at your desk:</p>
      <ul>
        <li>Seated neck rolls: Gently roll your head in circles to release neck tension</li>
        <li>Seated twist: Place your right hand on your left knee and your left hand behind you, gently twisting to the left; repeat on the other side</li>
        <li>Wrist and finger stretches: Extend your arms and gently stretch your wrists and fingers</li>
        <li>Seated forward fold: Sit at the edge of your chair, feet flat on the floor, and fold forward, letting your head and arms hang down</li>
      </ul>
      
      <h3>4. Tension Release Sequence (10 minutes)</h3>
      <p>This short sequence targets common tension areas:</p>
      <ul>
        <li>Child's pose: 1 minute</li>
        <li>Cat-cow stretches: 1-2 minutes</li>
        <li>Gentle twists: 2 minutes</li>
        <li>Forward fold: 1-2 minutes</li>
        <li>Legs up the wall: 3-5 minutes</li>
      </ul>
      
      <h2>Integrating Stress-Relief Practices Into Your Day</h2>
      <p>Consider these strategies for making stress-relief practices a regular part of your routine:</p>
      <ul>
        <li>Set a reminder on your phone for short breathing breaks</li>
        <li>Practice desk yoga during your lunch break</li>
        <li>Do a quick sequence first thing in the morning or before bed</li>
        <li>Use transitions between activities as mindfulness moments</li>
        <li>Try a "yoga snack"—one or two poses whenever you have a spare moment</li>
      </ul>
      
      <p>Remember, consistency is more important than duration. Even five minutes of mindful practice each day can make a significant difference in your stress levels over time.</p>
      
      <p>At Ekantik Studio, we offer specialized stress-relief yoga classes designed for busy individuals. Join us to learn more techniques for managing stress through yoga.</p>
    `,
    coverImage: "/images/blog/stress-relief.jpg",
    author: {
      id: "5",
      name: "Michael Roberts",
      image: "/images/instructors/michael-roberts.jpg",
      role: "Yoga Therapist"
    },
    categories: ["Yoga Practice", "Stress Relief", "Wellness"],
    tags: ["stress relief", "quick yoga", "breathing techniques", "desk yoga", "mental health"],
    publishedAt: "2025-03-18T16:20:00Z",
    readingTime: 6
  }
];

// Mock categories data
const blogCategories: BlogCategoryType[] = [
  {
    id: "1",
    name: "Yoga Practice",
    slug: "yoga-practice",
    description: "Tips, techniques, and insights for your yoga practice",
    count: 15
  },
  {
    id: "2",
    name: "Meditation",
    slug: "meditation",
    description: "Guidance for developing a meditation practice",
    count: 8
  },
  {
    id: "3",
    name: "Wellness",
    slug: "wellness",
    description: "Holistic approaches to health and wellbeing",
    count: 12
  },
  {
    id: "4",
    name: "For Beginners",
    slug: "for-beginners",
    description: "Resources for those new to yoga and meditation",
    count: 10
  },
  {
    id: "5",
    name: "Nutrition",
    slug: "nutrition",
    description: "Mindful eating and nourishment for yogis",
    count: 6
  },
  {
    id: "6",
    name: "Mindfulness",
    slug: "mindfulness",
    description: "Practices for cultivating present-moment awareness",
    count: 9
  },
  {
    id: "7",
    name: "Stress Relief",
    slug: "stress-relief",
    description: "Techniques for managing stress and anxiety",
    count: 7
  },
  {
    id: "8",
    name: "Studio News",
    slug: "studio-news",
    description: "Updates and announcements from Ekantik Studio",
    count: 5
  }
];

// Mock tags data
const blogTags: BlogTagType[] = [
  { id: "1", name: "yoga", slug: "yoga", count: 18 },
  { id: "2", name: "meditation", slug: "meditation", count: 12 },
  { id: "3", name: "wellness", slug: "wellness", count: 15 },
  { id: "4", name: "beginners", slug: "beginners", count: 10 },
  { id: "5", name: "mindfulness", slug: "mindfulness", count: 9 },
  { id: "6", name: "stress relief", slug: "stress-relief", count: 8 },
  { id: "7", name: "mental health", slug: "mental-health", count: 7 },
  { id: "8", name: "nutrition", slug: "nutrition", count: 6 },
  { id: "9", name: "yoga styles", slug: "yoga-styles", count: 5 },
  { id: "10", name: "hatha", slug: "hatha", count: 4 },
  { id: "11", name: "vinyasa", slug: "vinyasa", count: 4 },
  { id: "12", name: "yin", slug: "yin", count: 3 }
];

// Mock comments data
const blogComments: BlogCommentType[] = [
  {
    id: "1",
    postId: "1",
    author: {
      name: "John Smith",
      email: "john@example.com"
    },
    content: "Great article! I've been practicing yoga for a few months now and can definitely attest to the benefits mentioned here.",
    createdAt: "2025-04-16T14:30:00Z"
  },
  {
    id: "2",
    postId: "1",
    author: {
      name: "Lisa Johnson",
      email: "lisa@example.com"
    },
    content: "I've been struggling with back pain for years and started yoga last month. Already seeing improvements in my posture and pain levels.",
    createdAt: "2025-04-16T18:45:00Z"
  },
  {
    id: "3",
    postId: "2",
    author: {
      name: "Mark Wilson",
      email: "mark@example.com"
    },
    content: "This was really helpful! I've been confused about which style to try as a beginner. Think I'll start with Hatha.",
    createdAt: "2025-04-09T10:15:00Z"
  }
];

// API Functions
export async function getAllBlogPosts() {
  // In a real app, this would fetch from Supabase
  return blogPosts;
}

export async function getFeaturedBlogPosts() {
  // In a real app, this would fetch from Supabase
  return blogPosts.filter(post => post.featured);
}

export async function getRecentBlogPosts(limit = 3) {
  // In a real app, this would fetch from Supabase
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export async function getBlogPostBySlug(slug: string) {
  // In a real app, this would fetch from Supabase
  return blogPosts.find(post => post.slug === slug) || null;
}

export async function getBlogPostById(id: string) {
  // In a real app, this would fetch from Supabase
  return blogPosts.find(post => post.id === id) || null;
}

export async function getBlogPostsByCategory(categorySlug: string) {
  // In a real app, this would fetch from Supabase
  const category = blogCategories.find(cat => cat.slug === categorySlug);
  if (!category) return [];
  
  return blogPosts.filter(post => post.categories.includes(category.name));
}

export async function getBlogPostsByTag(tagSlug: string) {
  // In a real app, this would fetch from Supabase
  const tag = blogTags.find(t => t.slug === tagSlug);
  if (!tag) return [];
  
  return blogPosts.filter(post => post.tags.includes(tag.name));
}

export async function getAllBlogCategories() {
  // In a real app, this would fetch from Supabase
  return blogCategories;
}

export async function getAllBlogTags() {
  // In a real app, this would fetch from Supabase
  return blogTags;
}

export async function getRelatedBlogPosts(postId: string, limit = 3) {
  // In a real app, this would use a more sophisticated algorithm
  const currentPost = blogPosts.find(post => post.id === postId);
  if (!currentPost) return [];
  
  return blogPosts
    .filter(post => post.id !== postId && 
      (post.categories.some(cat => currentPost.categories.includes(cat)) || 
       post.tags.some(tag => currentPost.tags.includes(tag))))
    .sort(() => 0.5 - Math.random()) // Simple random sort
    .slice(0, limit);
}

export async function getBlogCommentsByPostId(postId: string) {
  // In a real app, this would fetch from Supabase
  return blogComments.filter(comment => comment.postId === postId);
}

export async function searchBlogPosts(query: string) {
  // In a real app, this would use a more sophisticated search algorithm
  const lowerCaseQuery = query.toLowerCase();
  
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowerCaseQuery) || 
    post.excerpt.toLowerCase().includes(lowerCaseQuery) || 
    post.content.toLowerCase().includes(lowerCaseQuery) ||
    post.categories.some(cat => cat.toLowerCase().includes(lowerCaseQuery)) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
  );
}
