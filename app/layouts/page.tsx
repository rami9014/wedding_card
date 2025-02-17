"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface Layout {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

export default function LayoutsPage() {
  const [layouts, setLayouts] = React.useState<Layout[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/layouts")
      .then((res) => res.json())
      .then((data) => {
        setLayouts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading layouts:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light mb-4">웨딩 페이지 디자인</h1>
          <p className="text-gray-600">
            원하시는 디자인을 선택하여 웨딩 페이지를 시작하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {layouts.map((layout, index) => (
            <motion.div
              key={layout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/layouts/${layout.id}`} className="block group">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={layout.thumbnail}
                    alt={layout.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h2 className="text-2xl font-light mb-2">{layout.name}</h2>
                <p className="text-gray-600">{layout.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
