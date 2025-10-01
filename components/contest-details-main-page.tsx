import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { contests } from "@/drizzle/schema";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
    Calendar,
    DollarSign,
    Eye,
    Target,
    Clock,
    FileText,
    Link as LinkIcon,
    Users,
    Trophy,
    ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { EditorContent, EditorRoot } from "novel";
import { renderToReactElement } from '@tiptap/static-renderer'
import { defaultExtensions } from "@/components/ui/novel/extension";

type Contest = typeof contests.$inferSelect;
type ContestStatus = 'draft' | 'active' | 'completed' | 'cancelled';

const getStatusColor = (status: ContestStatus) => {
    const colors = {
        draft: 'bg-gray-500 hover:bg-gray-600',
        active: 'bg-green-500 hover:bg-green-600',
        completed: 'bg-blue-500 hover:bg-blue-600',
        cancelled: 'bg-red-500 hover:bg-red-600'
    };
    return colors[status] || 'bg-gray-500';
};

export const ContestDetailsMainPage = ({ contest }: { contest: Contest }) => {
    const router = useRouter();

    if (!contest) {
        return (
            <Card className="w-full max-w-4xl mx-auto">
                <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">Contest not found</p>
                </CardContent>
            </Card>
        );
    }

    const progressPercentage = Math.min((parseInt(contest.currentPayout || '0') / parseInt(contest.maxPayout || '1')) * 100, 100);
    const remainingBudget = parseInt(contest.maxPayout || '0') - parseInt(contest.currentPayout || '0');
    const isActive = contest.status === 'active';
    const isCompleted = contest.status === 'completed';
    const isDraft = contest.status === 'draft';

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6 rounded-none">
            {/* Header Section */}
            <div className="relative">
                {contest.thumbnailUrl && (
                    <div className="w-full h-64 relative overflow-hidden rounded-none">
                        <Image
                            src={contest.thumbnailUrl}
                            alt={contest.title || 'Contest thumbnail'}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                            <div className="text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className={cn("text-xs px-2 py-1 capitalize", getStatusColor(contest.status as ContestStatus))}>
                                        {contest.status}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs px-2 py-1 text-white border-white">
                                        {contest.type}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
                                {contest.description && contest.description !== '' ? (
                                    <div>
                                        {renderToReactElement({
                                            content: JSON.parse(contest.description),
                                            extensions: [...defaultExtensions]
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {!contest.thumbnailUrl && (
                    <Card className="rounded-none">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className={cn("text-xs px-2 py-1 capitalize", getStatusColor(contest.status as ContestStatus))}>
                                    {contest.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs px-2 py-1">
                                    {contest.type}
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold mb-4">{contest.title}</h1>
                            {contest.description && contest.description !== '' ? (
                                <p className="text-lg text-muted-foreground">
                                    {renderToReactElement({
                                        content: JSON.parse(contest.description),
                                        extensions: [...defaultExtensions]
                                    })}
                                </p>
                            ) : null}
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contest Details */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Contest Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {contest.requirements && contest.requirements !== '' ? (
                                <div>
                                    <h4 className="font-medium mb-2">Requirements</h4>
                                    <div className="text-muted-foreground whitespace-pre-wrap ml-4">
                                        {renderToReactElement({ content: JSON.parse(contest.requirements), extensions: [...defaultExtensions] })}
                                    </div>
                                </div>
                            ) : null}

                            {contest.targetPlatforms && (
                                <div>
                                    <h4 className="font-medium mb-2">Target Platforms</h4>
                                    <p className="text-muted-foreground">{contest.targetPlatforms}</p>
                                </div>
                            )}

                            {contest.link && (
                                <div>
                                    <h4 className="font-medium mb-2">Reference Link</h4>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(contest.link, '_blank')}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                        View Reference
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div className="flex items-center gap-2">
                                    <Eye className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">Min. Views: {contest.minViews?.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        Created: {new Date(contest.createdAt || '').toLocaleDateString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Button */}
                    {isActive && (
                        <Card className="rounded-none">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">Ready to participate?</h3>
                                    <p className="text-muted-foreground mb-4">Submit your content and start earning!</p>
                                    <Button size="lg" className="w-full sm:w-auto">
                                        <Trophy className="w-4 h-4 mr-2" />
                                        Submit Entry
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Budget & Progress */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Budget & Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">Pay per 1000 views</span>
                                    <span className="font-semibold">
                                        Rp {parseInt(contest.payPerView || '0').toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-muted-foreground">Total Budget</span>
                                    <span className="font-semibold">
                                        Rp {parseInt(contest.maxPayout || '0').toLocaleString('id-ID')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm text-muted-foreground">Used Budget</span>
                                    <span className="font-semibold">
                                        Rp {parseInt(contest.currentPayout || '0').toLocaleString('id-ID')}
                                    </span>
                                </div>

                                <Progress value={progressPercentage} className="h-2 mb-2" />

                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">
                                        {progressPercentage.toFixed(1)}% used
                                    </span>
                                    <span className="text-xs text-green-600 font-medium">
                                        Rp {remainingBudget.toLocaleString('id-ID')} remaining
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">Created</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(contest.createdAt || '').toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {contest.submissionDeadline && (
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${new Date(contest.submissionDeadline) > new Date() ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                    <div>
                                        <p className="text-sm font-medium">Submission Deadline</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(contest.submissionDeadline).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {new Date(contest.submissionDeadline) < new Date() && (
                                            <Badge variant="destructive" className="text-xs mt-1">
                                                Expired
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-muted rounded-full"></div>
                                <div>
                                    <p className="text-sm font-medium">Last Updated</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(contest.updatedAt || '').toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contest Stats */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                Contest Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge className={cn("text-xs capitalize", getStatusColor(contest.status as ContestStatus))}>
                                    {contest.status}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Type</span>
                                <Badge variant="outline" className="text-xs capitalize">
                                    {contest.type}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Contest ID</span>
                                <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                    {contest.id}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};