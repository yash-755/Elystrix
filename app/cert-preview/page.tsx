'use client';

import React from 'react';
import { CertificatePreview } from '@/components/certificates/CertificatePreview';

export default function CertPreviewPage() {
    const tiers = ['PREMIUM', 'BASIC'] as const;

    const mockData = {
        studentName: "Yash Uttam",
        courseName: "Strategic Business Management & Leadership",
        instructorName: "Elestrix Academy",
        issueDate: "December 23, 2025",
        credentialId: "ELY-PRM-2025-8F3A2X"
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 space-y-12">
            <div className="max-w-7xl mx-auto text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Certificate System Preview</h1>
                <p className="text-gray-600 mt-2">Live rendering of static-template certificates</p>
            </div>

            {tiers.map((type) => (
                <div key={type} className="max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                        {type === 'PREMIUM' ? 'Premium Certificate' : 'Basic Certificate'}
                    </h2>

                    {/* New Responsive Preview Component */}
                    <CertificatePreview
                        certificateType={type}
                        studentName={mockData.studentName}
                        courseName={mockData.courseName}
                        instructorName={mockData.instructorName}
                        issueDate={mockData.issueDate}
                        credentialId={
                            type === 'PREMIUM' ? "ELY-PRM-2025-8F3A2X" :
                                "ELY-BAS-2025-8F3A2X"
                        }
                    />
                </div>
            ))}
        </div>
    );
}
