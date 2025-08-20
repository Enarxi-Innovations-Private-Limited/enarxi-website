// src/components/TrustedBy.jsx
import React from 'react';

export function TrustedBy({ logos = [] }) {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 text-center mb-8">
                <h2 className="text-2xl font-semibold mb-12">Trusted By</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
                    {logos?.map(({ src, alt }, idx) => (
                        <div key={idx} className="flex justify-center">
                            <img src={src} alt={alt} className="max-h-12 object-contain" loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
