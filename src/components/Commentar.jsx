import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase-comment';
import {
  MessageCircle,
  UserCircle2,
  Loader2,
  AlertCircle,
  Send,
  ImagePlus,
  X,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Comment = memo(({ comment, formatDate }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5">
    <div className="flex flex-col items-start">
      <div className="mb-3">
        {comment.imageURL ? (
          <img
            src={comment.imageURL}
            alt={`${comment.userName}'s profile`}
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500" // Reduced size
          />
        ) : (
          <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
            <UserCircle2 className="w-6 h-6" />
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="mb-1">
          <h4 className="font-semibold text-white text-base">
            {comment.userName}
          </h4>
          {comment.profession && (
            <span className="text-xs text-gray-400">
              {comment.profession}
            </span>
          )}
        </div>
        <div className="mb-1">
          <span className="text-xs text-gray-400">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <p className="text-gray-300 text-sm break-words leading-relaxed">
          {comment.content}
        </p>
      </div>
    </div>
  </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [profession, setProfession] = useState('');
  const [imageURL, setImageURL] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const textareaRef = useRef(null);
  const widgetRef = useRef(null);

  // Initialize Cloudinary widget for uploading profile pictures.
  useEffect(() => {
    const initializeCloudinary = () => {
      if (window.cloudinary) {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: 'det8n0pcv',
            uploadPreset: 'portfolio',
            cropping: 'server',
            croppingCoordinatesMode: 'custom',
            croppingAspectRatio: 1,
            showSkipCropButton: false,
            multiple: false,
            sources: ['local'],
            maxFileSize: 5000000,
          },
          (error, result) => {
            if (error) {
              console.error('Upload error:', error);
              setUploadingImage(false);
              return;
            }
            if (result) {
              if (result.event === 'success') {
                setImageURL(result.info.secure_url);
                setUploadingImage(false);
              } else if (result.event === 'close') {
                setUploadingImage(false);
              }
            }
          }
        );
      }
    };

    if (!window.cloudinary) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      script.onload = initializeCloudinary;
      document.body.appendChild(script);
    } else {
      initializeCloudinary();
    }
  }, []);

  const handleTextareaChange = useCallback((e) => {
    setNewComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newComment.trim() || !userName.trim()) return;
      onSubmit({ newComment, userName, profession, imageURL });
      setNewComment('');
      setUserName('');
      setProfession('');
      setImageURL(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    },
    [newComment, userName, profession, imageURL, onSubmit]
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
        <label className="block text-base font-medium text-white">
          Name <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-base"
          required
        />
      </div>

      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
        <label className="block text-base font-medium text-white">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          ref={textareaRef}
          value={newComment}
          onChange={handleTextareaChange}
          placeholder="Write your message here..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none min-h-[120px] text-base"
          required
        />
      </div>

      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
        <label className="block text-base font-medium text-white">
          Profession <span className="text-gray-400">(optional)</span>
        </label>
        <input
          type="text"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          placeholder="Your role or job title"
          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-base"
        />
      </div>

      <div className="space-y-2" data-aos="fade-up" data-aos-duration="1600">
        <label className="block text-base font-medium text-white">
          Profile Picture <span className="text-gray-400">(optional)</span>
        </label>
        <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
          {imageURL ? (
            <div className="flex items-center gap-4 w-full">
              <div className="relative">
                <img
                  src={imageURL}
                  alt="Profile Preview"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                />
                <button
                  type="button"
                  onClick={() => setImageURL(null)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setUploadingImage(true);
                widgetRef.current?.open();
              }}
              disabled={uploadingImage}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-all border border-dashed border-indigo-500/50 hover:border-indigo-500 group disabled:opacity-50"
            >
              {uploadingImage ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Upload Profile Picture</span>
                </>
              )}
            </button>
          )}
        </div>
        <p className="text-center text-gray-400 text-base mt-2">
          Max file size: 5MB (JPEG, PNG, WebP)
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        data-aos="fade-up"
        data-aos-duration="1000"
        className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed text-base"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
        <div className="relative flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Post Comment</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
});

const Komentar = () => {
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    AOS.init({ once: false, duration: 1000 });
  }, []);

  useEffect(() => {
    const commentsRef = collection(db, 'portfolio-comments');
    const q = query(commentsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });
  }, []);

  const handleCommentSubmit = useCallback(
    async ({ newComment, userName, profession, imageURL }) => {
      setError('');
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, 'portfolio-comments'), {
          content: newComment,
          userName,
          profession: profession.trim() || null,
          imageURL: imageURL || null,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        setError('Failed to post comment. Please try again.');
        console.error('Error adding comment: ', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }, []);

  return (
    <div
      className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl"
      data-aos="fade-up"
    >
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20">
            <MessageCircle className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-semibold text-white">
            Comments <span className="text-indigo-400">({comments.length})</span>
          </h3>
        </div>
      </div>
      <div className="p-8 space-y-8">
        {error && (
          <div className="flex items-center gap-3 p-5 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="text-lg">{error}</p>
          </div>
        )}

        <div>
          <CommentForm
            onSubmit={handleCommentSubmit}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>

        <div className="space-y-6 h-[400px] overflow-y-auto custom-scrollbar">
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <UserCircle2 className="w-16 h-16 text-indigo-400 mx-auto mb-4 opacity-50" />
              <p className="text-lg sm:text-xl text-gray-400">
                No comments yet. Start the conversation!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <Comment key={comment.id} comment={comment} formatDate={formatDate} />
            ))
          )}
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.6);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.8);
        }
      `}</style>
    </div>
  );
};

export default Komentar;

