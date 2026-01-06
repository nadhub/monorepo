import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Language = 'fr' | 'en';

interface Translations {
  [key: string]: string;
}

interface AllTranslations {
  fr: Translations;
  en: Translations;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly LANGUAGE_STORAGE_KEY = 'language';
  private _currentLanguage = signal<Language>('fr');
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  // Public readonly signal
  currentLanguage = this._currentLanguage.asReadonly();
  
  // Translations object
  private translations: AllTranslations = {
    fr: {
      // Header
      app_title: "Analyse des Rebonds d'Emails",
      
      // Documentation Cards
      doc_card1_title: "Qu'est-ce que cet outil ?",
      doc_card1_text: "Un système alimenté par l'IA qui analyse automatiquement les rebonds d'emails, les classifie, extrait les informations de contact et génère des recommandations actionnables pour maintenir votre base de données marketing propre et à jour.",
      doc_card2_title: "Comment utiliser",
      doc_card2_step1_bold: "Cliquez",
      doc_card2_step1_text: "sur le bouton de campagne ci-dessous pour voir la démo",
      doc_card2_step2_bold: "Cliquez",
      doc_card2_step2_text: "sur les emails rebondis pour les analyser",
      doc_card2_step3_bold: "Visualisez",
      doc_card2_step3_text: "les contacts et actions extraits par l'IA",
      doc_card3_title: "Classifications",
      doc_card3_class1_name: "Problèmes Techniques",
      doc_card3_class1_desc: "- Adresse invalide",
      doc_card3_class2_name: "Départ Employé",
      doc_card3_class2_desc: "- A quitté l'entreprise",
      doc_card3_class3_name: "Absence Temporaire",
      doc_card3_class3_desc: "- En vacances",
      doc_card3_class4_name: "Mise à Jour Email",
      doc_card3_class4_desc: "- Nouvelle adresse",
      doc_card3_class5_name: "Désabonnement",
      doc_card3_class5_desc: "- Demande de retrait",
      
      // Campaign Section
      campaign_title: 'Campagne "Nouveaux Services 2025"',
      campaign_desc: "Lancement d'une campagne marketing ciblée vers ",
      campaign_desc_key: "décideurs clés",
      campaign_desc2: " dans les secteurs automobile et industriel. Les contenus personnalisés et les segments affinés visent à maximiser l'engagement et générer de nouvelles opportunités commerciales.",
      
      // Action Section
      action_title: "Le moment est venu !",
      action_description: "Une dernière vérification des paramètres avant le lancement. Tout est prêt pour envoyer la campagne...",
      launch_button: "Lancer la Campagne",
      
      // Loading Section
      loading_title: "Outbox - Envoi en cours",
      
      // Notifications
      notif2_title: "Campagne envoyée !",
      notif2_text: "Les emails ont été envoyés avec succès. Consultez les résultats en temps réel ci-dessous.",
      notif3_title: "Alerte : Rebonds détectés",
      notif3_count: "5 emails ont rebondi",
      notif3_text: "avec des réponses automatiques. L'analyse IA permet d'extraire automatiquement les informations pertinentes pour optimiser votre base de contacts.",
      
      // Stats
      stats_title: "Résultats en Temps Réel",
      stat_sent: "Emails Envoyés",
      stat_delivered: "Livrés",
      stat_bounces: "Rebonds",
      stat_success: "Taux de Succès",
      
      // Bounce Section
      bounce_title: "Inbox : Emails Rebondis",
      bounce_inst_bold: "Analyse des réponses automatiques.",
      bounce_inst_text: "Cliquez sur chaque email pour découvrir les informations clés. L'IA va extraire automatiquement les insights commerciaux pertinents...",
      
      // AI Loading
      ai_loading: "Traitement du langage naturel...",
      
      // Results Table
      results_title: "Résultats d'Analyse",
      classification_label: "Classification :",
      table_action: "Action",
      table_email: "Email",
      table_name: "Nom",
      table_job: "Poste",
      table_phone: "Téléphone",
      table_org: "Organisation",
      table_explanation: "Explication",
      
      // Success Message
      success_title: "Mission Accomplie !",
      success_text1: "Tous les emails ont été analysés avec succès. L'équipe dispose maintenant d'",
      success_text2: "insights précieux",
      success_text3: " pour optimiser les prochaines campagnes et identifier de nouvelles opportunités commerciales. Grâce à l'IA, ce qui prenait des heures a été fait en quelques minutes !",
      
      // Footer
      footer_rights: "Tous droits réservés.",
      footer_text: "Système d'Analyse des Rebonds d'Emails",
      
      // Email Display
      email_from: "De:",
      email_bounce_type: "Type de rebond:",
      email_time: "Heure de réception:"
    },
    en: {
      // Header
      app_title: "Email Bounce Analysis",
      
      // Documentation Cards
      doc_card1_title: "What is this tool?",
      doc_card1_text: "An AI-powered system that automatically analyzes email bounces, classifies them, extracts contact information, and generates actionable recommendations to keep your marketing database clean and up-to-date.",
      doc_card2_title: "How to use",
      doc_card2_step1_bold: "Click",
      doc_card2_step1_text: "the campaign button below to see the demo",
      doc_card2_step2_bold: "Click",
      doc_card2_step2_text: "on bounce emails to analyze them",
      doc_card2_step3_bold: "View",
      doc_card2_step3_text: "AI-extracted contacts and actions",
      doc_card3_title: "Classifications",
      doc_card3_class1_name: "Technical Issues",
      doc_card3_class1_desc: "- Invalid address",
      doc_card3_class2_name: "Employee Departure",
      doc_card3_class2_desc: "- Left company",
      doc_card3_class3_name: "Temporary Absence",
      doc_card3_class3_desc: "- On vacation",
      doc_card3_class4_name: "Email Update",
      doc_card3_class4_desc: "- New address",
      doc_card3_class5_name: "Unsubscribe",
      doc_card3_class5_desc: "- Opt-out request",
      
      // Campaign Section
      campaign_title: 'Campaign "New Services 2025"',
      campaign_desc: "Launch of a targeted marketing campaign to ",
      campaign_desc_key: "key decision-makers",
      campaign_desc2: " in the automotive and industrial sectors. Personalized content and refined segments aim to maximize engagement and generate new business opportunities.",
      
      // Action Section
      action_title: "The moment has come!",
      action_description: "One final check of the parameters before launch. Everything is ready to send the campaign...",
      launch_button: "Launch Campaign",
      
      // Loading Section
      loading_title: "Outbox - Sending in progress",
      
      // Notifications
      notif2_title: "Campaign sent!",
      notif2_text: "Emails have been sent successfully. Check the real-time results below.",
      notif3_title: "Alert: Bounces detected",
      notif3_count: "5 emails have bounced",
      notif3_text: "with automatic replies. AI analysis allows automatic extraction of relevant information to optimize your contact database.",
      
      // Stats
      stats_title: "Real-Time Results",
      stat_sent: "Emails Sent",
      stat_delivered: "Delivered",
      stat_bounces: "Bounces",
      stat_success: "Success Rate",
      
      // Bounce Section
      bounce_title: "Inbox: Bounced Emails",
      bounce_inst_bold: "Automatic reply analysis.",
      bounce_inst_text: "Click on each email to discover key information. The AI will automatically extract relevant business insights...",
      
      // AI Loading
      ai_loading: "Natural language processing...",
      
      // Results Table
      results_title: "Analysis Results",
      classification_label: "Classification:",
      table_action: "Action",
      table_email: "Email",
      table_name: "Name",
      table_job: "Position",
      table_phone: "Phone",
      table_org: "Organization",
      table_explanation: "Explanation",
      
      // Success Message
      success_title: "Mission Accomplished!",
      success_text1: "All emails have been successfully analyzed. The team now has ",
      success_text2: "valuable insights",
      success_text3: " to optimize future campaigns and identify new business opportunities. Thanks to AI, what took hours was done in minutes!",
      
      // Footer
      footer_rights: "All rights reserved.",
      footer_text: "Email Bounce Analysis System",
      
      // Email Display
      email_from: "From:",
      email_bounce_type: "Bounce type:",
      email_time: "Received at:"
    }
  };
  
