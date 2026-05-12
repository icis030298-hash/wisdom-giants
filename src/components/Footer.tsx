"use client"

import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  explore: [
    { label: "전체 위인", href: "#giants" },
    { label: "성취", href: "#" },
    { label: "역경", href: "#" },
    { label: "지혜", href: "#" },
  ],
  learn: [
    { label: "이용 방법", href: "#" },
    { label: "AI 기술", href: "#" },
    { label: "교육적 활용", href: "#" },
    { label: "연구 자료", href: "#" },
  ],
  company: [
    { label: "소개", href: "#" },
    { label: "블로그", href: "#" },
    { label: "채용", href: "#" },
    { label: "문의하기", href: "#" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
]

export function Footer() {
  return (
    <footer className="relative py-20 px-4 border-t border-border/50">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-t from-amber-500/10 to-transparent blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="font-serif text-xl font-semibold text-foreground">
                  Shoulders of Giants
                </span>
                <p className="text-xs text-muted-foreground">위대한 지성들의 전당</p>
              </div>
            </a>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
              역사를 바꾼 위대한 지성들의 여정에 동참하세요. AI의 힘으로 시공간을 초월한 지혜를 경험할 수 있습니다.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-serif text-foreground font-semibold mb-4">탐색</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-foreground font-semibold mb-4">학습</h4>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-foreground font-semibold mb-4">회사</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-muted-foreground hover:text-amber-400 transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Shoulders of Giants. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-amber-400 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-amber-400 transition-colors">이용약관</a>
            <a href="#" className="hover:text-amber-400 transition-colors">쿠키 설정</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
