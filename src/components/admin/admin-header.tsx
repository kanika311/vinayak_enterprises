'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Bell, Volume2, VolumeX, Users, ClipboardList, Star, ExternalLink,
  CheckCircle, ArrowRight, X, ShieldAlert, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiGet } from '@/lib/api';
import { ADMIN_BASE, SITE } from '@/lib/constants';
import { useAppSelector } from '@/store/hooks';
import type { DashboardNotificationsData } from '@/types';

/** Play a subtle pleasant chime sound using Web Audio API */
function playChimeSound() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // 2-tone melodic chime: C5 (523Hz) followed by E5 (659Hz)
    playTone(523.25, now, 0.22);
    playTone(659.25, now + 0.12, 0.35);
  } catch (err) {
    console.debug('Audio chime playback blocked or not supported:', err);
  }
}

export function AdminHeader() {
  const admin = useAppSelector((s) => s.auth.admin);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'leads' | 'testimonials'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef<number | null>(null);

  // Poll notifications every 20 seconds
  const { data: notifData } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: () => apiGet<DashboardNotificationsData>('/dashboard/notifications'),
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
  });

  const totalUnread = notifData?.counts?.totalUnread || 0;
  const newLeads = notifData?.counts?.newLeads || 0;
  const pendingRFQs = notifData?.counts?.pendingRFQs || 0;
  const pendingTestimonials = notifData?.counts?.pendingTestimonials || 0;
  const notifications = notifData?.latestNotifications || [];

  // Play audio alert and show browser notification when count increases
  useEffect(() => {
    if (prevCountRef.current !== null && totalUnread > prevCountRef.current) {
      if (soundEnabled) {
        playChimeSound();
      }
      // Browser notification if permitted
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        const diff = totalUnread - prevCountRef.current;
        new Notification('🔔 New Inquiry on Vinayak Enterprises', {
          body: `You have ${diff} new inquiry/testimonial waiting in the admin console.`,
          icon: '/favicon.ico',
        });
      }
    }
    prevCountRef.current = totalUnread;
  }, [totalUnread, soundEnabled]);

  // Request browser notification permission once if not asked
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [dropdownOpen]);

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'leads') return item.type === 'lead' || item.type === 'rfq';
    if (activeTab === 'testimonials') return item.type === 'testimonial';
    return true;
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Left Title / Location */}
      <div className="flex items-center gap-3 pl-12 lg:pl-0">
        <span className="text-sm font-bold text-slate-800 hidden sm:inline">
          {SITE.name} Admin
        </span>
        <span className="text-xs text-slate-400 hidden md:inline">|</span>
        <span className="text-xs text-slate-500 hidden md:inline">
          {SITE.location} &mdash; Pan-India Orders
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Visit Website Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1a3a6b] bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`relative p-2 rounded-xl transition-all ${
              totalUnread > 0
                ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
            aria-label="View notifications"
          >
            <Bell className={`w-5 h-5 ${totalUnread > 0 ? 'text-amber-600 animate-pulse' : ''}`} />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-extrabold text-white shadow-md ring-2 ring-white">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="p-3.5 bg-gradient-to-r from-[#1a3a6b] to-[#2563eb] text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-300" />
                  <span className="font-bold text-sm">Notifications &amp; Inquiries</span>
                  {totalUnread > 0 && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-1.5 py-0">
                      {totalUnread} new
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1"
                    title={soundEnabled ? 'Mute chime' : 'Enable chime'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(false)}
                    className="p-1 rounded text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Summary Counts */}
              <div className="grid grid-cols-3 divide-x border-b bg-slate-50 text-center text-xs py-2">
                <Link
                  href={`${ADMIN_BASE}/leads`}
                  onClick={() => setDropdownOpen(false)}
                  className="hover:bg-slate-100 py-1 transition-colors"
                >
                  <p className="font-bold text-slate-800">{newLeads}</p>
                  <p className="text-[10px] text-slate-500">Contact Leads</p>
                </Link>
                <Link
                  href={`${ADMIN_BASE}/rfqs`}
                  onClick={() => setDropdownOpen(false)}
                  className="hover:bg-slate-100 py-1 transition-colors"
                >
                  <p className="font-bold text-slate-800">{pendingRFQs}</p>
                  <p className="text-[10px] text-slate-500">Quote RFQs</p>
                </Link>
                <Link
                  href={`${ADMIN_BASE}/testimonials`}
                  onClick={() => setDropdownOpen(false)}
                  className="hover:bg-slate-100 py-1 transition-colors"
                >
                  <p className="font-bold text-slate-800">{pendingTestimonials}</p>
                  <p className="text-[10px] text-slate-500">Reviews</p>
                </Link>
              </div>

              {/* Filter Tabs */}
              <div className="flex border-b text-xs font-semibold px-2 bg-white">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`py-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'all'
                      ? 'border-[#1a3a6b] text-[#1a3a6b]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className={`py-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'leads'
                      ? 'border-[#1a3a6b] text-[#1a3a6b]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Leads &amp; RFQs
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('testimonials')}
                  className={`py-2 px-3 border-b-2 transition-colors ${
                    activeTab === 'testimonials'
                      ? 'border-[#1a3a6b] text-[#1a3a6b]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Testimonials ({pendingTestimonials})
                </button>
              </div>

              {/* Notification Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                    <p className="font-semibold text-slate-600">All caught up!</p>
                    <p className="mt-0.5">No pending leads or testimonials requiring review.</p>
                  </div>
                ) : (
                  filteredNotifications.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link}
                      onClick={() => setDropdownOpen(false)}
                      className="p-3 hover:bg-blue-50/60 flex items-start gap-3 transition-colors block group"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          item.type === 'testimonial'
                            ? 'bg-amber-100 text-amber-600'
                            : item.type === 'rfq'
                            ? 'bg-blue-100 text-[#1a3a6b]'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {item.type === 'testimonial' ? (
                          <Star className="w-4 h-4 fill-current" />
                        ) : item.type === 'rfq' ? (
                          <ClipboardList className="w-4 h-4" />
                        ) : (
                          <Users className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-bold text-xs text-slate-900 group-hover:text-[#1a3a6b] truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.subtitle}</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-slate-50 border-t flex items-center justify-between text-xs">
                <Link
                  href={`${ADMIN_BASE}/dashboard`}
                  onClick={() => setDropdownOpen(false)}
                  className="text-xs font-semibold text-[#1a3a6b] hover:underline flex items-center gap-1"
                >
                  <span>Dashboard Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`${ADMIN_BASE}/testimonials`}
                  onClick={() => setDropdownOpen(false)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Manage Reviews
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Admin Avatar Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#1a3a6b] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            {(admin?.name || 'A')[0].toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">{admin?.name || 'Admin'}</p>
            <p className="text-[10px] text-slate-400 leading-tight capitalize">{admin?.role?.replace('_', ' ') || 'Super Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
