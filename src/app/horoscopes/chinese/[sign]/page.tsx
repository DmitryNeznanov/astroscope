// HOROSCOPES / CHINESE / [sign] — dynamic route for all 12 Chinese zodiac
// signs. Server shell: static params, metadata, 404 guard; the interactive
// page itself lives in sign-client.tsx.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CHINESE_ZODIAC_SIGNS, getChineseZodiacSign } from "@/lib/chinese-zodiac";
import SignClient from "./sign-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return CHINESE_ZODIAC_SIGNS.map((s) => ({ sign: s.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sign: string }>;
}): Promise<Metadata> {
  const { sign: key } = await params;
  const sign = getChineseZodiacSign(key);
  if (!sign) return { title: "Chinese Zodiac — Astro Scope" };
  return {
    title: `${sign.name} — Chinese Zodiac · Astro Scope`,
    description: sign.description,
  };
}

export default async function ChineseSignPage({
  params,
}: {
  params: Promise<{ sign: string }>;
}) {
  const { sign: key } = await params;
  const sign = getChineseZodiacSign(key);
  if (!sign) notFound();
  return <SignClient sign={sign} />;
}
