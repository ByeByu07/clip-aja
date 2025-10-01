"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Eye,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

type PostStatus = 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'published' | 'claimed';
type ClaimStatus = 'pending' | 'approved' | 'rejected';

interface Post {
  id: string;
  url: string;
  status: PostStatus;
  claimStatus: ClaimStatus;
  views: number;
  calculatedAmount: string;
  paidAmount: string;
  submittedAt: Date;
  publishedAt: Date | null;
  lastViewCheck: Date | null;
  createdAt: Date;
  contestId: string;
  contestTitle: string;
  contestPayPerView: string;
  contestStatus: string;
}

const getStatusColor = (status: PostStatus) => {
  const colors = {
    submitted: 'bg-yellow-500',
    reviewing: 'bg-blue-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    published: 'bg-green-500',
    claimed: 'bg-purple-500'
  };
  return colors[status] || 'bg-gray-500';
};

const getClaimStatusColor = (status: ClaimStatus) => {
  const colors = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500'
  };
  return colors[status] || 'bg-gray-500';
};

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const result = await response.json();
          setPosts(result.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="@container/main flex flex-1 flex-col gap-2 px-4">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2 px-4">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-semibold">Posts Saya</p>
            <p className="text-muted-foreground">
              Daftar konten yang telah kamu submit ke berbagai contest.
            </p>
          </div>

          <div className="space-y-2">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <Card
                  key={post.id}
                  className="rounded-none hover:-translate-y-0.5 transition-all duration-200 border-l-2 border-l-primary/20"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left - Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={cn("text-xs h-5 px-2 capitalize rounded-none", getStatusColor(post.status))}>
                            {post.status}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs h-5 px-2 rounded-none", getClaimStatusColor(post.claimStatus))}>
                            Claim: {post.claimStatus}
                          </Badge>
                        </div>

                        <Link
                          href={`/contests/${post.contestId}`}
                          className="inline-flex items-center gap-1 text-base font-semibold hover:underline mb-1"
                        >
                          {post.contestTitle}
                        </Link>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Video TikTok
                          </a>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views?.toLocaleString('id-ID') || 0} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.submittedAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Right - Earnings Info */}
                      <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-1 text-sm text-muted-foreground">
                          {/* <DollarSign className="w-3 h-3" /> */}
                          <span className="text-xs">Rp {post.contestPayPerView} / 1000 views</span>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          Rp {parseInt(post.calculatedAmount || '0').toLocaleString('id-ID')}
                        </p>
                        {parseInt(post.paidAmount || '0') > 0 && (
                          <div className="flex items-center justify-end gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Rp {parseInt(post.paidAmount).toLocaleString('id-ID')} terbayar
                          </div>
                        )}
                        {post.lastViewCheck && (
                          <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            Update: {new Date(post.lastViewCheck).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="rounded-none">
                <CardContent className="p-12 text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-semibold mb-2">Belum ada post</p>
                  <p className="text-muted-foreground mb-4">
                    Kamu belum submit konten ke contest manapun.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/clipper/contests">
                      Cari Contest
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
