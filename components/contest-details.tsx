import { Card, CardContent } from "@/components/ui/card";
import { contests } from "@/drizzle/schema";
import { Badge } from "./ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

type Contest = typeof contests.$inferSelect;

export const ContestDetails = ({ contest }: { contest: Contest[] }) => {
    return (
        <>
            {contest && contest.length > 0 ? (
                contest.map((c) => (
                    <Card key={c.id} className="rounded-none">
                        <CardContent className="flex justify-between">
                            <div className="flex flex-col gap-5 w-full px-10">
                                <Badge className="text-xs">Clip</Badge>
                                <Link href={`/contests/${c.id}`} className="text-xl font-bold underline flex items-center gap-2">{c.title}<ArrowRight /></Link>
                                <div className="flex items-center gap-2 justify-start">
                                    <p className="text-2xl font-thin basis-1/2">Rp. {c.payPerView} / 1000 views</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-col items-center">
                                    <p className="">Rp. {c.payPerView} / 1000 views</p>
                                    <div className="flex items-center gap-2 w-full">
                                        <p>{c.status}</p>
                                        <Progress value={parseInt(c.currentPayout!) / 1000} />
                                    </div>
                                    <p>Deadline: {String(c.submissionDeadline)}</p>
                                    <Button className="w-40">Join</Button>
                                </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-center">Tidak ada sayembara</p>
            )}
        </>
    );
};
