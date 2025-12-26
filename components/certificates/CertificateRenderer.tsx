/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

// Map types to specific static image files
const TYPE_IMAGES = {
    PREMIUM: "/premium-certificate-template.png",
    BASIC: "/basic-certificate-template.png",
} as const;

export interface CertificateRendererProps {
    studentName: string;
    courseName: string;
    instructorName: string; // YouTube Channel Name
    issueDate: string;
    credentialId: string;
    certificateType: "BASIC" | "PREMIUM";
    className?: string;
    bgImageSrc?: string; // Optional override (e.g. Base64 for Server Rendering)
}

export function CertificateRenderer({
    studentName,
    courseName,
    instructorName,
    issueDate,
    credentialId,
    certificateType,
    className,
    bgImageSrc,
}: CertificateRendererProps) {
    // Use BASIC as fallback
    const bgImage = bgImageSrc || TYPE_IMAGES[certificateType] || TYPE_IMAGES.BASIC;
    const isPremium = certificateType === "PREMIUM";

    return (
        <div
            className={cn("relative bg-white text-black selection:bg-none print:shadow-none", className)}
            style={{
                width: "4096px",
                height: "2728px",
            }}
        >
            {/* 1. Static Background Image */}
            <img
                src={bgImage}
                alt="Certificate Template"
                className="block w-full h-full object-contain pointer-events-none z-0"
            />

            {/* 2. Text Overlays */}
            <div className="absolute inset-0 z-10 font-sans">

                {/* STUDENT NAME */}
                <div
                    className={`absolute left-0 right-0 text-center pointer-events-none ${!isPremium ? 'flex items-center justify-center' : ''}`}
                    style={{
                        top: isPremium ? '46%' : 'calc(44% - 13px)', // Basic: Forced 8px shift UP
                        height: "260px"
                    }}
                >
                    <h1
                        className={`leading-none font-serif uppercase tracking-wider drop-shadow-sm whitespace-nowrap ${isPremium ? 'text-[10rem] text-[#C5A059] font-bold' :
                            'text-[9.5rem] text-[#C5A059] font-serif font-bold' // Basic: Gold, larger (kept gold color for text as requested "Visual distinction... not color-tier naming")
                            }`}
                        style={!isPremium ? { position: 'relative', top: '-10px', margin: 0 } : {}}
                    >
                        {studentName}
                    </h1>
                </div>

                {/* COURSE NAME */}
                <div
                    className="absolute left-[10%] right-[10%] text-center flex items-start justify-center pointer-events-none"
                    style={{
                        top: isPremium ? '62%' : 'calc(58% + 8px)', // Basic: Balanced
                        height: "220px"
                    }}
                >
                    <h2
                        className={`tracking-widest uppercase drop-shadow-md max-w-[80%] ${isPremium ? 'text-[5rem] leading-tight font-bold text-[#C5A059]' :
                            'text-[5.5rem] leading-normal font-semibold text-[#C5A059]'
                            }`}
                    >
                        {courseName}
                    </h2>
                </div>

                {/* INSTRUCTOR SIGNATURE */}
                {isPremium ? (
                    /* Premium: Standard Rendering */
                    <div
                        className={`absolute text-center pointer-events-none w-[900px]`}
                        style={{ bottom: '280px', right: 'calc(14% - 14px)' }}
                    >
                        <p
                            className={`rotate-[-4deg] opacity-90 text-[7rem] text-[#C5A059]`}
                            style={{ fontFamily: '"Great Vibes", "Brush Script MT", cursive' }}
                        >
                            {instructorName}
                        </p>
                    </div>
                ) : (
                    /* Basic: Detached Absolute Rendering */
                    <div
                        className="absolute pointer-events-none text-center"
                        style={{
                            bottom: '560px',
                            right: 'calc(14% + 370px)',
                            width: 'auto', // Let text define width
                            zIndex: 50
                        }}
                    >
                        <p
                            className="text-[6rem] text-black opacity-90 rotate-[-4deg]"
                            style={{
                                fontFamily: '"Great Vibes", "Brush Script MT", cursive',
                                margin: 0,
                                padding: 0
                            }}
                        >
                            {instructorName}
                        </p>
                    </div>
                )}

                {/* ISSUE DATE */}
                <div
                    className={`absolute left-[14%] text-center w-[700px] pointer-events-none ${isPremium ? '' : 'bottom-[18%]'}`}
                    style={isPremium ? { bottom: '464px' } : { bottom: '600px' }} // Basic: Higher to clear cluster
                >
                    <p
                        className={`font-medium tracking-wider font-serif whitespace-nowrap ${isPremium ? 'text-[2.4rem] text-[#C5A059]' :
                            'text-[2.5rem] text-black font-semibold' // Basic: Black, readable
                            }`}
                    >
                        {issueDate}
                    </p>
                </div>

                <div
                    className={`absolute text-center pointer-events-none ${isPremium ? 'left-[14%] w-[1200px] text-left' :
                        'bottom-[9%] left-[14%] w-[1200px] text-center' // Basic
                        }`}
                    style={isPremium ? { bottom: '320px' } :
                        { bottom: '450px', left: '8%', textAlign: 'left' }} // Basic: Masking label (starts at 8%)
                >
                    <p
                        className={`tracking-[0.15em] font-mono whitespace-nowrap ${isPremium ? 'text-[2.4rem] text-[#C5A059]' : // Premium: Larger font
                            'text-[2.5rem] text-black font-semibold z-20 inline-block min-w-[900px] pl-[245px]' // Basic: Wide mask + Offset
                            }`}
                        style={!isPremium ? { backgroundColor: 'white', opacity: 1, padding: '10px 20px 10px 245px' } : {}}
                    >
                        {isPremium ? (
                            <span className="pl-[360px]">{credentialId}</span>
                        ) : (
                            `Credential ID - ${credentialId}`
                        )}
                    </p>
                </div>

            </div>
        </div>
    );
}
