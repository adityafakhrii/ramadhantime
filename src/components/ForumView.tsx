import { useState, useCallback } from 'react';
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
  ChevronLeft,
  HandHeart,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FORUM_POSTS, type ForumPost, type ForumComment } from '@/data/forum';
import { toast } from 'sonner';

const CATEGORY_LABELS: Record<ForumPost['category'], { label: string; color: string }> = {
  doa: { label: '🤲 Doa', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  status: { label: '✨ Status', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  sharing: { label: '📖 Sharing', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  tausiyah: { label: '🕌 Tausiyah', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400' },
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
    setShowCreatePost(false);
    toast('Berhasil diposting! 🎉');
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
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-background rounded-t-3xl w-full max-w-lg p-6 pb-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Buat Postingan</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 bg-muted/50 rounded-full text-muted-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category selector */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {(Object.entries(CATEGORY_LABELS) as [ForumPost['category'], { label: string; color: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setNewPostCategory(key)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      newPostCategory === key
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>

              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Tulis doa, status, atau sharing kamu..."
                className="w-full h-32 bg-muted/20 rounded-2xl p-4 text-foreground text-sm placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 border border-border/30"
              />

              <button
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className="w-full mt-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Posting
              </button>
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
