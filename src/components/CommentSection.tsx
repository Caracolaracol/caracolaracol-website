import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Rate limiting settings
const RATE_LIMIT = {
  maxAttempts: 3,       // Maximum number of comment submissions
  windowMs: 60 * 1000,  // Time window (1 minute)
  cooldownMs: 3 * 60 * 1000 // Cooldown period (3 minutes)
};

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  postSlug: string;
}

// Function to get a rate limiting key for localStorage
const getRateLimitKey = (postSlug: string) => `comment_ratelimit_${postSlug}`;

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ name: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rateLimited, setRateLimited] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // Check rate limiting on component mount
  useEffect(() => {
    checkRateLimit();
    const interval = setInterval(checkRateLimit, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Function to check if user is rate limited
  const checkRateLimit = () => {
    const rateLimitKey = getRateLimitKey(postSlug);
    const rateLimitData = localStorage.getItem(rateLimitKey);
    
    if (rateLimitData) {
      const { attempts, timestamp, blockedUntil } = JSON.parse(rateLimitData);
      
      // If we're in a cooldown period
      if (blockedUntil) {
        const now = Date.now();
        if (now < blockedUntil) {
          setRateLimited(true);
          setTimeRemaining(Math.ceil((blockedUntil - now) / 1000));
        } else {
          // Cooldown expired
          localStorage.removeItem(rateLimitKey);
          setRateLimited(false);
        }
      } else {
        // Check if attempts should be reset (window expired)
        const now = Date.now();
        if (now - timestamp > RATE_LIMIT.windowMs) {
          localStorage.removeItem(rateLimitKey);
        }
      }
    }
  };
  
  // Update rate limit tracking
  const updateRateLimit = () => {
    const rateLimitKey = getRateLimitKey(postSlug);
    const now = Date.now();
    let rateData:{attempts:number, timestamp:number, blockedUntil?:number} = { attempts: 1, timestamp: now };
    
    const existing = localStorage.getItem(rateLimitKey);
    if (existing) {
      const parsed = JSON.parse(existing);
      
      // If within the time window, increment attempts
      if (now - parsed.timestamp < RATE_LIMIT.windowMs) {
        rateData = {
          attempts: parsed.attempts + 1,
          timestamp: parsed.timestamp
        };
        
        // Check if over the limit
        if (rateData.attempts > RATE_LIMIT.maxAttempts) {
          rateData = {
            ...rateData,
            blockedUntil: now + RATE_LIMIT.cooldownMs
          };
          setRateLimited(true);
          setTimeRemaining(Math.ceil(RATE_LIMIT.cooldownMs / 1000));
        }
      }
    }
    
    localStorage.setItem(rateLimitKey, JSON.stringify(rateData));
  };
  
  // Fetch comments for this post
  useEffect(() => {
    async function fetchComments() {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }
      
      setComments(data || []);
    }
    
    fetchComments();
  }, [postSlug]);
  
  // Submit a new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting first
    if (rateLimited) {
      setError(`Please wait ${timeRemaining} seconds before posting another comment.`);
      return;
    }
    
    if (!newComment.name.trim() || !newComment.content.trim()) {
      setError('Please fill out all fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Update rate limit tracking
      updateRateLimit();
      
      // Check if we got rate limited
      if (rateLimited) {
        setError(`You've made too many comments. Please wait ${timeRemaining} seconds before trying again.`);
        return;
      }
      console.log('fdsg')
      const { error } = await supabase
        .from('blog_comments')
        .insert([
          {
            post_slug: postSlug,
            author_name: newComment.name,
            content: newComment.content,
          }
        ]);
        
      if (error) throw error;
      
      // Success! Clear the form and show success message
      setNewComment({ name: '', content: '' });
      setSuccess('Comment submitted successfully! It will appear after moderation.');
      
      // Optionally, if you're not using moderation:
      // Refetch comments to show the new one
      const { data } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: false });
        
      setComments(data || []);
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      setError('Error submitting your comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-12 pt-8 border-t  border-t-snow/15 ">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {/* Comment submission form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={newComment.name}
            onChange={(e) => setNewComment({...newComment, name: e.target.value})}
            className="w-full px-3 py-2 border border-snow/15 rounded-md focus:outline-none focus:ring-2 focus:ring-violetl"
            required
            disabled={rateLimited}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={newComment.content}
            onChange={(e) => setNewComment({...newComment, content: e.target.value})}
            className="w-full px-3 py-2 border border-snow/15 rounded-md focus:outline-none focus:ring-2 focus:ring-violetl"
            required
            disabled={rateLimited}
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || rateLimited}
          className="bg-violetl text-white py-2 px-4 hover:text-ocre rounded-md hover:bg-violetl/80 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : rateLimited ? `Wait ${timeRemaining}s` : 'Submit Comment'}
        </button>
        
        {error && (
          <div className="mt-3 text-red-600 text-sm">{error}</div>
        )}
        
        {success && (
          <div className="mt-3 text-green-600 text-sm">{success}</div>
        )}
        
        {rateLimited && !error && (
          <div className="mt-3 text-amber-600 text-sm">
            You've reached the comment limit. Please wait {timeRemaining} seconds before posting again.
          </div>
        )}
      </form>
      
      {/* Comments display */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold">{comment.author_name}</h3>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}