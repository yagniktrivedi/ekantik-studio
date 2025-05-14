import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { 
  getBlogPostBySlug, 
  getRelatedBlogPosts,
  getBlogCommentsByPostId
} from "@/lib/api/blog";
import { BlogPostType, BlogCommentType } from "@/lib/types/blog";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Ekantik Studio Blog",
    };
  }
  
  return {
    title: `${post.title} | Ekantik Studio Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getBlogPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const relatedPosts = await getRelatedBlogPosts(post.id, 3);
  const comments = await getBlogCommentsByPostId(post.id);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 pt-8">
          <Button
            asChild
            variant="ghost"
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>
        </div>
        
        {/* Article Header */}
        <article className="container mx-auto px-4 max-w-4xl">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category, index) => (
                <Link key={index} href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Badge className="bg-ekantik-50 text-ekantik-700 hover:bg-ekantik-100 transition-colors">
                    {category}
                  </Badge>
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
            
            <div className="flex items-center mb-6">
              <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mr-auto">
                <p className="font-medium text-gray-900">{post.author.name}</p>
                {post.author.role && (
                  <p className="text-sm text-gray-500">{post.author.role}</p>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(post.publishedAt)}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </header>
          
          {/* Featured Image */}
          <div className="aspect-video rounded-lg overflow-hidden mb-10">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Article Content */}
          <div 
            className="prose max-w-none mb-10"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link key={index} href={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-ekantik-50 hover:text-ekantik-700 transition-colors">
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Share & Like */}
          <div className="flex items-center justify-between mb-10">
            <Button variant="outline" className="flex items-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="flex items-center">
              <Heart className="h-4 w-4 mr-2" />
              Like
            </Button>
          </div>
          
          <Separator className="mb-10" />
          
          {/* Author Bio */}
          <div className="bg-gray-50 rounded-lg p-6 mb-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="h-20 w-20 rounded-full overflow-hidden shrink-0">
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center md:text-left">
                  About {post.author.name}
                </h3>
                <p className="text-gray-700 mb-4">
                  {post.author.role === "Founder & Lead Instructor" 
                    ? "Maya is the founder of Ekantik Studio and has been teaching yoga for over 15 years. She specializes in Vinyasa and Hatha yoga, with a focus on alignment and mindful movement."
                    : `${post.author.name} is a dedicated instructor at Ekantik Studio with a passion for sharing the transformative power of yoga with students of all levels.`
                  }
                </p>
                <div className="flex justify-center md:justify-start">
                  <Button asChild variant="outline" className="text-ekantik-600 border-ekantik-200 hover:bg-ekantik-50">
                    <Link href={`/instructors/${post.author.id}`}>
                      View Full Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
        
        {/* Comments Section */}
        <section className="container mx-auto px-4 max-w-4xl mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>
          
          {comments.length > 0 ? (
            <div className="space-y-6 mb-8">
              {comments.map((comment: BlogCommentType) => (
                <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                      {comment.author.image && <AvatarImage src={comment.author.image} alt={comment.author.name} />}
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                      <Button variant="ghost" size="sm" className="mt-2 text-gray-500 hover:text-ekantik-600">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
              <p className="text-gray-700">No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
          
          {/* Comment Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Leave a Comment</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ekantik-600"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ekantik-600"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ekantik-600"
                  required
                ></textarea>
              </div>
              <Button className="bg-ekantik-600 hover:bg-ekantik-700">
                Post Comment
              </Button>
            </form>
          </div>
        </section>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                You May Also Like
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {relatedPosts.map((relatedPost: BlogPostType) => (
                  <Card key={relatedPost.id} className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(relatedPost.publishedAt)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{relatedPost.readingTime} min read</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/blog/${relatedPost.slug}`}
                          className="hover:text-ekantik-600 transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-700 text-sm mb-4 flex-grow">
                        {relatedPost.excerpt}
                      </p>
                      
                      <Button asChild variant="outline" className="mt-auto text-ekantik-600 border-ekantik-200 hover:bg-ekantik-50">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Newsletter CTA */}
        <section className="py-16 bg-ekantik-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Enjoyed this article?
              </h2>
              <p className="text-xl text-ekantik-100 mb-8">
                Subscribe to our newsletter for more yoga insights, wellness tips, and studio updates.
              </p>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-md flex-grow"
                  required
                />
                <Button className="bg-white text-ekantik-600 hover:bg-ekantik-50 whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
              <p className="text-sm text-ekantik-200 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
