import { Metadata } from "next";
import Link from "next/link";
import { Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PageHeader from "@/components/ui/page-header";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { 
  getAllBlogPosts, 
  getFeaturedBlogPosts, 
  getAllBlogCategories,
  getAllBlogTags
} from "@/lib/api/blog";
import { BlogPostType, BlogCategoryType, BlogTagType } from "@/lib/types/blog";

export const metadata: Metadata = {
  title: "Blog | Ekantik Studio",
  description: "Explore our blog for yoga tips, wellness advice, and studio updates.",
};

export default async function BlogPage() {
  const allPosts = await getAllBlogPosts();
  const featuredPosts = await getFeaturedBlogPosts();
  const categories = await getAllBlogCategories();
  const tags = await getAllBlogTags();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Navbar />
      <main className="pb-16">
        {/* Hero Section */}
        <section className="relative bg-ekantik-50 py-24 md:py-32">
          <div className="container mx-auto px-4">
            <PageHeader
              title="Ekantik Blog"
              description="Insights, tips, and stories to support your yoga and wellness journey"
            />
            <div className="max-w-xl mx-auto mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 py-6 text-base"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                Featured Articles
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-ekantik-600 hover:bg-ekantik-700 text-white">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readingTime} min read</span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link 
                          href={`/blog/${post.slug}`}
                          className="hover:text-ekantik-600 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-gray-700 mb-4 flex-grow">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center mt-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <img
                            src={post.author.image}
                            alt={post.author.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{post.author.name}</p>
                          {post.author.role && (
                            <p className="text-sm text-gray-500">{post.author.role}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Blog Posts */}
              <div className="lg:col-span-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                  Latest Articles
                </h2>
                
                <div className="space-y-10">
                  {allPosts.map((post) => (
                    <article key={post.id} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-1">
                        <Link href={`/blog/${post.slug}`} className="block aspect-square md:aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </Link>
                      </div>
                      <div className="md:col-span-2">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(post.publishedAt)}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readingTime} min read</span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          <Link 
                            href={`/blog/${post.slug}`}
                            className="hover:text-ekantik-600 transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-700 mb-4">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.categories.slice(0, 2).map((category, index) => (
                            <Badge key={index} variant="outline" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                              {category}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                            <img
                              src={post.author.image}
                              alt={post.author.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{post.author.name}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" className="bg-ekantik-50 text-ekantik-700 border-ekantik-200">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-4">
                {/* Categories */}
                <div className="mb-10">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <Link 
                          href={`/blog/category/${category.slug}`}
                          className="text-gray-700 hover:text-ekantik-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                        <Badge variant="outline" className="bg-gray-50 text-gray-500">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Popular Tags */}
                <div className="mb-10">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Popular Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.slice(0, 12).map((tag) => (
                      <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 hover:bg-ekantik-50 hover:text-ekantik-700 transition-colors">
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* Newsletter Signup */}
                <div className="bg-ekantik-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Subscribe to Our Newsletter
                  </h3>
                  <p className="text-gray-700 text-sm mb-4">
                    Get the latest articles, class updates, and exclusive content delivered straight to your inbox.
                  </p>
                  <form className="space-y-3">
                    <Input 
                      placeholder="Your email address" 
                      type="email"
                      required
                    />
                    <Button className="w-full bg-ekantik-600 hover:bg-ekantik-700">
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 mt-3">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-ekantik-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Experience Ekantik Studio?
              </h2>
              <p className="text-xl text-ekantik-100 mb-8">
                Join us for a class and discover the transformative power of yoga and meditation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-white text-ekantik-600 hover:bg-ekantik-50"
                >
                  <Link href="/classes">Browse Classes</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-ekantik-700"
                >
                  <Link href="/memberships">View Memberships</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
