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
  announcement: "bg-[#EEF2FF] text-[#2563eb]",
  news: "bg-[#F0FDF4] text-[#16a34a]",
  event: "bg-[#FAF5FF] text-[#9333ea]",
  success_story: "bg-[#FFFBEB] text-[#d97706]",
  opportunity: "bg-[#ECFEFF] text-[#0891b2]",
  update: "bg-[#F5F3FF] text-[#7c3aed]",
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
      <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#2563eb] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchAnnouncements}
            className="mt-4 text-[#2563eb] hover:text-[#1d4ed8]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F9FAFB] to-[#F3F4F6]">
      {/* Sticky Back Button */}
      <div className="sticky top-0 z-30 bg-[#F9FAFB]/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#6b7280] hover:text-[#2563eb] transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <section
        className="text-[#111827] py-16 border-b border-[#E5E7EB]"
        style={{ background: "linear-gradient(135deg, #EEF2FF, #DBEAFE)" }}
      >
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
            <p className="text-lg text-[#334155] max-w-2xl mx-auto">
              Stay updated with the latest news, events, and success stories
              from the Innovation and Technology Bureau
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured News Section */}
        {featuredNews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-[#111827] mb-6">Featured</h2>
            <div className="space-y-8">
              {featuredNews.map((item, index) => {
                const categoryColor =
                  categoryColors[item.category] || categoryColors.announcement;
                const categoryLabel =
                  categoryLabels[item.category] || "Announcement";
                return (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#2563eb]/50 transition-all duration-300"
                  >
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Image - full height, object-cover maintains aspect ratio */}
                      <div className="relative overflow-hidden">
                        {item.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full min-h-75 bg-[#F3F4F6] flex items-center justify-center">
                            <Newspaper className="w-16 h-16 text-[#9CA3AF]" />
                          </div>
                        )}
                      </div>
                      {/* Content - natural height, no scrolling */}
                      <div className="p-8 flex flex-col">
                        <div>
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}
                            >
                              {categoryLabel}
                            </span>
                            <span className="text-sm text-[#6b7280] flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.publishedDate)}
                            </span>
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-[#111827] mb-4">
                            {item.title}
                          </h3>
                          <p className="text-[#6b7280] mb-6">
                            {item.excerpt || item.content?.substring(0, 300)}
                            {item.content?.length > 300 && "..."}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4">
                          <span className="text-sm text-[#6b7280] flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatReadTime(item.content)}
                          </span>
                          <Link to={`/news/${item._id}`}>
                            <button className="px-5 py-2 bg-emerald-600/20 hover:bg-emerald-600 text-[#2563eb] hover:text-[#111827] rounded-lg transition flex items-center gap-2 text-sm font-medium border border-[#2563eb]/20 hover:border-transparent">
                              Read More <ArrowRight className="w-4 h-4" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Latest Updates - Grid layout */}
        <div className="space-y-8">
          <div className="pb-4 border-b border-[#E5E7EB]">
            <h2 className="text-2xl font-bold text-[#111827]">
              Latest Updates
            </h2>
          </div>
          {regularNews.length === 0 && featuredNews.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-12 h-12 text-[#9ca3af] mx-auto mb-4" />
              <p className="text-[#6b7280]">No announcements yet</p>
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
                  >
                    <div className="bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] backdrop-blur-sm rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-xl hover:border-[#2563eb]/50 transition-all duration-300 group h-full flex flex-col">
                      {/* Image - fixed height, object-cover */}
                      <div className="relative h-48 overflow-hidden shrink-0">
                        {item.image?.url ? (
                          <img
                            src={item.image.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F3F4F6] flex items-center justify-center">
                            <Newspaper className="w-8 h-8 text-[#9CA3AF]" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}
                          >
                            {categoryLabel}
                          </span>
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-[#6b7280] mb-3 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.publishedDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatReadTime(item.content)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111827] mb-2 line-clamp-2 group-hover:text-[#2563eb] transition">
                          {item.title}
                        </h3>
                        <p className="text-[#6b7280] text-sm mb-4 line-clamp-3">
                          {item.excerpt || item.content?.substring(0, 120)}
                        </p>
                        <Link to={`/news/${item._id}`}>
                          <div className="inline-flex items-center text-[#2563eb] text-sm font-medium group-hover:gap-2 transition-all mt-auto">
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
