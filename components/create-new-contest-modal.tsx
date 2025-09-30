import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JSONContent } from '@tiptap/core';
import Novel from '@/components/ui/novel/novel';
import { Info } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

export const CreateNewContestModal = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        link: '',
        thumbnailUrl: '',
        payPerView: '',
        maxPayout: '',
        minViews: '100',
        submissionDeadline: '',
        requirements: '',
        targetPlatforms: ''
    });

    const [description, setDescription] = useState<JSONContent | null>(null);
    const [requirements, setRequirements] = useState<JSONContent | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>('');

    const [errors, setErrors] = useState({});

    // TanStack Query mutation for creating contest
    const createContestMutation = useMutation({
        mutationFn: async (data) => {
            // Replace with your actual API endpoint
            const response = await fetch('/api/contests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create contest');
            }

            return response.json();
        },
        onSuccess: (data) => {
            console.log('Contest created successfully:', data);
            // You can add success toast notification here
            onClose();
        },
        onError: (error) => {
            console.error('Error creating contest:', error);
            // You can add error toast notification here
        }
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setThumbnailPreview(previewUrl);

            // Convert to base64 or handle file upload
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('thumbnailUrl', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.type) newErrors.type = 'Contest type is required';
        if (!formData.link.trim()) newErrors.link = 'Link is required';
        if (!formData.payPerView || parseFloat(formData.payPerView) <= 0) {
            newErrors.payPerView = 'Pay per view must be greater than 0';
        }
        if (!formData.maxPayout || parseFloat(formData.maxPayout) <= 0) {
            newErrors.maxPayout = 'Max payout must be greater than 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const submitData = {
                ...formData,
                description,
                requirements
            };
            createContestMutation.mutate(submitData);
        }
    };

    return (
        <Card className="w-full mx-auto p-6 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Buat Kontes Baru</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 text-xl font-semibold"
                >
                    ×
                </button>
            </div>

            <div className="space-y-6 ">
                <div className="space-y-2">
                    <Label htmlFor="title">Judul *</Label>
                    <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="Masukkan judul kontes"
                        className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Deskripsi</Label>
                    <Novel content={description} setContent={(content) => setDescription(content)} placeholder="Deskripsikan kontesmu" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="requirements">Persyaratan</Label>
                    <Novel content={requirements} setContent={(content) => setRequirements(content)} placeholder="List any specific requirements for submissions" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div className="space-y-2">
                        <Label htmlFor="type">Jenis Kontes *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                            <SelectTrigger className={cn(errors.type ? 'border-red-500' : '',"w-full")}>
                                <SelectValue placeholder="Pilih jenis kontes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="photo">Photo</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="submissionDeadline">Deadline Pengumpulan</Label>
                        <Input
                            id="submissionDeadline"
                            type="datetime-local"
                            className="w-full"
                            value={formData.submissionDeadline}
                            onChange={(e) => handleChange('submissionDeadline', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetPlatforms">Platform Target</Label>
                        <Select value={formData.targetPlatforms} onValueChange={(value) => handleChange('targetPlatforms', value)}>
                            <SelectTrigger className={cn(errors.targetPlatforms ? 'border-red-500' : '',"w-full")}>
                                <SelectValue placeholder="Pilih platform target" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="youtube" disabled>Youtube Short <Badge>Coming Soon</Badge></SelectItem>
                                <SelectItem value="instagram" disabled>Instagram <Badge>Coming Soon</Badge></SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>

                <div className="space-y-2">
                    <Label htmlFor="link">Link Tambahan *</Label>
                    <Input
                        id="link"
                        type="url"
                        value={formData.link}
                        onChange={(e) => handleChange('link', e.target.value)}
                        placeholder="https://example.com/contest"
                        className={errors.link ? 'border-red-500' : ''}
                    />
                    {errors.link && <p className="text-red-500 text-sm">{errors.link}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">Thumbnail URL</Label>
                    {thumbnailPreview && (
                        <div className="relative w-full h-48 border rounded-md overflow-hidden">
                            <Image
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <Input
                        id="thumbnailUrl"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="payPerView">Bayar Per View * 
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="inline h-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Jumlah yang akan diterima clipper per 1000 views</p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            id="payPerView"
                            type="number"
                            step="1"
                            value={formData.payPerView}
                            onChange={(e) => handleChange('payPerView', e.target.value)}
                            placeholder="1000"
                            className={errors.payPerView ? 'border-red-500' : ''}
                        />
                        {errors.payPerView && <p className="text-red-500 text-sm">{errors.payPerView}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxPayout">Pembayaran Maksimal * 
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="inline h-4" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Jumlah Maksimal yang bisa didapatkan clipper</p>
                                </TooltipContent>
                            </Tooltip>
                        </Label>
                        <Input
                            id="maxPayout"
                            type="number"
                            step="0.01"
                            value={formData.maxPayout}
                            onChange={(e) => handleChange('maxPayout', e.target.value)}
                            placeholder="10000"
                            className={errors.maxPayout ? 'border-red-500' : ''}
                        />
                        {errors.maxPayout && <p className="text-red-500 text-sm">{errors.maxPayout}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="minViews">Minimum Views</Label>
                    <Input
                        id="minViews"
                        type="number"
                        value={formData.minViews}
                        onChange={(e) => handleChange('minViews', e.target.value)}
                        placeholder="100"
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        onClick={handleSubmit}
                        className="flex-1"
                        disabled={createContestMutation.isPending}
                    >
                        {createContestMutation.isPending ? 'Membuat...' : 'Buat Kontes'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={createContestMutation.isPending}
                    >
                        Batal
                    </Button>
                </div>
            </div>
        </Card>
    );
}