import { Component, signal, inject, ElementRef, ViewChild, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationService } from '../../core/services/translation.service';
import { IconService } from '../../core/services/icon.service';
import { BadgeComponent, BadgeVariant } from '../../shared/components/ui/badge/badge.component';
import { StatCardComponent } from '../../shared/components/ui/stat-card/stat-card.component';

interface BounceEmail {
  id: number;
  sender: string;
  preview: string;
  type: string;
  badgeClass: string;
  icon: string;
  fullBody: string;
  results: AnalysisResult[];
}

interface AnalysisResult {
  classification: string;
  action: string;
  email: string;
  name: string;
  job: string;
  phone: string;
  org: string;
  explanation: string;
  badgeClass: string;
  actionClass: string;
}

interface SampleEmail {
  from: string;
  to: string;
  subject: string;
  preview: string;
}

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, BadgeComponent, StatCardComponent],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent {
  translationService = inject(TranslationService);
  iconService = inject(IconService);
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  
  @ViewChild('emailListContainer', { read: ElementRef }) emailListContainer?: ElementRef;
  
  // State signals
  showLaunchSection = signal(true);
  showLoadingSection = signal(false);
  showNotif2 = signal(false);
  showStatsSection = signal(false);
  showNotif3 = signal(false);
  showBounceSection = signal(false);
  showAnalysisSection = signal(false);
  showResultsSection = signal(false);
  showSuccessMessage = signal(false);
  
  analyzedCount = signal(0);
  totalBounces = signal(5);
  analyzedEmailIds = signal<Set<number>>(new Set());
  currentEmailSender = signal<string>('');
  currentEmailType = signal<string>('');
  currentEmailBody = signal<string>('');
  currentResults = signal<AnalysisResult[]>([]);
  currentClassification = signal<string>('');
  showAiLoading = signal(false);
  
  bounceEmails: BounceEmail[] = [
    {
      id: 1,
      sender: "veronique.sample@jtekt-europe.com",
      preview: "Hello, I leave JTEKT for retirement. Lionel TERRIER will replace me...",
      type: "DÉPART",
      badgeClass: "badge-departure",
      icon: "user",
      fullBody: "Hello \n\nI leave JTEKT for retirement. Thank you for your good collaboration.\n\nLionel TERRIER will replace me:\nLionel TERRIER\nJTEKT Europe - Purchasing Department\nIndirects and Investments Group Manager\nTel: +33 (0)4.72.39.00.00\nCell: +33 (0)6.76.56.00.00\nlionel.terrier@exemple.eu\n\nStay safe!\n\nBest regards,\nVéronique Sample",
      results: [
        {
          classification: "Employee_Departure",
          action: "delete_contact",
          email: "veronique.sample@jtekt-europe.com",
          name: "Véronique Sample",
          job: "",
          phone: "",
          org: "JTEKT Europe",
          explanation: "Véronique Sample part à la retraite. Contact à supprimer de la base.",
          badgeClass: "badge-employee-departure",
          actionClass: "badge-delete"
        },
        {
          classification: "Employee_Departure",
          action: "add_new_contact",
          email: "lionel.terrier@exemple.eu",
          name: "Lionel TERRIER",
          job: "Indirects and Investments Group Manager",
          phone: "+33 (0)4.72.39.00.00 / +33 (0)6.76.56.00.00",
          org: "JTEKT Europe",
          explanation: "Nouveau contact de remplacement identifié automatiquement par l'IA.",
          badgeClass: "badge-employee-departure",
          actionClass: "badge-add"
        }
      ]
    },
    {
      id: 2,
      sender: "sebastien.bachem@sante.gouv.fr",
      preview: "Merci de m'écrire sur ma nouvelle adresse : sebastien_2.sample@exemple.gouv.fr...",
      type: "NOUVEAU",
      badgeClass: "badge-contact",
      icon: "mail",
      fullBody: "Bonjour,\n\nMerci de m'écrire sur ma nouvelle adresse mail : sebastien_2.sample@exemple.gouv.fr\n\nBien à vous,\n\nSébastien BACHEM\nDirecteur du Pole des Projets de E-Santé",
      results: [
        {
          classification: "Email_Update",
          action: "delete_contact",
          email: "sebastien.bachem@sante.gouv.fr",
          name: "Sébastien BACHEM",
          job: "Directeur du Pole des Projets de E-Santé",
          phone: "",
          org: "Ministère de la Santé",
          explanation: "Ancienne adresse email obsolète à supprimer.",
          badgeClass: "badge-add",
          actionClass: "badge-delete"
        },
        {
          classification: "Email_Update",
          action: "add_new_contact",
          email: "sebastien_2.sample@exemple.gouv.fr",
          name: "Sébastien BACHEM",
          job: "Directeur du Pole des Projets de E-Santé",
          phone: "",
          org: "Ministère de la Santé",
          explanation: "Nouvelle adresse email extraite automatiquement.",
          badgeClass: "badge-add",
          actionClass: "badge-add"
        }
      ]
    },
    {
      id: 3,
      sender: "veronique.dupont@sante.gouv.fr",
      preview: "En déplacement professionnel jusqu'au 25 novembre. Contacter Greg MARTIN...",
      type: "ABSENCE",
      badgeClass: "badge-autoreply",
      icon: "clock",
      fullBody: "Bonjour,\n\nJe suis en déplacement professionnel et indisponible jusqu'au 25 novembre 2025.\n\nPour toute question urgente, merci de contacter :\n- Greg MARTIN — greg.martin@exemple.gouv.fr — +33 1 98 76 54 32\n- Ou l'équipe e-santé : esante@exemple.gouv.fr",
      results: [
        {
          classification: "Temporary_Absence",
          action: "add_new_contact",
          email: "greg.martin@exemple.gouv.fr",
          name: "Greg MARTIN",
          job: "",
          phone: "+33 1 98 76 54 32",
          org: "",
          explanation: "Contact d'urgence identifié pour la période d'absence.",
          badgeClass: "badge-autoreply",
          actionClass: "badge-add"
        },
        {
          classification: "Temporary_Absence",
          action: "add_new_contact",
          email: "esante@exemple.gouv.fr",
          name: "Équipe e-santé",
          job: "",
          phone: "",
          org: "",
          explanation: "Contact alternatif de l'équipe extrait automatiquement.",
          badgeClass: "badge-autoreply",
          actionClass: "badge-add"
        }
      ]
    },
    {
      id: 4,
      sender: "marie.lambert@michelin.com",
      preview: "Changement de poste : nouvelle adresse marie.lambert@michelingroup.com...",
      type: "NOUVEAU",
      badgeClass: "badge-contact",
      icon: "mail",
      fullBody: "Bonjour,\n\nSuite à mon changement de poste, je vous informe que mon adresse email a changé.\n\nMa nouvelle adresse : marie.lambert@michelingroup.com\n\nCordialement,\n\nMarie LAMBERT\nDirectrice Innovation & Développement Durable\nMichelin Group\nTél: +33 4 73 32 20 00",
      results: [
        {
          classification: "Email_Update",
          action: "delete_contact",
          email: "marie.lambert@michelin.com",
          name: "Marie LAMBERT",
          job: "Directrice Innovation & Développement Durable",
          phone: "+33 4 73 32 20 00",
          org: "Michelin",
          explanation: "Ancienne adresse email suite à changement de poste.",
          badgeClass: "badge-add",
          actionClass: "badge-delete"
        },
        {
          classification: "Email_Update",
          action: "add_new_contact",
          email: "marie.lambert@michelingroup.com",
          name: "Marie LAMBERT",
          job: "Directrice Innovation & Développement Durable",
          phone: "+33 4 73 32 20 00",
          org: "Michelin Group",
          explanation: "Nouvelle adresse email avec fonction mise à jour.",
          badgeClass: "badge-add",
          actionClass: "badge-add"
        }
      ]
    },
    {
      id: 5,
      sender: "jean.martin@renault.fr",
      preview: "Départ en congé parental prolongé. Mon remplaçant : thomas.durand@renault.fr...",
      type: "ABSENCE",
      badgeClass: "badge-autoreply",
      icon: "clock",
      fullBody: "Bonjour,\n\nJe serai en congé parental prolongé à partir du 1er décembre 2025 pour une durée de 6 mois.\n\nDurant mon absence, vous pouvez contacter mon remplaçant :\n\nThomas DURAND\nResponsable Achats Stratégiques\nEmail: thomas.durand@renault.fr\nTél: +33 1 76 84 00 00\nMobile: +33 6 12 34 56 78\n\nBien cordialement,\n\nJean MARTIN\nRenault Group",
      results: [
        {
          classification: "Temporary_Absence",
          action: "add_new_contact",
          email: "thomas.durand@renault.fr",
          name: "Thomas DURAND",
          job: "Responsable Achats Stratégiques",
          phone: "+33 1 76 84 00 00 / +33 6 12 34 56 78",
          org: "Renault Group",
          explanation: "Remplaçant temporaire pendant congé parental de 6 mois.",
          badgeClass: "badge-autoreply",
          actionClass: "badge-add"
        }
      ]
    }
  ];
  
  sampleEmails: SampleEmail[] = [
    {
      from: "marketing@pwc.fr",
      to: "j.dupont@renault.com",
      subject: "Nouveaux Services 2025 - Solutions innovantes pour Renault",
      preview: "Bonjour Jean, Nous sommes ravis de vous présenter nos nouveaux services..."
    },
    {
      from: "marketing@pwc.fr",
      to: "m.martin@stellantis.com",
      subject: "Nouveaux Services 2025 - Optimisation de votre performance",
      preview: "Bonjour Marie, Découvrez comment nos solutions peuvent transformer..."
    },
    {
      from: "marketing@pwc.fr",
      to: "t.bernard@valeo.com",
      subject: "Nouveaux Services 2025 - Innovation et expertise",
      preview: "Bonjour Thomas, PwC vous accompagne dans vos défis stratégiques..."
    },
    {
      from: "marketing@pwc.fr",
      to: "s.claire@forvia.com",
      subject: "Nouveaux Services 2025 - Partenariat stratégique",
      preview: "Bonjour Sophie, Explorez nos services dédiés à l'industrie automobile..."
    },
    {
      from: "marketing@pwc.fr",
      to: "l.petit@michelin.com",
      subject: "Nouveaux Services 2025 - Excellence opérationnelle",
      preview: "Bonjour Lucas, Transformez votre entreprise avec nos solutions..."
    },
    {
      from: "marketing@pwc.fr",
      to: "e.roux@plasticomnium.com",
      subject: "Nouveaux Services 2025 - Croissance durable",
      preview: "Bonjour Emma, Accélérez votre transformation digitale avec PwC..."
    },
    {
      from: "marketing@pwc.fr",
      to: "a.moreau@continental.fr",
      subject: "Nouveaux Services 2025 - Solutions sur-mesure",
      preview: "Bonjour Antoine, Nos experts sont à votre disposition pour..."
    },
    {
      from: "marketing@pwc.fr",
      to: "j.simon@bosch.fr",
      subject: "Nouveaux Services 2025 - Accompagnement personnalisé",
      preview: "Bonjour Julie, Découvrez nos offres exclusives pour le secteur..."
    },
    {
      from: "marketing@pwc.fr",
      to: "p.laurent@schaeffler.com",
      subject: "Nouveaux Services 2025 - Performance et innovation",
      preview: "Bonjour Pierre, PwC vous propose des solutions adaptées à vos..."
    },
    {
      from: "marketing@pwc.fr",
      to: "c.dubois@safran.com",
      subject: "Nouveaux Services 2025 - Expertise sectorielle",
      preview: "Bonjour Camille, Profitez de notre expertise reconnue dans..."
    }
  ];
  
  launchCampaign(): void {
    this.showLaunchSection.set(false);
    this.showLoadingSection.set(true);
    
    // Wait for view to render, then populate email list with animations
    setTimeout(() => {
      this.populateEmailList();
    }, 100);
  }
  
  private populateEmailList(): void {
    if (!this.isBrowser || !this.emailListContainer) return;
    
    const container = this.emailListContainer.nativeElement;
    container.innerHTML = '';
    
    this.sampleEmails.forEach((email, index) => {
      const emailItem = document.createElement('div');
      emailItem.id = `email-${index}`;
      emailItem.className = 'email-item';
      emailItem.style.cssText = 'padding: 1rem; background: var(--input-background); border: 2px solid var(--border-color); border-radius: 8px; opacity: 0.3; transition: all 0.4s;';
      
      emailItem.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
          <div style="flex: 1;">
            <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.25rem;">
              <span style="font-size: 0.75rem; color: var(--text-secondary);">De:</span>
              <span style="font-size: 0.75rem; color: var(--text-primary); font-family: 'Courier New', monospace;">${email.from}</span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="font-size: 0.75rem; color: var(--text-secondary);">À:</span>
              <span style="font-size: 0.75rem; color: var(--text-primary); font-family: 'Courier New', monospace;">${email.to}</span>
            </div>
          </div>
          <div id="status-${index}" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-secondary); padding: 0.25rem 0.75rem; background: var(--border-color); border-radius: 12px;">
            En attente
          </div>
        </div>
        <div style="font-weight: 600; color: var(--text-primary); font-size: 0.875rem; margin-bottom: 0.25rem;">${email.subject}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">${email.preview}</div>
      `;
      
      container.appendChild(emailItem);
      
      // Animate sending
      setTimeout(() => {
        const statusBadge = document.getElementById(`status-${index}`);
        if (!emailItem || !statusBadge) return;
        
        // Mark as sending
        emailItem.style.opacity = '1';
        emailItem.style.background = 'var(--card-background)';
        emailItem.style.borderColor = '#e8460a';
        statusBadge.style.background = 'linear-gradient(135deg, #e8460a 0%, #f06b39 100%)';
        statusBadge.style.color = 'white';
        statusBadge.textContent = 'Envoi...';
        
        // Mark as sent after delay
        setTimeout(() => {
          emailItem.style.borderColor = '#28A745';
          statusBadge.style.background = '#28A745';
          statusBadge.textContent = '✓ Envoyé';
          
          if (index === this.sampleEmails.length - 1) {
            setTimeout(() => this.showCampaignResults(), 1000);
          }
        }, 1000);
      }, index * 600);
    });
  }
  
  private showCampaignResults(): void {
    this.showLoadingSection.set(false);
    this.showNotif2.set(true);
    
    setTimeout(() => {
      this.showStatsSection.set(true);
      
      setTimeout(() => {
        this.showNotif3.set(true);
        
        setTimeout(() => {
          this.showBounceSection.set(true);
        }, 1000);
      }, 1500);
    }, 1000);
  }
  
  analyzeEmail(email: BounceEmail): void {
    // Reset sections to show loading animation again
    this.showResultsSection.set(false);
    this.showAnalysisSection.set(true);
    this.currentEmailSender.set(email.sender);
    this.currentEmailType.set(email.type);
    this.currentEmailBody.set(email.fullBody);
    this.showAiLoading.set(true);
    
    // Check if this email was already analyzed
    const wasAlreadyAnalyzed = this.analyzedEmailIds().has(email.id);
    
    setTimeout(() => {
      this.showAiLoading.set(false);
      this.currentResults.set(email.results);
      this.currentClassification.set(email.results[0]?.classification || '');
      this.showResultsSection.set(true);
      
      // Only increment count if this email hasn't been analyzed before
      if (!wasAlreadyAnalyzed) {
        this.analyzedEmailIds.update(ids => {
          const newIds = new Set(ids);
          newIds.add(email.id);
          return newIds;
        });
        this.analyzedCount.update(count => count + 1);
        
        if (this.analyzedCount() === this.totalBounces()) {
          setTimeout(() => {
            this.showSuccessMessage.set(true);
          }, 2000);
        }
      }
    }, 2800);
  }
  
  isEmailAnalyzed(emailId: number): boolean {
    return this.analyzedEmailIds().has(emailId);
  }
  
  getBadgeVariant(badgeClass: string): BadgeVariant {
    const variantMap: Record<string, BadgeVariant> = {
      'badge-departure': 'departure',
      'badge-contact': 'contact',
      'badge-autoreply': 'autoreply',
      'badge-employee-departure': 'employee-departure',
      'badge-delete': 'delete',
      'badge-add': 'add'
    };
    return variantMap[badgeClass] || 'primary';
  }
  
  /**
   * Get sanitized icon HTML
   */
  getIcon(name: string): SafeHtml {
    const iconHtml = this.iconService.renderIcon(name as any, 24);
    return this.sanitizer.bypassSecurityTrustHtml(iconHtml);
  }
}