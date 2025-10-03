import { Card, CardContent } from "@/components/ui/card";
import { contests } from "@/drizzle/schema";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
    ArrowRight,
    Calendar,
    MoreVertical,
    Edit,
    Trash2,
    DollarSign,
    Play,
    Eye,
    Copy,
    CheckCircle,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export const ContestDetails = ({ contest }: { contest: Contest[] }) => {

    console.log(contest)

    const router = useRouter();
    const [selectedContest, setSelectedContest] = useState<string | null>(null);
    const [loadingAction, setLoadingAction] = useState<{ contestId: string; action: string } | null>(null);

    const handleAction = async (action: string, contestId: string) => {
        switch (action) {
            case 'edit':
                router.push(`/contests/${contestId}/edit`);
                break;
            case 'view':
                router.push(`/contests/${contestId}`);
                break;
            case 'activate':
                try {
                    setLoadingAction({ contestId, action });
                    const response = await fetch(`/api/contests/${contestId}/actions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ action }),
                    });

                    if (response.ok) {
                        const result = await response.json();

                        // If payment link is returned, redirect to Midtrans
                        if (result.data?.paymentUrl) {
                            window.location.href = result.data.paymentUrl;
                        } else {
                            // Fallback if no payment URL
                            window.location.replace(`/contests/${contestId}`);
                        }
                    } else {
                        const error = await response.json();
                        setLoadingAction(null);
                        alert(error.message || 'Action failed');
                    }
                } catch (error) {
                    setLoadingAction(null);
                    alert('Network error occurred');
                    console.error('Action error:', error);
                }
                break;
            case 'duplicate':
            case 'complete':
                try {
                    const response = await fetch(`/api/contests/${contestId}/actions`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ action }),
                    });

                    if (response.ok) {
                        window.location.replace(`/contests/${contestId}`);
                    } else {
                        const error = await response.json();
                        alert(error.message || 'Action failed');
                    }
                } catch (error) {
                    alert('Network error occurred');
                    console.error('Action error:', error);
                }
                break;
            case 'delete':
                if (confirm('Are you sure you want to delete this contest?')) {
                    try {
                        const response = await fetch(`/api/contests/${contestId}/actions`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ action }),
                        });

                        if (response.ok) {
                            window.location.reload();
                        } else {
                            const error = await response.json();
                            alert(error.message || 'Delete failed');
                        }
                    } catch (error) {
                        alert('Network error occurred');
                        console.error('Delete error:', error);
                    }
                }
                break;
            case 'pay':
                console.log('Process payment for contest:', contestId);
                break;
            default:
                break;
        }
    };

    const getAvailableActions = (status: ContestStatus) => {
        const commonActions = [
            { label: 'View Details', icon: Eye, action: 'view' },
            // { label: 'Edit Contest', icon: Edit, action: 'edit' },
            // { label: 'Duplicate', icon: Copy, action: 'duplicate' },
        ];

        const statusSpecificActions: Record<ContestStatus, any[]> = {
            draft: [
                ...commonActions,
                // { label: 'Edit Contest', icon: Edit, action: 'edit' },
                { label: 'Activate', icon: Play, action: 'activate', variant: 'default' },
                { separator: true },
                { label: 'Delete', icon: Trash2, action: 'delete', variant: 'destructive' },
            ],
            active: [
                ...commonActions,
                { label: 'Mark Complete', icon: CheckCircle, action: 'complete', variant: 'default' },
            ],
            completed: [
                ...commonActions,
            ],
            cancelled: [
                ...commonActions,
            ],
        };

        return statusSpecificActions[status] || commonActions;
    };

    return (
        <div className="space-y-2">
            {contest && contest.length > 0 ? (
                contest.map((c) => {
                    const actions = getAvailableActions(c.status as ContestStatus);

                    return (<Card
                        key={c.id}
                        className="rounded-none hover:-translate-y-0.5 transition-all duration-200 border-l-2 border-l-primary/20"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                                {/* Left - Main Info */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={cn("text-xs h-5 px-2 capitalize rounded-none", getStatusColor(c.status as ContestStatus))}>
                                            {c.status}
                                        </Badge>
                                        <div className="text-xs h-5 px-2">--</div>
                                        <Badge variant="outline" className="text-xs h-5 px-2 rounded-none">Clip</Badge>
                                    </div>
                                    <Link
                                        href={`/contests/${c.id}`}
                                        className="inline-flex items-center gap-1 text-base font-semibold"
                                    >
                                        {c.title}
                                        {/* <ArrowRight className="w-3 h-3" /> */}
                                    </Link>
                                    <Link
                                        href={`/dashboard/owner/review-posts?contestId=${c.id}`}
                                        className="inline-flex items-center gap-1 text-base font-semibold underline"
                                    >
                                        Review submission
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>

                                {/* Right - Progress & Action */}
                                <div className="flex items-center gap-3">
                                    <div className="w-fit space-y-1">
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Rp. {c.payPerView?.toLocaleString('id-ID')} / 1000 views
                                        </p>
                                        <Progress value={((parseFloat(c.currentPayout || '0') / parseFloat(c.maxPayout || '1')) * 100) || 0} className="h-1.5" />
                                        <p className="text-xs text-muted-foreground">
                                            {(((parseFloat(c.currentPayout || '0') / parseFloat(c.maxPayout || '1')) * 100) || 0).toFixed(0)}% • {new Date(c.submissionDeadline!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-none ml-auto sm:ml-0"
                                                disabled={loadingAction?.contestId === c.id}
                                            >
                                                <span className="sr-only">Open menu</span>
                                                {loadingAction?.contestId === c.id ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <MoreVertical className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            {actions.map((item, index) => {
                                                if (item.separator) {
                                                    return <DropdownMenuSeparator key={`sep-${index}`} />;
                                                }

                                                const Icon = item.icon;
                                                return (
                                                    <DropdownMenuItem
                                                        key={item.action}
                                                        onClick={() => handleAction(item.action, c.id)}
                                                        className={cn(
                                                            "cursor-pointer",
                                                            item.variant === 'destructive' && "text-red-600 focus:text-red-600",
                                                            item.variant === 'success' && "text-green-600 focus:text-green-600",
                                                            item.variant === 'warning' && "text-yellow-600 focus:text-yellow-600"
                                                        )}
                                                    >
                                                        <Icon className="mr-2 h-4 w-4" />
                                                        <span>{item.label}</span>
                                                    </DropdownMenuItem>
                                                );
                                            })}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>)
                })
            ) : (
                <Card className="rounded-none">
                    <CardContent className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">Tidak ada sayembara</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};