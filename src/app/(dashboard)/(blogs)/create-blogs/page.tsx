// import BreadcrumbHelper from "@/components/breadcrumb-helper";
// import { Separator } from "@/components/ui/separator";
// import React from "react";
// import { CreateBlog } from "../_components/createBlog";
// import { BlogCard, BlogCardType } from "../_components/blog-card";

// const dummyBlogs: BlogCardType[] = [
//   {
//     id: "fXAPQpMNdZvukSiEOSRjulhS33ZCPJ64",
//     brandName: "Zoho",
//     status: "pending",
//     contentType: "Knowledge/Informative",
//     createdAt: new Date(),
//     inputMetadata: {
//       topic: "The Future of AI in Social Media Marketing",
//       description:
//         "A comprehensive guide on how AI can transform your marketing strategy and save you time.",
//     },
//     tags: ["ai", "marketing", "social-media", "saas"],
//   },
//   {
//     id: "another-id",
//     brandName: "Another Brand",
//     status: "draft",
//     contentType: "Creative/Storytelling",
//     createdAt: new Date(),
//     inputMetadata: {
//       topic: "A Developer's Journey to the Cloud",
//       description:
//         "An inspiring story of a developer who built a full-stack application from scratch.",
//     },
//     tags: ["development", "cloud", "nextjs"],
//   },
//   {
//     id: "published-blog-123",
//     brandName: "Tech Insights",
//     status: "published",
//     contentType: "Technical/Tutorial",
//     createdAt: new Date(),
//     inputMetadata: {
//       topic: "Building Scalable Microservices with Docker",
//       description:
//         "A step-by-step guide to containerizing your applications and deploying microservices architecture.",
//     },
//     tags: ["docker", "microservices", "devops", "architecture"],
//   },
//   {
//     id: "seo-guide-456",
//     brandName: "Digital Marketing Pro",
//     status: "published",
//     contentType: "Educational/Guide",
//     createdAt: new Date(),
//     inputMetadata: {
//       topic: "SEO Best Practices for 2024",
//       description:
//         "Learn the latest SEO techniques and strategies to improve your website's visibility and ranking.",
//     },
//     tags: ["seo", "digital-marketing", "content-strategy", "analytics"],
//   },
//   {
//     id: "startup-story-789",
//     brandName: "Startup Weekly",
//     status: "draft",
//     contentType: "Case Study",
//     createdAt: new Date(),
//     inputMetadata: {
//       topic: "From Garage to Global: A Startup Success Story",
//       description:
//         "An in-depth analysis of how a small startup transformed into a global enterprise through innovation and persistence.",
//     },
//     tags: ["startup", "entrepreneurship", "business", "success-story"],
//   },
// ];

// export default function page() {
//   const BreadcrumbItems = [
//     {
//       name: "Dashboard",
//       href: "/dashboard",
//     },
//     {
//       name: "Create Blogs",
//       href: "/create-blogs",
//     },
//   ];
//   return (
//     <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//       <BreadcrumbHelper triggerNeeded breadcrumbItems={BreadcrumbItems} />
//       <div className="w-full flex justify-between items-end">
//         <div>
//           <h1 className="text-5xl font-semibold mb-4">Generate Blogs</h1>
//           <p className="text-muted-foreground w-4xl">
//             Create engaging blog content effortlessly with our AI-powered
//             platform. Generate high-quality articles, optimize for SEO, and
//             maintain a consistent publishing schedule - all in one place.
//           </p>
//         </div>
//         <CreateBlog />
//       </div>
//       <Separator className="my-2" />
//       {/* <div>
//         <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
//           <div className="mb-4">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="64"
//               height="64"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="text-muted-foreground"
//             >
//               <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
//               <polyline points="14 2 14 8 20 8" />
//               <line x1="12" y1="18" x2="12" y2="12" />
//               <line x1="9" y1="15" x2="15" y2="15" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-medium mb-2 text-foreground/70">No Blogs Created Yet</h3>
//           <p className="text-muted-foreground max-w-md text-xs">
//             Start creating your first blog post by clicking the "Show Your
//             Creativity" button above. Let AI help you generate engaging content
//             for your audience.
//           </p>
//         </div>
//       </div> */}
//       <div className="grid grid-cols-3 gap-4 ">
//         {dummyBlogs.map((blog) => (
//           <BlogCard key={blog.id} blog={blog} />
//         ))}
//       </div>
//     </div>
//   );
// }

// @/app/(dashboard)/(blogs)/create-blogs/page.tsx
// This is an async Server Component (no 'use client')
import React, { Suspense } from "react";
import { Loader2, Building2 } from "lucide-react";
import BreadcrumbHelper from "@/components/breadcrumb-helper";
import { Separator } from "@/components/ui/separator";
import { CreateBlog } from "../_components/createBlog";
import { BlogCard, BlogCardType } from "../_components/blog-card"; // Your card component
import {
  getBrandBlogsForUser,
  getCasualBlogsForUser,
} from "../action/getallBlogs";
import { getSession } from "@/lib/session";
// Assuming these are the final, secure imports from your server-queries file

// --- Helper Component to Fetch and Render Blogs ---
async function BlogListSection() {
  const session = await getSession();
  const activeBrandId = session?.session?.activeOrganizationId;

  // 1. Fetch both datasets concurrently for maximum speed
  const [brandResult, casualResult] = await Promise.all([
    getBrandBlogsForUser({ brandId: activeBrandId as string }),
    getCasualBlogsForUser(),
  ]);

  // Handle initial errors (security check is done inside the server actions)
  if (!brandResult.success || !casualResult.success) {
    return (
      <div className="text-center p-12 text-red-500">
        <p>Error: Could not load blogs. Please ensure you are authenticated.</p>
      </div>
    );
  }

  const brandBlogs = brandResult.blogs;
  const casualBlogs = casualResult.blogs;
  const allBlogs = [...(brandBlogs || []), ...(casualBlogs || [])];

  if (allBlogs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-16 flex flex-col items-center justify-center gap-6 p-12 rounded-lg border border-dashed border-muted">
        <Building2 className="w-12 h-12 text-muted-foreground/30" />
        <div className="space-y-2 text-center">
          <h3 className="font-semibold text-xl">No Blogs Created Yet</h3>
          <p className="text-muted-foreground text-sm max-w-md">
            Start creating your first blog post by clicking the "Show Your
            Creativity" button above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 1. Brand-Driven Posts Section */}
      {brandBlogs && brandBlogs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Brand-Driven Posts ({brandBlogs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* We cast to the BlogCardType since the server query guarantees the structure */}
            {brandBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* 2. Casual Posts Section */}
      {casualBlogs && casualBlogs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Casual Posts ({casualBlogs.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {casualBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog as BlogCardType} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// --- Main Page Component ---
export default function Page() {
  const BreadcrumbItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Create Blogs", href: "/create-blogs" },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <BreadcrumbHelper triggerNeeded breadcrumbItems={BreadcrumbItems} />

      <div className="w-full flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-semibold mb-4">Generate Blogs</h1>
          <p className="text-muted-foreground max-w-2xl">
            Create engaging blog content effortlessly with our AI-powered
            platform.
          </p>
        </div>
        <CreateBlog />
      </div>

      <Separator className="my-2" />

      {/* Use Suspense to handle the initial loading state */}
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        }
      >
        <BlogListSection />
      </Suspense>
    </div>
  );
}
