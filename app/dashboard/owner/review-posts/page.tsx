"use client"

import { Card } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState, useEffect, useRef, Suspense } from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/use-mobile";
import { Check, XIcon, Loader2 } from "lucide-react";

interface PostData {
    postId: string;
    postUrl: string;
    postStatus: string;
    postViews: number;
    postCalculatedAmount: string;
    postSubmittedAt: string;
    postPublishedAt: string;
    clipperName: string;
    clipperUsername: string;
    clipperLevel: number;
}

interface ContestData {
    id: string;
    title: string;
    status: string;
    payPerView: string;
    maxPayout: string;
    currentPayout: string;
    remainingPayout: string;
}

interface ReviewData {
    posts: PostData[];
    contest: ContestData;
    totalPendingReview: number;
}

function ReviewPostsContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contestId = searchParams.get('contestId');
    const [tutorialOpen, setTutorialOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewData, setReviewData] = useState<ReviewData | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const isMobile = useIsMobile();

    const cardRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);
    const currentX = useRef(0);
    const isDragging = useRef(false);

    // Check if user has seen the tutorial
    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('reviewTutorialSeen');
        if (!hasSeenTutorial) {
            setTutorialOpen(true);
        }
    }, []);

    const handleTutorialClose = (open: boolean) => {
        setTutorialOpen(open);
        if (!open) {
            localStorage.setItem('reviewTutorialSeen', 'true');
        }
    };

    // Fetch review posts
    useEffect(() => {
        if (!contestId) {
            router.push('/dashboard/owner');
            return;
        }

        const fetchReviewPosts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/posts/review?contestId=${contestId}&limit=50`);
                const data = await response.json();

                if (data.status === 'success') {
                    setReviewData(data.data);
                } else {
                    console.error('Failed to fetch review posts:', data.message);
                }
            } catch (error) {
                console.error('Error fetching review posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviewPosts();
    }, [contestId, router]);

    // Handle swipe/review action
    const handleReview = async (action: 'approve' | 'reject') => {
        if (!reviewData || currentIndex >= reviewData.posts.length || isProcessing) return;

        const currentPost = reviewData.posts[currentIndex];
        setIsProcessing(true);

        try {
            const response = await fetch('/api/posts/review', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: currentPost.postId,
                    action: action,
                    rejectionReason: action === 'reject' ? 'Rejected by owner' : undefined
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                setSwipeDirection(action === 'approve' ? 'right' : 'left');
                setTimeout(() => {
                    setCurrentIndex(prev => prev + 1);
                    setSwipeDirection(null);
                }, 300);
            } else {
                console.error('Failed to review post:', data.message);
                alert(`Failed to ${action} post: ${data.message}`);
            }
        } catch (error) {
            console.error('Error reviewing post:', error);
            alert(`Error reviewing post`);
        } finally {
            setIsProcessing(false);
        }
    };

    // Touch/Mouse handlers for swipe
    const handleStart = (clientX: number) => {
        isDragging.current = true;
        startX.current = clientX;
    };

    const handleMove = (clientX: number) => {
        if (!isDragging.current || !cardRef.current) return;

        currentX.current = clientX - startX.current;
        cardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${currentX.current * 0.1}deg)`;
    };

    const handleEnd = () => {
        if (!isDragging.current || !cardRef.current) return;
        isDragging.current = false;

        const threshold = 100;

        if (currentX.current > threshold) {
            handleReview('approve');
        } else if (currentX.current < -threshold) {
            handleReview('reject');
        }

        cardRef.current.style.transform = '';
        currentX.current = 0;
    };

    const extractVideoId = (url: string): string | null => {
        const match = url.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (!reviewData || reviewData.posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <p className="text-xl">No posts to review</p>
                <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    const currentPost = reviewData.posts[currentIndex];
    const remainingPosts = reviewData.posts.length - currentIndex;

    if (!currentPost) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <Check className="w-16 h-16 text-green-500" />
                <p className="text-xl">All posts reviewed!</p>
                <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
            </div>
        );
    }

    const videoId = extractVideoId(currentPost.postUrl);

    return (
        <div className="relative flex flex-col w-full h-screen justify-center items-center overflow-hidden bg-black">
            <Drawer>
                <DrawerTrigger>
                    <div className="absolute top-4 right-4 z-50">
                        <span className="bg-white text-black shadow-lg px-5 py-2 rounded-lg border border-gray-500 flex items-center justify-center cursor-pointer">
                            Menu
                        </span>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Review Submission - {reviewData.contest.title}</DrawerTitle>
                        <DrawerDescription>Review submission yang telah di kirim oleh Clipper</DrawerDescription>
                    </DrawerHeader>
                    <div className="px-4 py-2 space-y-4">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-2">Contest Info</h3>
                            <div className="space-y-1 text-sm">
                                <p><strong>Status:</strong> {reviewData.contest.status}</p>
                                <p><strong>Pay per 1000 views:</strong> Rp {parseInt(reviewData.contest.payPerView).toLocaleString()}</p>
                                <p><strong>Max Payout:</strong> Rp {parseInt(reviewData.contest.maxPayout).toLocaleString()}</p>
                                <p><strong>Current Payout:</strong> Rp {parseInt(reviewData.contest.currentPayout).toLocaleString()}</p>
                                <p className="text-green-600"><strong>Remaining Payout:</strong> Rp {parseInt(reviewData.contest.remainingPayout).toLocaleString()}</p>
                            </div>
                        </Card>
                        <Card className="p-4 text-center">
                            <p className="text-lg font-semibold">{remainingPosts} submission(s) to review</p>
                        </Card>
                    </div>
                    <DrawerFooter>
                        <Button onClick={() => router.push('/dashboard')}>Ke Beranda</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Dialog open={tutorialOpen} onOpenChange={handleTutorialClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tutorial Review Submission</DialogTitle>
                        <DialogDescription>
                            <div className="flex flex-col items-center gap-4 my-6">
                                <div className="flex justify-center items-center gap-8" role="group" aria-label="Swipe gesture demonstrations">
                                    <div className="text-center flex flex-col justify-center items-center">
                                        <Image src="/gifs/swipe-left.gif" className="w-16" alt="Swipe left gesture" width={64} height={64} />
                                        <p className="text-sm mt-2">{isMobile ? 'Geser ke kiri' : 'Tekan tombol kiri'}</p>
                                        <p className="text-sm mt-2 text-red-500 flex items-center gap-1"><XIcon className="w-4 h-4" /> Tolak</p>
                                    </div>
                                    <div className="text-center flex flex-col justify-center items-center">
                                        <Image src="/gifs/swipe-right.gif" className="w-16" alt="Swipe right gesture" width={64} height={64} />
                                        <p className="text-sm mt-2">{isMobile ? 'Geser ke kanan' : 'Tekan tombol kanan'}</p>
                                        <p className="text-sm mt-2 text-green-500 flex items-center gap-1"><Check className="w-4 h-4" /> Terima</p>
                                    </div>
                                </div>
                                {!isMobile && (
                                    <Card className="p-3 text-center w-full">
                                        <p className="text-sm">Disarankan memakai handphone untuk review submission yang lebih mudah</p>
                                    </Card>
                                )}
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <Button onClick={() => handleTutorialClose(false)}>Mengerti</Button>
                </DialogContent>
            </Dialog>

            {/* Swipe Card */}
            <div
                ref={cardRef}
                className={`relative w-full h-full transition-transform duration-300 ${
                    swipeDirection === 'left' ? 'translate-x-[-200%] opacity-0' :
                    swipeDirection === 'right' ? 'translate-x-[200%] opacity-0' : ''
                }`}
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX)}
                onTouchEnd={handleEnd}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
            >
                {videoId ? (
                    <iframe
                        className="size-full"
                        src={`https://www.tiktok.com/player/v1/${videoId}?music_info=0&loop=1&rel=0&native_context_menu=0&closed_caption=1&description=1&autoplay=1&timestamp=1&audio=1`}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-white">Invalid video URL</p>
                    </div>
                )}

                {/* Post info overlay */}
                <div className="absolute bottom-20 left-4 right-4 bg-black/70 text-white p-4 rounded-lg">
                    <p className="font-semibold">@{currentPost.clipperUsername || currentPost.clipperName}</p>
                    <p className="text-sm">Views: {currentPost.postViews.toLocaleString()}</p>
                    <p className="text-sm">Payout: Rp {parseInt(currentPost.postCalculatedAmount).toLocaleString()}</p>
                    <p className="text-xs text-gray-300">Level {currentPost.clipperLevel} Clipper</p>
                </div>
            </div>

            {/* Action Buttons - Desktop */}
            {!isMobile && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 z-40">
                    <Button
                        variant="destructive"
                        size="lg"
                        onClick={() => handleReview('reject')}
                        disabled={isProcessing}
                        className="w-16 h-16 rounded-full"
                    >
                        <XIcon className="w-8 h-8" />
                    </Button>
                    <Button
                        variant="default"
                        size="lg"
                        onClick={() => handleReview('approve')}
                        disabled={isProcessing}
                        className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700"
                    >
                        <Check className="w-8 h-8" />
                    </Button>
                </div>
            )}

            {/* Loading overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                </div>
            )}
        </div>
    );
}

export default function ReviewPostsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        }>
            <ReviewPostsContent />
        </Suspense>
    );
}