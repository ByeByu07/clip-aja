import { Card, CardContent } from "@/components/ui/card";
import { contests } from "@/drizzle/schema";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Calendar,
    DollarSign,
    Eye,
    Clock,
    Users
} from "lucide-react";
import Image from "next/image";
import { renderToReactElement } from "@tiptap/static-renderer";
import { defaultExtensions } from "./ui/novel/extension";

type Contest = typeof contests.$inferSelect;
type ContestStatus = 'draft' | 'active' | 'completed' | 'cancelled';

const getStatusColor = (status: ContestStatus) => {
    const colors = {
        draft: 'bg-gray-500',
        active: 'bg-green-500',
        completed: 'bg-blue-500',
        cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
};

const getStatusText = (status: ContestStatus) => {
    const statusText = {
        draft: 'Draft',
        active: 'Active',
        completed: 'Completed',
        cancelled: 'Cancelled'
    };
    return statusText[status] || status;
};

export const ContestListMainPage = ({ contests }: { contests: Contest[] }) => {
    if (!contests || contests.length === 0) {
        return (
            <Card className="w-full">
                <CardContent className="p-8 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">No Contests Available</p>
                    <p className="text-sm text-muted-foreground">Check back later for new contests</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {contests.map((contest) => {
                const progressPercentage = Math.min((parseInt(contest.currentPayout || '0') / parseInt(contest.maxPayout || '1')) * 100, 100);
                const remainingBudget = parseInt(contest.maxPayout || '0') - parseInt(contest.currentPayout || '0');
                const isDeadlineExpired = contest.submissionDeadline ? new Date(contest.submissionDeadline) < new Date() : false;
                const daysUntilDeadline = contest.submissionDeadline
                    ? Math.ceil((new Date(contest.submissionDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    : null;

                return (
                    <Card
                        key={contest.id}
                        className="w-full hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    >
                        <CardContent className="p-0">
                            <Link href={`/contests/${contest.id}`} className="block">
                                <div className="flex flex-col sm:flex-row">
                                    {/* Thumbnail */}
                                    <div className="w-full sm:w-48 h-32 sm:h-auto relative overflow-hidden">
                                        {contest.thumbnailUrl ? (
                                            <Image
                                                src={contest.thumbnailUrl}
                                                alt={contest.title || 'Contest thumbnail'}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-200"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Eye className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        {/* Status badge overlay */}
                                        {/* <div className="absolute top-2 left-2">
                                            <Badge className={cn("text-xs px-2 py-1 capitalize text-white", getStatusColor(contest.status as ContestStatus))}>
                                                {getStatusText(contest.status as ContestStatus)}
                                            </Badge>
                                        </div> */}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-4 sm:p-6">
                                        <div className="flex flex-col h-full">
                                            {/* Header */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="outline" className="text-xs px-2 py-1 capitalize">
                                                        {contest.type}
                                                    </Badge>
                                                    {contest.status === 'active' && (
                                                        <Badge variant="outline" className="text-xs px-2 py-1 text-green-600 border-green-600">
                                                            Open for Submissions
                                                        </Badge>
                                                    )}
                                                </div>

                                                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                    {contest.title}
                                                </h3>

                                                {contest.description && (
                                                    <div className="text-muted-foreground text-sm mb-3 line-clamp-2">
                                                        {renderToReactElement({ content: JSON.parse(contest.description), extensions: [...defaultExtensions]})}
                                                    </div>
                                                )}

                                                {/* Key Info Grid */}
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                                                        <div className="text-sm">
                                                            <p className="font-medium">Rp {parseInt(contest.payPerView || '0').toLocaleString('id-ID')}</p>
                                                            <p className="text-xs text-muted-foreground">per 1000 views</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                                        <div className="text-sm">
                                                            <p className="font-medium">{contest.minViews?.toLocaleString('id-ID') || '100'}</p>
                                                            <p className="text-xs text-muted-foreground">min views</p>
                                                        </div>
                                                    </div>

                                                    {contest.submissionDeadline && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                                            <div className="text-sm">
                                                                <p className={`font-medium ${isDeadlineExpired ? 'text-red-600' : ''}`}>
                                                                    {new Date(contest.submissionDeadline).toLocaleDateString('id-ID', {
                                                                        day: 'numeric',
                                                                        month: 'short'
                                                                    })}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {isDeadlineExpired
                                                                        ? 'Expired'
                                                                        : daysUntilDeadline !== null && daysUntilDeadline > 0
                                                                            ? `${daysUntilDeadline} days left`
                                                                            : 'Today'
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                                        <div className="text-sm">
                                                            <p className="font-medium">
                                                                {new Date(contest.createdAt || '').toLocaleDateString('id-ID', {
                                                                    day: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">created</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Budget Progress */}
                                            <div className="space-y-2 pt-3 border-t">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">Budget Progress</span>
                                                    <span className="text-sm font-medium">
                                                        {progressPercentage.toFixed(1)}% used
                                                    </span>
                                                </div>
                                                <Progress value={progressPercentage} className="h-2" />
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-muted-foreground">
                                                        Rp {parseInt(contest.currentPayout || '0').toLocaleString('id-ID')} used
                                                    </span>
                                                    <span className="text-green-600 font-medium">
                                                        Rp {remainingBudget.toLocaleString('id-ID')} remaining
                                                    </span>
                                                </div>
                                            </div>

                                            {/* View More Indicator */}
                                            <div className="flex items-center justify-end mt-3 text-primary group-hover:text-primary/80">
                                                <span className="text-sm font-medium mr-1">View Details</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};