  constructor() {
    // Initialize language from localStorage or default to French
    this.initLanguage();
  }
  
  /**
   * Initialize language from localStorage
   */
  private initLanguage(): void {
    if (!this.isBrowser) return;
    
    const savedLang = localStorage.getItem(this.LANGUAGE_STORAGE_KEY) as Language | null;
    if (savedLang) {
      this._currentLanguage.set(savedLang);
    }
  }
  
  /**
   * Toggle between French and English
   */
  toggleLanguage(): void {
    const newLang = this._currentLanguage() === 'fr' ? 'en' : 'fr';
    this.setLanguage(newLang);
  }
  
  /**
   * Set specific language
   */
  setLanguage(lang: Language): void {
    this._currentLanguage.set(lang);
    if (this.isBrowser) {
      localStorage.setItem(this.LANGUAGE_STORAGE_KEY, lang);
    }
  }
  
  /**
   * Get translation for a key
   */
  translate(key: string): string {
    const lang = this._currentLanguage();
    return this.translations[lang][key] || key;
  }
  
  /**
   * Get current language icon
   */
  getLanguageIcon(): string {
    return this._currentLanguage() === 'fr' ? '🇫🇷' : '🇬🇧';
  }
  
  /**
   * Get current language code
   */
  getLanguageCode(): string {
    return this._currentLanguage().toUpperCase();
  }
}