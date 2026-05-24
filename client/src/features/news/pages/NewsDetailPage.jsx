import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Newspaper,
} from "lucide-react";
import { format } from "date-fns";
import { useAnnouncements } from "../../../hooks/useAnnouncements";

const categoryColors = {
  announcement: "bg-blue-50 text-accent",
  news: "bg-green-50 text-green-600",
  event: "bg-purple-50 text-purple-600",
  success_story: "bg-amber-50 text-amber-600",
  opportunity: "bg-cyan-50 text-cyan-600",
  update: "bg-indigo-50 text-indigo-600",
};

const categoryLabels = {
  announcement: "Announcement",
  news: "News",
  event: "Event",
  success_story: "Success Story",
  opportunity: "Opportunity",
  update: "Update",
};

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAnnouncementById, loading, error } = useAnnouncements();
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await getAnnouncementById(id);
        setAnnouncement(data);
      } catch (err) {
        console.error("Failed to fetch announcement:", err);
      }
    };
    fetchAnnouncement();
  }, [id, getAnnouncementById]);

  const formatDate = (date) => {
    if (!date) return "";
    return format(new Date(date), "MMMM dd, yyyy");
  };

  const formatReadTime = (content) => {
    if (!content) return "2 min read";
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s/g).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">Announcement not found</p>
          <button
            onClick={() => navigate("/news")}
            className="mt-4 text-accent hover:text-blue-700"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  const categoryColor =
    categoryColors[announcement.category] || categoryColors.announcement;
  const categoryLabel = categoryLabels[announcement.category] || "Announcement";

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 font-body">
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate("/news")}
            className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to News</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryColor}`}
            >
              {categoryLabel}
            </span>
            <span className="text-sm text-text-muted flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(announcement.publishedDate)}
            </span>
            <span className="text-sm text-text-muted flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatReadTime(announcement.content)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-medium text-text-primary leading-tight">
            {announcement.title}
          </h1>

          {announcement.image?.url && (
            <div className="rounded-2xl overflow-hidden border border-gray-200">
              <img
                src={announcement.image.url}
                alt={announcement.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div className="text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">
              {announcement.content}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-8 flex justify-between items-center">
            <button
              onClick={() => window.print()}
              className="text-sm text-text-muted hover:text-accent transition"
            >
              Print this article
            </button>
            {typeof navigator.share === "function" && (
              <button
                onClick={() => {
                  navigator.share({
                    title: announcement.title,
                    text: announcement.excerpt,
                    url: window.location.href,
                  });
                }}
                className="text-sm text-text-muted hover:text-accent transition flex items-center gap-1"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            )}
          </div>
        </motion.div>
      </article>
    </div>
  );
}
