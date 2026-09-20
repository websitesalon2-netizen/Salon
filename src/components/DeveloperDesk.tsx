import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Code2,
  Sliders,
  Image as ImageIcon,
  MapPin,
  Type,
  FileText,
  Database,
  Save,
  Download,
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  Scissors,
  Users,
  Sparkles,
  Clock,
  Phone,
  MessageSquare,
  Eye,
  RefreshCw,
  Globe,
  Building,
  Layers,
  Settings,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import type { BusinessInfo, Barber, Service, HaircutStyle } from '../types';
import { ImageUploader } from './ImageUploader';
import {
  exportDatabaseConfig,
  importDatabaseConfig,
  resetDatabaseConfig,
  updateFaviconDOM,
  updateBusiness,
  removeDeveloperToken
} from '../lib/api';

interface DeveloperDeskProps {
  isOpen?: boolean;
  onClose: () => void;
  business: BusinessInfo;
  barbers?: Barber[];
  services?: Service[];
  styles?: HaircutStyle[];
  onUpdateBusiness?: (updated: BusinessInfo) => void;
  onBusinessUpdated?: (updated: BusinessInfo) => void;
  onRefreshData?: () => void;
}

type TabType = 'identity' | 'copy' | 'media' | 'location' | 'database';

export const DeveloperDesk: React.FC<DeveloperDeskProps> = ({
  isOpen = true,
  onClose,
  business,
  barbers = [],
  services = [],
  styles = [],
  onUpdateBusiness,
  onBusinessUpdated,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('identity');
  const [formData, setFormData] = useState<BusinessInfo>({ ...business });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Database JSON state
  const [rawJson, setRawJson] = useState<string>('');
  const [loadingJson, setLoadingJson] = useState(false);
  const [jsonSaveSuccess, setJsonSaveSuccess] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Synchronize when business changes
  useEffect(() => {
    setFormData({ ...business });
  }, [business]);

  // Load raw JSON when opening Database tab
  useEffect(() => {
    if (activeTab === 'database') {
      setLoadingJson(true);
      exportDatabaseConfig()
        .then((data) => {
          setRawJson(JSON.stringify(data, null, 2));
        })
        .catch((err) => {
          setErrorMsg('Failed to load database export: ' + err.message);
        })
        .finally(() => setLoadingJson(false));
    }
  }, [activeTab]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBusiness = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSaveSuccess(false);

    try {
      const updated = await updateBusiness(formData);
      if (onUpdateBusiness) onUpdateBusiness(updated);
      if (onBusinessUpdated) onBusinessUpdated(updated);
      if (onRefreshData) onRefreshData();

      // Dynamically update document favicon and title
      if (updated.favicon_url) {
        updateFaviconDOM(updated.favicon_url);
      }
      if (typeof document !== 'undefined' && updated.name) {
        document.title = `${updated.name} · ${updated.region_badge || 'Pampore, Kashmir'}`;
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = async () => {
    try {
      const data = await exportDatabaseConfig();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kashmir_salon_config_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setErrorMsg('Failed to export configuration: ' + err.message);
    }
  };

  const handleImportJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        const ok = await importDatabaseConfig(parsed);
        if (ok) {
          setJsonSaveSuccess(true);
          onRefreshData?.();
          setTimeout(() => setJsonSaveSuccess(false), 4000);
        }
      } catch (err: any) {
        setErrorMsg('Invalid JSON import file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleSaveRawJson = async () => {
    setErrorMsg(null);
    setSaving(true);
    try {
      const parsed = JSON.parse(rawJson);
      const ok = await importDatabaseConfig(parsed);
      if (ok) {
        setJsonSaveSuccess(true);
        onRefreshData?.();
        setTimeout(() => setJsonSaveSuccess(false), 4000);
      }
    } catch (err: any) {
      setErrorMsg('Invalid JSON format: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    setSaving(true);
    try {
      await resetDatabaseConfig();
      setConfirmReset(false);
      onRefreshData?.();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg('Failed to reset: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    removeDeveloperToken();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[94vh] rounded-2xl bg-[#141A17] border border-emerald-900/50 shadow-2xl flex flex-col overflow-hidden text-stone-200 font-sans">
        
        {/* Top Header Bar */}
        <header className="px-5 py-3.5 bg-[#0F1411] border-b border-emerald-950/80 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-inner">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
                  Developer Desk
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-wider">
                  Full Site Control
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Modify every text string, picture, logo, favicon, map coordinate, and raw database schema.
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              id="btn-dev-export-json"
              title="Download Full Site JSON Backup"
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 text-xs font-mono flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Backup JSON</span>
            </button>

            <button
              onClick={handleSaveBusiness}
              disabled={saving}
              id="btn-dev-quick-save"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow transition disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>

            <button
              onClick={onClose}
              id="btn-dev-close"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="Close Desk"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Global Feedback Banners */}
        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-950/90 border-b border-emerald-800 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>All site changes have been saved and applied to the live salon website!</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Updated</span>
          </div>
        )}

        {errorMsg && (
          <div className="px-4 py-2 bg-red-950/90 border-b border-red-800 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-stone-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-4 bg-[#111713] border-b border-stone-800 flex items-center gap-1 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'identity'
                ? 'border-emerald-500 text-emerald-300 font-semibold bg-emerald-950/30'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Identity & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab('copy')}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'copy'
                ? 'border-emerald-500 text-emerald-300 font-semibold bg-emerald-950/30'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>2. Website Copy & Texts</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-emerald-500 text-emerald-300 font-semibold bg-emerald-950/30'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>3. Pictures & Media Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'location'
                ? 'border-emerald-500 text-emerald-300 font-semibold bg-emerald-950/30'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>4. Addresses, Map & Contact</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-3.5 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
              activeTab === 'database'
                ? 'border-emerald-500 text-emerald-300 font-semibold bg-emerald-950/30'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-900/40'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>5. Raw JSON Database</span>
          </button>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* ---------------- TAB 1: IDENTITY & BRANDING ---------------- */}
          {activeTab === 'identity' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                <Globe className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 space-y-1">
                  <p className="font-semibold text-white">Brand Name, Favicon, Logo & Region Badges</p>
                  <p className="text-stone-400">
                    Control how the salon is named across the header, browser tab, favicon, and hero badges.
                    These fields resolve all regional titles like &quot;Pampore · Kashmir&quot; and &quot;Frestabal, Pampore&quot;.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Business Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center justify-between">
                    <span>Website & Salon Name</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Header / Brand</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Jawed Habib"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                  <p className="text-[11px] text-stone-500">Appears in header, hero title, and footer copyright.</p>
                </div>

                {/* Tagline */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300">
                    Salon Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.tagline || ''}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="e.g. Pampore's Premier Men's Salon & Grooming Sanctuary"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-stone-500">Appears beneath brand mark in header and hero.</p>
                </div>

                {/* Region Badge (Pampore · Kashmir) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center justify-between">
                    <span>Region Badge Text</span>
                    <span className="text-[10px] text-amber-400 font-mono">Top Hero Badge</span>
                  </label>
                  <input
                    type="text"
                    value={formData.region_badge || ''}
                    onChange={(e) => handleInputChange('region_badge', e.target.value)}
                    placeholder="e.g. Pampore · Kashmir"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-amber-200 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <p className="text-[11px] text-stone-500">
                    Replaces any old &quot;Srinagar - Kashmir&quot; reference on the top badge.
                  </p>
                </div>

                {/* Location Badge (Frestabal, Pampore) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center justify-between">
                    <span>Local Area / Town Subtitle</span>
                    <span className="text-[10px] text-amber-400 font-mono">Hero Sub-badge</span>
                  </label>
                  <input
                    type="text"
                    value={formData.location_badge || ''}
                    onChange={(e) => handleInputChange('location_badge', e.target.value)}
                    placeholder="e.g. Frestabal, Pampore"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-amber-200 text-sm focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  <p className="text-[11px] text-stone-500">
                    Replaces any &quot;Boulevard Road&quot; reference across the site.
                  </p>
                </div>

                {/* Logo Monogram */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300">
                    Logo Monogram Letter (Fallback Icon)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.logo_text || ''}
                    onChange={(e) => handleInputChange('logo_text', e.target.value.toUpperCase())}
                    placeholder="e.g. J or K"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono text-center tracking-widest text-lg"
                  />
                  <p className="text-[11px] text-stone-500">Rendered when no logo image file is supplied.</p>
                </div>

                {/* Announcement Top Bar */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300">
                    Top Announcement / Notification Bar (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.announcement_bar || ''}
                    onChange={(e) => handleInputChange('announcement_bar', e.target.value)}
                    placeholder="e.g. Walk-ins welcomed daily. Friday Jummah break: 12:30 PM - 2:30 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-stone-500">Leave blank to hide the announcement ribbon.</p>
                </div>
              </div>

              {/* Logo & Favicon Uploaders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-stone-800">
                {/* Custom Logo */}
                <div className="space-y-2 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Custom Salon Logo</span>
                    <span className="text-[10px] text-stone-400">Header Branding</span>
                  </div>
                  <ImageUploader
                    value={formData.logo_url || ''}
                    onChange={(url: string) => handleInputChange('logo_url', url)}
                    label="Upload Salon Logo Image"
                  />
                </div>

                {/* Browser Favicon */}
                <div className="space-y-2 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">Browser Tab Favicon</span>
                    <span className="text-[10px] text-stone-400">Tab Icon (Live Update)</span>
                  </div>
                  <ImageUploader
                    value={formData.favicon_url || ''}
                    onChange={(url: string) => {
                      handleInputChange('favicon_url', url);
                      updateFaviconDOM(url);
                    }}
                    label="Upload Favicon Icon"
                  />
                </div>
              </div>

              {/* Save Trigger */}
              <div className="flex items-center justify-end pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={handleSaveBusiness}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Apply Identity Changes'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ---------------- TAB 2: WEBSITE COPY & TEXTS ---------------- */}
          {activeTab === 'copy' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                <Type className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 space-y-1">
                  <p className="font-semibold text-white">Section Headings, Descriptions & Copywriting</p>
                  <p className="text-stone-400">
                    Modify the exact headlines and descriptions rendered across every section of the public website.
                  </p>
                </div>
              </div>

              {/* Hero Section Copy */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Hero / Main Banner Section</span>
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300">
                    Hero Main Headline
                  </label>
                  <input
                    type="text"
                    value={formData.hero_headline || ''}
                    onChange={(e) => handleInputChange('hero_headline', e.target.value)}
                    placeholder="Traditional Craftsmanship, Modern Precision"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300">
                    Hero Description / Story Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={formData.hero_description || ''}
                    onChange={(e) => handleInputChange('hero_description', e.target.value)}
                    placeholder="Experience the timeless ritual of royal Kashmiri hot towel shaves..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center justify-between">
                    <span>Hero Card Caption Badge</span>
                    <span className="text-[10px] text-stone-400">Bottom Hero Card</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hero_caption || ''}
                    onChange={(e) => handleInputChange('hero_caption', e.target.value)}
                    placeholder="Frestabal, Pampore · Open until 8:30 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-stone-500">Completely replaces any hardcoded Boulevard or old street text.</p>
                </div>
              </div>

              {/* Services Section Copy */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Scissors className="w-4 h-4 text-emerald-400" />
                  <span>Services & Treatments Section</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Services Title</label>
                    <input
                      type="text"
                      value={formData.services_title || ''}
                      onChange={(e) => handleInputChange('services_title', e.target.value)}
                      placeholder="Signature Grooming & Services"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Services Subtitle</label>
                    <input
                      type="text"
                      value={formData.services_subtitle || ''}
                      onChange={(e) => handleInputChange('services_subtitle', e.target.value)}
                      placeholder="Every appointment begins with warm consultation..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Barbers Section Copy */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Barbers Section</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Barbers Title</label>
                    <input
                      type="text"
                      value={formData.barbers_title || ''}
                      onChange={(e) => handleInputChange('barbers_title', e.target.value)}
                      placeholder="Meet Pampore’s Dedicated Barbers"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Barbers Subtitle</label>
                    <input
                      type="text"
                      value={formData.barbers_subtitle || ''}
                      onChange={(e) => handleInputChange('barbers_subtitle', e.target.value)}
                      placeholder="Honoring generations of Kashmiri grooming heritage..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Lookbook / Styles Section Copy */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Haircut Styles Lookbook Section</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Styles Title</label>
                    <input
                      type="text"
                      value={formData.styles_title || ''}
                      onChange={(e) => handleInputChange('styles_title', e.target.value)}
                      placeholder="Popular Haircut Styles & Scissor Work"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Styles Subtitle</label>
                    <input
                      type="text"
                      value={formData.styles_subtitle || ''}
                      onChange={(e) => handleInputChange('styles_subtitle', e.target.value)}
                      placeholder="From classic gentlemen’s contours to crisp skin fades..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Booking & Queue Copy */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Booking & Live Queue Section</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Booking Title</label>
                    <input
                      type="text"
                      value={formData.booking_title || ''}
                      onChange={(e) => handleInputChange('booking_title', e.target.value)}
                      placeholder="Book Your Grooming Chair"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Booking Subtitle</label>
                    <input
                      type="text"
                      value={formData.booking_subtitle || ''}
                      onChange={(e) => handleInputChange('booking_subtitle', e.target.value)}
                      placeholder="Select your preferred master barber, signature service, date and time."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Live Queue Title</label>
                    <input
                      type="text"
                      value={formData.queue_title || ''}
                      onChange={(e) => handleInputChange('queue_title', e.target.value)}
                      placeholder="Track Your Appointment & Queue"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Live Queue Subtitle</label>
                    <input
                      type="text"
                      value={formData.queue_subtitle || ''}
                      onChange={(e) => handleInputChange('queue_subtitle', e.target.value)}
                      placeholder="Real-time queue tracking for walk-in and booked appointments."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Developer Attribution & Footer Text */}
              <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-stone-800 pb-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Developer Credits & Footer Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Developer Credit Name</label>
                    <input
                      type="text"
                      value={formData.developer_name || ''}
                      onChange={(e) => handleInputChange('developer_name', e.target.value)}
                      placeholder="Developed by Shujaat"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">Developer WhatsApp (Direct Click Link)</label>
                    <input
                      type="text"
                      value={formData.developer_whatsapp || ''}
                      onChange={(e) => handleInputChange('developer_whatsapp', e.target.value)}
                      placeholder="e.g. 9622229622"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Save Trigger */}
              <div className="flex items-center justify-end pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={handleSaveBusiness}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save All Copywriting Changes'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ---------------- TAB 3: PICTURES & MEDIA HUB ---------------- */}
          {activeTab === 'media' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 space-y-1">
                  <p className="font-semibold text-white">Central Image & Visual Assets Desk</p>
                  <p className="text-stone-400">
                    Replace any photograph on the site directly. You can drag and drop any image file from your computer/phone or enter an external image URL.
                  </p>
                </div>
              </div>

              {/* Major Website Banners */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Primary Website Showcase Banners
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hero Image */}
                  <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Hero Main Showcase Photograph</span>
                      <span className="text-[10px] text-amber-400 font-mono">Hero Section</span>
                    </div>
                    <ImageUploader
                      value={formData.hero_image_url || ''}
                      onChange={(url: string) => handleInputChange('hero_image_url', url)}
                      label="Upload Hero Main Picture"
                    />
                  </div>

                  {/* Visit Map Section Image */}
                  <div className="p-5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Visit / Location Backdrop Photo</span>
                      <span className="text-[10px] text-amber-400 font-mono">Visit Section</span>
                    </div>
                    <ImageUploader
                      value={formData.visit_image_url || ''}
                      onChange={(url: string) => handleInputChange('visit_image_url', url)}
                      label="Upload Pampore Destination Photo"
                    />
                  </div>
                </div>
              </div>

              {/* Barbers Photographs */}
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Master Barbers Team Portraits ({barbers.length})
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Barbers Section Grid</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {barbers.map((barber) => (
                    <div key={barber.id} className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2 flex flex-col">
                      <div className="aspect-4/5 w-full rounded-lg overflow-hidden bg-stone-800 relative">
                        <img
                          src={barber.image_url}
                          alt={barber.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/75 backdrop-blur text-[11px] text-white font-medium truncate">
                          {barber.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate">{barber.specialty}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Photographs */}
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Curated Services & Treatment Photos ({services.length})
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Services Grid</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2">
                      <div className="h-28 w-full rounded-lg overflow-hidden bg-stone-800 relative">
                        <img
                          src={srv.image_url}
                          alt={srv.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-amber-300 font-mono font-bold">
                          ₹{srv.price_inr}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{srv.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Haircut Styles Lookbook Photos */}
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Popular Haircut Styles & Portfolio ({styles.length})
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-mono">Lookbook Section</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {styles.map((st) => (
                    <div key={st.id} className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 space-y-1.5">
                      <div className="aspect-3/4 w-full rounded-lg overflow-hidden bg-stone-800">
                        <img
                          src={st.image_url}
                          alt={st.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[11px] font-medium text-stone-200 truncate text-center">{st.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Trigger */}
              <div className="flex items-center justify-end pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={handleSaveBusiness}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Media Changes'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ---------------- TAB 4: ADDRESSES, MAP & CONTACT ---------------- */}
          {activeTab === 'location' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 space-y-1">
                  <p className="font-semibold text-white">Physical Address, Google Maps Navigation & Contact Details</p>
                  <p className="text-stone-400">
                    Set the physical address in Pampore, direct Google Maps link for directions, calling phone number, and WhatsApp hotline.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Physical Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-stone-400" />
                    <span>Physical Salon Address (Pampore)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Kadlabal Pampore Near JK Bank, Pampore, Jammu & Kashmir 192121"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-stone-500">Rendered in the Visit section, contact cards, and footer.</p>
                </div>

                {/* Google Maps Link */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>Google Maps Navigation Link</span>
                    </label>
                    {formData.map_url && (
                      <a
                        href={formData.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono"
                      >
                        <span>Test Map URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.map_url || ''}
                    onChange={(e) => handleInputChange('map_url', e.target.value)}
                    placeholder="https://maps.google.com/?q=Kadlabal+Pampore+Jammu+and+Kashmir"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[11px] text-stone-500">
                    When customers click &quot;Navigate with Google Maps&quot;, this exact URL will open.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span>Direct Calling Phone</span>
                    </label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+91 9622229622"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
                      <span>WhatsApp Number (without spaces)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.whatsapp || ''}
                      onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                      placeholder="+91 9622229622"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Hours */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Operating Hours</span>
                    </label>
                    <input
                      type="text"
                      value={formData.hours || ''}
                      onChange={(e) => handleInputChange('hours', e.target.value)}
                      placeholder="Monday – Sunday: 9:30 AM – 8:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Friday Break Notice */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-stone-300">
                      Friday Jummah Break Timing
                    </label>
                    <input
                      type="text"
                      value={formData.friday_break || ''}
                      onChange={(e) => handleInputChange('friday_break', e.target.value)}
                      placeholder="Friday Jummah break 12:30 PM - 2:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Trigger */}
              <div className="flex items-center justify-end pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={handleSaveBusiness}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-2 shadow transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Location & Contact Settings'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ---------------- TAB 5: RAW JSON DATABASE ---------------- */}
          {activeTab === 'database' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
              
              <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 flex items-start gap-3">
                <Database className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-stone-300 space-y-1">
                  <p className="font-semibold text-white">Direct JSON Configuration & Backup Console</p>
                  <p className="text-stone-400">
                    Developers can inspect, download, modify, and import the entire website configuration schema (business, barbers, services, haircut styles, schedules).
                  </p>
                </div>
              </div>

              {jsonSaveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Database JSON has been validated and saved into the live website configuration!</span>
                </div>
              )}

              {/* JSON Editor Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-900/70 border border-stone-800">
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium cursor-pointer flex items-center gap-1.5 transition">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upload JSON File</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportJsonFile}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoadingJson(true);
                      exportDatabaseConfig()
                        .then((data) => setRawJson(JSON.stringify(data, null, 2)))
                        .finally(() => setLoadingJson(false));
                    }}
                    className="px-3 py-1.5 rounded-lg text-stone-400 hover:text-white text-xs font-medium flex items-center gap-1 transition"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reload</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveRawJson}
                    disabled={saving}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow transition disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Applying...' : 'Apply JSON'}</span>
                  </button>
                </div>
              </div>

              {/* Reset Confirmation Modal/Box */}
              {confirmReset && (
                <div className="p-4 rounded-xl bg-red-950/90 border border-red-800 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-red-200 text-xs font-bold">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span>Warning: Restore Factory Defaults</span>
                  </div>
                  <p className="text-xs text-red-300">
                    This will restore all default Pampore Kashmir barbers, services, and default text configurations. Are you sure?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetDefaults}
                      className="px-3.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition"
                    >
                      Yes, Restore Defaults
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmReset(false)}
                      className="px-3.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Raw JSON Code Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                  <span>salon_db.json representation:</span>
                  <span>{rawJson ? `${(rawJson.length / 1024).toFixed(1)} KB` : 'Loading...'}</span>
                </div>
                <textarea
                  rows={20}
                  value={rawJson}
                  onChange={(e) => setRawJson(e.target.value)}
                  disabled={loadingJson}
                  className="w-full p-4 rounded-xl bg-[#0B0F0D] border border-stone-800 text-emerald-300 font-mono text-xs focus:outline-none focus:border-emerald-500 leading-relaxed resize-y scrollbar-thin"
                  spellCheck={false}
                />
              </div>

            </div>
          )}

        </div>

        {/* Footer info bar */}
        <footer className="px-5 py-3 bg-[#0F1411] border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-emerald-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Dev Console Live</span>
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400 text-[11px]">
              {business.name} · {business.region_badge || 'Pampore · Kashmir'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-500 font-mono">
              Developed by Shujaat
            </span>
            <button
              onClick={handleLogout}
              className="text-stone-400 hover:text-red-400 text-[11px] transition underline"
            >
              Exit Developer Desk
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
};
