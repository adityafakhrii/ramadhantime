import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
  Send,
  Plus,
  X,
  HandHeart,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FORUM_POSTS, type ForumPost, type ForumComment } from '@/data/forum';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<ForumPost['category'], { label: string; color: string; emoji: string }> = {
  doa: { label: '🤲 Doa', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', emoji: '🤲' },
  status: { label: '✨ Status', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400', emoji: '✨' },
  sharing: { label: '📖 Sharing', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400', emoji: '📖' },
  tausiyah: { label: '🕌 Tausiyah', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400', emoji: '🕌' },
};

const CATEGORY_SUCCESS_MSG: Record<ForumPost['category'], string> = {
  doa: 'Doa kamu telah dibagikan, semoga dikabulkan! 🤲',
  status: 'Status berhasil diposting! ✨',
  sharing: 'Sharing kamu telah dipublikasikan! 📖',
  tausiyah: 'Tausiyah berhasil dibagikan, semoga bermanfaat! 🕌',
};

export const ForumView = () => {
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set());
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<ForumPost['category']>('status');
  const [isPosting, setIsPosting] = useState(false);
  const [successPost, setSuccessPost] = useState<ForumPost | null>(null);

  // Auto-dismiss success popup
  useEffect(() => {
    if (successPost) {
      const timer = setTimeout(() => setSuccessPost(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successPost]);

  const handleDoa = useCallback((postId: string) => {
    setLikedPosts(prev => {
      const copy = new Set(prev);
      if (copy.has(postId)) {
        copy.delete(postId);
      } else {
        copy.add(postId);
      }
      return copy;
    });
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, doaCount: likedPosts.has(postId) ? p.doaCount - 1 : p.doaCount + 1 }
          : p
      )
    );
  }, [likedPosts]);

  const handleSave = useCallback((postId: string) => {
    setSavedPosts(prev => {
      const copy = new Set(prev);
      if (copy.has(postId)) {
        copy.delete(postId);
        toast('Dihapus dari Simpanan');
      } else {
        copy.add(postId);
        toast('Tersimpan!');
      }
      return copy;
    });
  }, []);

  const handleShare = useCallback((post: ForumPost) => {
    const shareText = `${post.content}\n\n— ${post.userName} via Akyash Pro`;
    if (navigator.share) {
      navigator.share({ text: shareText }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast('Disalin ke clipboard!');
      });
    }
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, shareCount: p.shareCount + 1 } : p));
  }, []);

  const handleAddComment = useCallback((postId: string) => {
    if (!newComment.trim()) return;
    const comment: ForumComment = {
      id: `new-${Date.now()}`,
      userId: 'user-me',
      userName: 'Saya',
      userAvatar: '😊',
      content: newComment.trim(),
      timestamp: 'Baru saja',
    };
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? { ...p, comments: [...p.comments, comment], commentCount: p.commentCount + 1 }
          : p
      )
    );
    setNewComment('');
  }, [newComment]);

  const handleCreatePost = useCallback(() => {
    if (!newPostContent.trim()) return;

    setIsPosting(true);

    // Simulate posting delay for realistic feel
    setTimeout(() => {
      const post: ForumPost = {
        id: `new-post-${Date.now()}`,
        userId: 'user-me',
        userName: 'Saya',
        userAvatar: '😊',
        content: newPostContent.trim(),
        category: newPostCategory,
        timestamp: 'Baru saja',
        doaCount: 0,
        commentCount: 0,
        shareCount: 0,
        comments: [],
      };
      setPosts(prev => [post, ...prev]);
      setNewPostContent('');
      setIsPosting(false);
      setShowCreatePost(false);
      setSuccessPost(post);
    }, 1200);
  }, [newPostContent, newPostCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-6 px-4 pb-20 h-[calc(100vh-4rem)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <HandHeart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Forum</h2>
            <p className="text-sm text-muted-foreground">Saling mendoakan & berbagi</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreatePost(true)}
          className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Posts Feed */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 pb-10">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <PostCard
                  post={post}
                  isLiked={likedPosts.has(post.id)}
                  isSaved={savedPosts.has(post.id)}
                  isCommentsOpen={openComments === post.id}
                  onDoa={() => handleDoa(post.id)}
                  onSave={() => handleSave(post.id)}
                  onShare={() => handleShare(post)}
                  onToggleComments={() => setOpenComments(prev => prev === post.id ? null : post.id)}
                  newComment={openComments === post.id ? newComment : ''}
                  onNewCommentChange={setNewComment}
                  onSubmitComment={() => handleAddComment(post.id)}
                />
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end justify-center"
            onClick={() => !isPosting && setShowCreatePost(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-background rounded-t-3xl w-full max-w-lg p-6 pb-24 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle */}
              <div className="flex justify-center mb-4">
                <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Buat Postingan</h3>
                <button
                  onClick={() => !isPosting && setShowCreatePost(false)}
                  disabled={isPosting}
                  className="p-2 bg-muted/50 rounded-full text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* User preview */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-base select-none">
                  😊
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Saya</p>
                  <p className="text-[10px] text-muted-foreground">Akan diposting ke Forum</p>
                </div>
              </div>

              {/* Category selector */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(Object.entries(CATEGORY_LABELS) as [ForumPost['category'], { label: string; color: string; emoji: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => !isPosting && setNewPostCategory(key)}
                    disabled={isPosting}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      newPostCategory === key
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted/30 text-muted-foreground'
                    } disabled:opacity-60`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Tulis doa, status, atau sharing kamu..."
                disabled={isPosting}
                className="w-full h-32 bg-muted/20 rounded-2xl p-4 text-foreground text-sm placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/30 disabled:opacity-60"
              />

              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isPosting}
                className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {isPosting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memposting...
                  </>
                ) : (
                  'Posting'
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup Overlay */}
      <AnimatePresence>
        {successPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center px-6"
            onClick={() => setSuccessPost(null)}
          >
            {/* Subtle backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            />
            {/* Success card */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative bg-background rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-border/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.15, damping: 12 }}
                  className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-9 h-9 text-primary" />
                </motion.div>
              </div>

              {/* Category badge */}
              <div className="flex justify-center mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_LABELS[successPost.category].color}`}>
                  {CATEGORY_LABELS[successPost.category].label}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-center text-lg font-bold text-foreground mb-1">
                Berhasil Diposting!
              </h3>
              <p className="text-center text-sm text-muted-foreground mb-4">
                {CATEGORY_SUCCESS_MSG[successPost.category]}
              </p>

              {/* Post preview */}
              <div className="bg-muted/20 rounded-2xl p-4 mb-4 border border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs select-none">
                    😊
                  </div>
                  <span className="text-xs font-bold text-foreground">Saya</span>
                  <span className="text-[10px] text-muted-foreground">• Baru saja</span>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed line-clamp-3">
                  {successPost.content}
                </p>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => setSuccessPost(null)}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Lihat di Forum
              </button>

              {/* Auto-dismiss progress bar */}
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 3, ease: 'linear' }}
                className="mt-3 h-0.5 bg-primary/30 rounded-full origin-left"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Post Card ────────────────────────────────────────────────────

interface PostCardProps {
  post: ForumPost;
  isLiked: boolean;
  isSaved: boolean;
  isCommentsOpen: boolean;
  onDoa: () => void;
  onSave: () => void;
  onShare: () => void;
  onToggleComments: () => void;
  newComment: string;
  onNewCommentChange: (v: string) => void;
  onSubmitComment: () => void;
}

function PostCard({
  post,
  isLiked,
  isSaved,
  isCommentsOpen,
  onDoa,
  onSave,
  onShare,
  onToggleComments,
  newComment,
  onNewCommentChange,
  onSubmitComment,
}: PostCardProps) {
  const catInfo = CATEGORY_LABELS[post.category];

  return (
    <div className="bg-background rounded-2xl shadow-neu overflow-hidden">
      {/* User Info */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg select-none">
            {post.userAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground truncate">{post.userName}</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${catInfo.color}`}>
                {catInfo.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{post.timestamp}</p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-2">
          {post.content}
        </p>

        {post.arabicText && (
          <div className="bg-primary/5 rounded-xl p-4 mb-2">
            <p className="text-xl font-arabic text-foreground text-right leading-loose" dir="rtl">
              {post.arabicText}
            </p>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-border/30 mt-2">
        {/* Doa (Like) */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onDoa}
          className={`flex items-center gap-1.5 transition-all ${
            isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
          }`}
        >
          <Heart className={`w-[18px] h-[18px] transition-all ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-xs font-semibold">{post.doaCount.toLocaleString()}</span>
          <span className="text-[10px] opacity-70">Mendoakan</span>
        </motion.button>

        {/* Comments */}
        <button
          onClick={onToggleComments}
          className={`flex items-center gap-1.5 transition-colors ${
            isCommentsOpen ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <MessageCircle className="w-[18px] h-[18px]" />
          <span className="text-xs font-semibold">{post.commentCount}</span>
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
        >
          <Share2 className="w-[18px] h-[18px]" />
          <span className="text-xs font-semibold">{post.shareCount}</span>
        </button>

        {/* Save */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onSave}
          className={`transition-all ${
            isSaved ? 'text-primary' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          {isSaved ? (
            <BookmarkCheck className="w-[18px] h-[18px] fill-current" />
          ) : (
            <Bookmark className="w-[18px] h-[18px]" />
          )}
        </motion.button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/10 border-t border-border/30 px-4 py-3 space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs select-none shrink-0 mt-0.5">
                    {comment.userAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-background rounded-xl p-2.5 shadow-sm">
                      <p className="text-xs font-bold text-foreground">{comment.userName}</p>
                      <p className="text-xs text-foreground/80 mt-0.5 leading-relaxed">{comment.content}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 ml-1">{comment.timestamp}</p>
                  </div>
                </div>
              ))}

              {/* Comment Input */}
              <div className="flex items-center gap-2 pt-1">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs select-none shrink-0">
                  😊
                </div>
                <div className="flex-1 flex items-center gap-2 bg-background rounded-full border border-border/50 pl-3 pr-1 py-1">
                  <input
                    value={newComment}
                    onChange={(e) => onNewCommentChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSubmitComment()}
                    placeholder="Tulis komentar..."
                    className="flex-1 text-xs bg-transparent text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                  <button
                    onClick={onSubmitComment}
                    disabled={!newComment.trim()}
                    className="p-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
