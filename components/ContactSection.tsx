import React from "react";
import { motion } from "framer-motion";
import {
  PhoneIcon,
  MessageIcon,
  PhoneSmallIcon,
  MessageSmallIcon,
} from "./Icons";

interface ContactPerson {
  name: string;
  phone: string;
}

interface ContactFamily {
  title: string;
  main: ContactPerson;
  father: ContactPerson;
  mother: ContactPerson;
}

interface ContactSectionProps {
  groomFamily: ContactFamily;
  brideFamily: ContactFamily;
  backgroundColor?: string;
  titleColor?: string;
  subtitleColor?: string;
}

export default function ContactSection({
  groomFamily,
  brideFamily,
  backgroundColor = "bg-neutral-50",
  titleColor = "text-4xl font-light tracking-[0.2em] uppercase",
  subtitleColor = "text-gray-500 tracking-[0.1em] uppercase text-sm",
}: ContactSectionProps) {
  return (
    <section className={`py-40 ${backgroundColor} font-apple`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-20"
        >
          <div className="text-center space-y-4">
            <h2 className={titleColor}>Contact</h2>
            <p className={subtitleColor}>Get in Touch</p>
          </div>

          <div className="flex flex-row justify-center gap-8 sm:gap-16">
            {/* 신랑측 */}
            <div className="text-center space-y-8">
              <div>
                <p className="text-gray-600 mb-2 tracking-[0.1em] uppercase text-sm">
                  {groomFamily.title}
                </p>
                <p className="text-gray-800 font-medium mb-2 tracking-[0.05em]">
                  {groomFamily.main.name}
                </p>
                <div className="flex justify-center gap-2">
                  <a
                    href={`tel:${groomFamily.main.phone}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                    aria-label={`${groomFamily.main.name}에게 전화하기`}
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={`sms:${groomFamily.main.phone}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                    aria-label={`${groomFamily.main.name}에게 문자하기`}
                  >
                    <MessageIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1 tracking-[0.1em] uppercase text-xs">
                    아버지
                  </p>
                  <p className="text-gray-800 font-medium mb-2 tracking-[0.05em]">
                    {groomFamily.father.name}
                  </p>
                  <div className="flex justify-center gap-2">
                    <a
                      href={`tel:${groomFamily.father.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${groomFamily.father.name}께 전화하기`}
                    >
                      <PhoneSmallIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`sms:${groomFamily.father.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${groomFamily.father.name}께 문자하기`}
                    >
                      <MessageSmallIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1 tracking-[0.1em] uppercase text-xs">
                    어머니
                  </p>
                  <p className="text-gray-800 font-medium mb-2 tracking-[0.05em]">
                    {groomFamily.mother.name}
                  </p>
                  <div className="flex justify-center gap-2">
                    <a
                      href={`tel:${groomFamily.mother.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${groomFamily.mother.name}께 전화하기`}
                    >
                      <PhoneSmallIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`sms:${groomFamily.mother.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${groomFamily.mother.name}께 문자하기`}
                    >
                      <MessageSmallIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 신부측 */}
            <div className="text-center space-y-8">
              <div>
                <p className="text-gray-600 mb-2 tracking-[0.1em] uppercase text-sm">
                  {brideFamily.title}
                </p>
                <p className="text-gray-800 font-medium mb-2 tracking-[0.05em]">
                  {brideFamily.main.name}
                </p>
                <div className="flex justify-center gap-2">
                  <a
                    href={`tel:${brideFamily.main.phone}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                    aria-label={`${brideFamily.main.name}에게 전화하기`}
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </a>
                  <a
                    href={`sms:${brideFamily.main.phone}`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                    aria-label={`${brideFamily.main.name}에게 문자하기`}
                  >
                    <MessageIcon className="w-5 h-5" />
                  </a>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 mb-1 tracking-[0.1em] uppercase text-xs">
                    아버지
                  </p>
                  <p className="text-gray-800 font-medium mb-2 tracking-[0.05em]">
                    {brideFamily.father.name}
                  </p>
                  <div className="flex justify-center gap-2">
                    <a
                      href={`tel:${brideFamily.father.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${brideFamily.father.name}께 전화하기`}
                    >
                      <PhoneSmallIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`sms:${brideFamily.father.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${brideFamily.father.name}께 문자하기`}
                    >
                      <MessageSmallIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 mb-1 tracking-[0.1em] uppercase text-xs">
                    어머니
                  </p>
                  <p className="text-gray-800 font-medium mb-2 tracking-[0.05em]">
                    {brideFamily.mother.name}
                  </p>
                  <div className="flex justify-center gap-2">
                    <a
                      href={`tel:${brideFamily.mother.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${brideFamily.mother.name}께 전화하기`}
                    >
                      <PhoneSmallIcon className="w-4 h-4" />
                    </a>
                    <a
                      href={`sms:${brideFamily.mother.phone}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-none bg-black text-white hover:bg-gray-900 transition-colors"
                      aria-label={`${brideFamily.mother.name}께 문자하기`}
                    >
                      <MessageSmallIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
