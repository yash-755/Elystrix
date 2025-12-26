"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CertificateRendererProps } from "./CertificateRenderer";
import { CertificatePreview } from "./CertificatePreview";
import { generateCertificateAssets } from "@/app/actions/certificates";

interface CertificateViewerProps extends CertificateRendererProps {
    id: string; // Database ID
    imageUrl?: string | null;
    pdfUrl?: string | null;
}

export function CertificateGenerator(props: CertificateViewerProps) {
    const {
        id,
        imageUrl,
        pdfUrl,
        ...rendererProps
    } = props;

    const [isPending, startTransition] = useTransition();

    const handleRegenerate = () => {
        startTransition(async () => {
            const result = await generateCertificateAssets(id);
            if (result.success) {
                toast.success("Certificate assets generated successfully");
            } else {
                toast.error("Failed to generate assets: " + result.error);
            }
        });
    };

    return (
        <div className="flex flex-col items-center space-y-8 w-full">

            {/* 1. VIEWPORT */}
            <div className="w-full max-w-5xl mx-auto">
                <h3 className="text-sm text-gray-400 mb-2 uppercase tracking-wider text-center">
                    {imageUrl ? "Official Certificate" : "Certificate Preview"}
                </h3>

                {imageUrl ? (
                    <div className="relative w-full aspect-[4096/2728] rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imageUrl}
                            alt="Certificate"
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="relative">
                        <CertificatePreview {...rendererProps} />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg pointer-events-none">
                            <span className="bg-white/90 px-4 py-2 rounded-md shadow text-sm font-medium text-muted-foreground">
                                Preview Mode
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* 2. ACTIONS */}
            <div className="flex gap-4">

                {/* Admin / Debug Trigger for Server Generation */}
                <Button
                    onClick={handleRegenerate}
                    disabled={isPending}
                    variant="secondary"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isPending ? 'animate-spin' : ''}`} />
                    {imageUrl ? "Regenerate Assets" : "Generate Official Certificate"}
                </Button>

                <Button
                    asChild
                    variant="outline"
                    disabled={!imageUrl}
                >
                    <a href={imageUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download PNG
                    </a>
                </Button>

                <Button
                    asChild
                    disabled={!pdfUrl}
                >
                    <a href={pdfUrl || "#"} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </a>
                </Button>
            </div>
        </div>
    );
}
