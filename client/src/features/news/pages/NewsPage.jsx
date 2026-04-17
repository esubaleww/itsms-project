import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  Newspaper,
  Loader2,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { format } from "date-fns";
import { useAnnouncements } from "../../../hooks/useAnnouncements";

const categoryColors = {
  announcement: "bg-blue-500/20 text-blue-400",
  news: "bg-emerald-500/20 text-emerald-400",
  event: "bg-purple-500/20 text-purple-400",
  success_story: "bg-amber-500/20 text-amber-400",
  opportunity: "bg-cyan-500/20 text-cyan-400",
  update: "bg-indigo-500/20 text-indigo-400",
};

const categoryLabels = {
  announcement: "Announcement",
  news: "News",
  event: "Event",
  success_story: "Success Story",
  opportunity: "Opportunity",
  update: "Update",
};

export default function NewsPage() {
  const navigate = useNavigate();
  const { announcements, loading, error, fetchAnnouncements } =
    useAnnouncements();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMM dd, yyyy");
  };

  const formatReadTime = (content) => {
    if (!content) return "2 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s/g).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  const featuredNews = announcements.filter((item) => item.isFeatured);
  const regularNews = announcements.filter((item) => !item.isFeatured);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchAnnouncements}
            className="mt-4 text-emerald-400 hover:text-emerald-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sticky Back Button - Always visible while scrolling */}
      <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <section className="bg-linear-to-r from-emerald-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl font-bold">
              News & Announcements
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Stay updated with the latest news, events, and success stories
              from the Innovation and Technology Bureau
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured News - Full width with image */}
        {featuredNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Featured</h2>
            {featuredNews.map((item) => {
              const categoryColor =
                categoryColors[item.category] || categoryColors.announcement;
              const categoryLabel =
                categoryLabels[item.category] || "Announcement";
              return (
                <div
                  key={item._id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzM5ODQ5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-gray-900/50 to-transparent"></div>
                    </div>
                    <div className="p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}
                          >
                            {categoryLabel}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(item.publishedDate)}
                          </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 mb-6">
                          {item.excerpt || item.content?.substring(0, 200)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatReadTime(item.content)}
                        </span>
                        <Link to={`/news/${item._id}`}>
                          <button className="px-5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-lg transition flex items-center gap-2 text-sm font-medium border border-emerald-500/20 hover:border-transparent">
                            Read More <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Latest Updates - Grid layout */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-white">Latest Updates</h2>
          {regularNews.length === 0 && featuredNews.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No announcements yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularNews.map((item, index) => {
                const categoryColor =
                  categoryColors[item.category] || categoryColors.announcement;
                const categoryLabel =
                  categoryLabels[item.category] || "Announcement";
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 group h-full flex flex-col">
                      <div className="relative h-48 overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}
                          >
                            {categoryLabel}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.publishedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatReadTime(item.content)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                          {item.excerpt || item.content?.substring(0, 120)}
                        </p>
                        <Link to={`/news/${item._id}`}>
                          <div className="inline-flex items-center text-emerald-400 text-sm font-medium group-hover:gap-2 transition-all">
                            Read More{" "}
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:ml-2 transition" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
